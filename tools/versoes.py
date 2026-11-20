#!/usr/bin/env python3
"""
versoes.py — põe no site a versão que está de fato disponível de cada app.

    python3 tools/versoes.py            # consulta as lojas e reescreve public/
    python3 tools/versoes.py --check    # só diz o que mudaria (sai 1 se algo mudaria)

Fontes (públicas, sem chave):
  App Store       itunes.apple.com/lookup?id=<id>&country=br
  Google Play     a página do app (não há API pública; leitura frágil, por isso com memória)
  Kerux para Mac  a última release de github.com/orddum/kerux-releases (nome, tamanho e SHA-256 do .dmg)
  Kerux Windows   a release mais nova com tag windows-v* no mesmo repositório (o -Setup.exe);
                  escreve só dentro de <!-- kerux-windows-download --> … <!-- /kerux-windows-download -->

Onde escreve:
  - todo <span data-versao="<app>">…</span> em public/**/*.html recebe o texto da versão
    ("versão 1.4.1"; se as lojas divergem, "iOS 1.4.1 · Android 1.4.0"; para o Kerux para Mac, só "1.2.0");
  - na página public/kerux/index.html, o botão, o link, o nome, o tamanho e o SHA-256 do .dmg.
  - public/versoes.json guarda a última leitura boa de cada loja: se uma consulta falhar,
    vale o valor anterior (o site nunca perde a versão por uma falha de rede).

Quem roda: .github/workflows/versoes.yml (de hora em hora, no disparo manual e no
repository_dispatch "versao-nova" que o release de um app pode mandar). Ele commita e publica.
Para pôr um app novo: uma entrada em APPS e um <span data-versao="..."> na página.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
STATE = PUBLIC / "versoes.json"
KERUX_PAGE = PUBLIC / "kerux" / "index.html"
KERUX_RELEASES = "orddum/kerux-releases"

# App Store (id numérico) e Google Play (pacote). Sem loja pública (teste fechado), fica fora.
APPS: dict[str, dict[str, object]] = {
    "lastro": {"ios": 6814238551, "android": "com.orddum.lastro"},
    "ipi": {"ios": 6741813317, "android": "com.orddum.ipi"},
    "ararinha": {"ios": 6819347905, "android": "com.orddum.ararinha"},
    "faco-agora": {"ios": 6825797614, "android": "com.orddum.facoagora"},
    "kerux-app": {"ios": 6830302625, "android": "com.orddum.keruxapp"},
}

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
VERSION_RE = re.compile(r"^\d+(\.\d+){1,3}$")


def get(url: str, headers: dict[str, str] | None = None) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", "replace")


def ios_version(track_id: int) -> str | None:
    try:
        data = json.loads(get(f"https://itunes.apple.com/lookup?id={track_id}&country=br"))
        results = data.get("results") or []
        v = results[0].get("version") if results else None
        return v if v and VERSION_RE.match(v) else None
    except Exception as exc:  # noqa: BLE001
        print(f"  aviso: App Store {track_id}: {exc}", file=sys.stderr)
        return None


def android_version(package: str) -> str | None:
    """A página da Play traz a versão num bloco JS como [[["1.4.1"]]. Só aceita se for uma, sem ambiguidade."""
    try:
        html = get(f"https://play.google.com/store/apps/details?id={package}&hl=pt_BR&gl=BR")
        found = set(re.findall(r'\[\[\["(\d+\.\d+(?:\.\d+){0,2})"\]\]', html))
        return found.pop() if len(found) == 1 else None
    except Exception as exc:  # noqa: BLE001
        print(f"  aviso: Google Play {package}: {exc}", file=sys.stderr)
        return None


def kerux_mac_release() -> dict[str, object] | None:
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        rel = json.loads(get(f"https://api.github.com/repos/{KERUX_RELEASES}/releases/latest", headers))
    except Exception as exc:  # noqa: BLE001
        print(f"  aviso: GitHub Releases: {exc}", file=sys.stderr)
        return None
    version = str(rel.get("tag_name", "")).lstrip("v")
    dmg = next((a for a in rel.get("assets", []) if str(a.get("name", "")).endswith(".dmg")), None)
    digest = str(dmg.get("digest") or "") if dmg else ""
    if not VERSION_RE.match(version) or not dmg or not digest.startswith("sha256:"):
        print("  aviso: release do Kerux sem versão, .dmg ou SHA-256; mantendo o site como está", file=sys.stderr)
        return None
    return {
        "version": version,
        "name": dmg["name"],
        "size": int(dmg["size"]),
        "sha256": digest.split(":", 1)[1],
        "url": dmg["browser_download_url"],
    }


def kerux_windows_release() -> dict[str, object] | None:
    """A release mais nova com tag windows-v* (as do Windows não são a "Latest": essa é a do Mac)."""
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        releases = json.loads(get(f"https://api.github.com/repos/{KERUX_RELEASES}/releases?per_page=50", headers))
    except Exception as exc:  # noqa: BLE001
        print(f"  aviso: GitHub Releases (Windows): {exc}", file=sys.stderr)
        return None
    rel = next((r for r in releases if str(r.get("tag_name", "")).startswith("windows-v")
                and not r.get("draft") and not r.get("prerelease")), None)
    if not rel:
        return None
    version = str(rel["tag_name"])[len("windows-v"):]
    exe = next((a for a in rel.get("assets", []) if str(a.get("name", "")).endswith("-Setup.exe")), None)
    digest = str(exe.get("digest") or "") if exe else ""
    if not VERSION_RE.match(version) or not exe or not digest.startswith("sha256:"):
        print("  aviso: release do Kerux para Windows sem versão, instalador ou SHA-256; mantendo o site", file=sys.stderr)
        return None
    return {
        "version": version,
        "name": exe["name"],
        "size": int(exe["size"]),
        "sha256": digest.split(":", 1)[1],
        "url": exe["browser_download_url"],
    }


# O bloco do download do Windows na página do Kerux: as trocas do Mac (SHA-256, tamanho) não entram nele.
WINDOWS_BLOCK = re.compile(r"(<!-- kerux-windows-download -->)(.*?)(<!-- /kerux-windows-download -->)", re.S)


def apply_kerux_windows(html: str, rel: dict[str, object]) -> str:
    v, name, url = rel["version"], rel["name"], rel["url"]

    def block(m: re.Match[str]) -> str:
        b = m.group(2)
        b = re.sub(r"https://github\.com/orddum/kerux-releases/releases/download/windows-v[^\"\s]+\.exe", str(url), b)
        b = re.sub(r"Baixar Kerux \d+(?:\.\d+)+ para Windows", f"Baixar Kerux {v} para Windows", b)
        b = re.sub(r"Kerux-\d+(?:\.\d+)+-Setup\.exe", str(name), b)
        b = re.sub(r"(<strong>SHA-256:</strong> )[0-9a-f]{64}", lambda s: s.group(1) + str(rel["sha256"]), b)

        def size_sub(s: re.Match[str]) -> str:
            seps = re.findall(r"\d([^\d])\d", s.group(2))
            return fmt_size(int(rel["size"]), seps[0] if seps else " ")

        b = re.sub(r"(\d+,\d MB \()([\d   ]+)( bytes\))", size_sub, b)
        return m.group(1) + b + m.group(3)

    return WINDOWS_BLOCK.sub(block, html)


def outside_windows_block(html: str, change) -> str:
    """Aplica `change` só fora do bloco de download do Windows."""
    parts, last = [], 0
    for m in WINDOWS_BLOCK.finditer(html):
        parts.append(change(html[last:m.start()]))
        parts.append(m.group(0))
        last = m.end()
    parts.append(change(html[last:]))
    return "".join(parts)


def label(ios: str | None, android: str | None) -> str | None:
    if ios and android and ios != android:
        return f"iOS {ios} · Android {android}"
    v = ios or android
    return f"versão {v}" if v else None


def fmt_size(size: int, sep: str) -> str:
    mb = f"{size / 1_000_000:.1f}".replace(".", ",")
    grouped = f"{size:,}".replace(",", sep)
    return f"{mb} MB ({grouped} bytes)"


def apply_kerux_mac(html: str, rel: dict[str, object]) -> str:
    v, name, url = rel["version"], rel["name"], rel["url"]
    html = re.sub(r"https://github\.com/orddum/kerux-releases/releases/download/[^\"\s]+\.dmg", str(url), html)
    html = re.sub(r"Baixar Kerux \d+(?:\.\d+)+ para Mac", f"Baixar Kerux {v} para Mac", html)
    html = re.sub(r"Kerux-\d+(?:\.\d+)+\.dmg", str(name), html)
    html = re.sub(r"(<strong>SHA-256:</strong> )[0-9a-f]{64}", lambda m: m.group(1) + str(rel["sha256"]), html)

    def size_sub(m: re.Match[str]) -> str:
        seps = re.findall(r"\d([^\d])\d", m.group(2))
        return fmt_size(int(rel["size"]), seps[0] if seps else " ")

    html = re.sub(r"(\d+,\d MB \()([\d   ]+)( bytes\))", size_sub, html)
    return html


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true", help="não grava; sai 1 se algo mudaria")
    args = ap.parse_args()

    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    texts: dict[str, str] = {}

    for app, stores in APPS.items():
        prev = state.get(app, {})
        ios = ios_version(int(stores["ios"])) if "ios" in stores else None
        android = android_version(str(stores["android"])) if "android" in stores else None
        ios = ios or prev.get("ios")
        android = android or prev.get("android")
        state[app] = {k: v for k, v in (("ios", ios), ("android", android)) if v}
        text = label(ios, android)
        if text:
            texts[app] = text
        print(f"{app:12} iOS {ios or '-':8} Android {android or '-':8} → {text or '(sem versão)'}")

    rel = kerux_mac_release()
    if rel:
        state["kerux-mac"] = rel
    rel = rel or state.get("kerux-mac")
    if rel:
        texts["kerux-mac"] = str(rel["version"])
        print(f"{'kerux-mac':12} {rel['version']} · {rel['name']} · {rel['size']} bytes")

    win = kerux_windows_release()
    if win:
        state["kerux-windows"] = win
    win = win or state.get("kerux-windows")
    if win:
        texts["kerux-windows"] = str(win["version"])
        print(f"{'kerux-win':12} {win['version']} · {win['name']} · {win['size']} bytes")

    changed: list[str] = []
    for path in sorted(PUBLIC.rglob("*.html")):
        old = path.read_text()
        new = old
        for app, text in texts.items():
            new = re.sub(
                rf'(<span\b[^>]*\bdata-versao="{re.escape(app)}"[^>]*>)[^<]*(</span>)',
                lambda m, t=text: m.group(1) + t + m.group(2),
                new,
            )
        if path == KERUX_PAGE and rel:
            new = outside_windows_block(new, lambda part, r=rel: apply_kerux_mac(part, r))
        if path == KERUX_PAGE and win:
            new = apply_kerux_windows(new, win)
        if new != old:
            changed.append(str(path.relative_to(ROOT)))
            if not args.check:
                path.write_text(new)

    new_state = json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if not STATE.exists() or STATE.read_text() != new_state:
        changed.append(str(STATE.relative_to(ROOT)))
        if not args.check:
            STATE.write_text(new_state)

    print("mudou: " + ", ".join(changed) if changed else "nada mudou")
    return 1 if (args.check and changed) else 0


if __name__ == "__main__":
    sys.exit(main())
