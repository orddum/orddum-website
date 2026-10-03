# CLAUDE.md — orddum-website (orddum.com)

> Última atualização: 2026-10-03

Site estático da Orddum no Firebase Hosting (projeto `orddum`). Repositório
**PÚBLICO** com deploy automático a cada push na `main` (GitHub Actions): nada
reservado entra aqui, nem em branch. O que é da empresa e dos apps está no
`~/projects/flutter-app-kit` (ver `WORKSPACE.md` e `docs/portfolio.md` lá).

## O que não pode quebrar

A tabela de URLs gravadas em apps publicados e nos painéis das lojas está no
[`README.md`](README.md) § "As URLs que NÃO podem quebrar". Antes de renomear,
mover ou apagar qualquer caminho em `public/`, confira a tabela — a revisão das
lojas abre o link, e um 404 derruba a ficha de um app em produção. Forma
canônica: **com barra final**.

Todo path responde 200 (rewrite `**` → `index.html`): status HTTP não prova que
uma página existe; compare o conteúdo (`curl -s <url> | grep <texto>`).

## Páginas por app

`public/<app>/privacidade/`, `public/<app>/termos/` e páginas auxiliares
(`public/lastro/importar/`). O texto canônico de privacidade e termos é
versionado **no repositório do app** (`docs/politica-de-privacidade.md` etc.) e
publicado aqui a partir dele; arquivos gerados (modelo de importação do Lastro)
são cópias — regere no app e copie, não edite aqui. Quem decide o conteúdo
legal: skill `legal` do kit e `docs/legal-compliance.md`.

`public/app-ads.txt` é do AdMob: `text/plain`, ASCII puro, na raiz.

## Comandos

```bash
firebase emulators:start --only hosting      # preview local
firebase deploy --only hosting               # manual; o CI faz no merge da main
./check-domains-status.sh                    # DNS e SSL dos domínios
```

## Convenções

- HTML/CSS/JS estáticos, sem build. Mesma identidade visual do `README.md`
  § Identidade visual.
- Imagens de app em `public/img/<app>/`; vêm das capturas geradas pelo app
  (`store/`), nunca de goldens.
- Commit e push só quando o usuário pedir — push aqui é publicar.

## Conhecimento

Aprendizado que sirva a outros apps (Hosting, rewrite, DNS, o que a revisão das
lojas exige de uma página) vai para o kit pela skill `kit-sync`: doc dono
`release-playbook.md` ou `legal-compliance.md`. Este repositório não tem
`docs/aprendizados.md` nem hooks do kit — é site, não app.
