# CLAUDE.md — orddum-website (orddum.com)

> Última atualização: 2026-11-18

Site estático da Orddum no Firebase Hosting (projeto `orddum`). Repositório
**PÚBLICO** com deploy automático a cada push na `main` (GitHub Actions): nada
reservado entra aqui, nem em branch. O que é da empresa e dos apps está no
`~/projects/orddum-kit` (ver `WORKSPACE.md` e `docs/portfolio.md` lá).

## O que não pode quebrar

A tabela de URLs gravadas em apps publicados e nos painéis das lojas está no
[`README.md`](README.md) § "As URLs que NÃO podem quebrar". Antes de renomear,
mover ou apagar qualquer caminho em `public/`, confira a tabela — a revisão das
lojas abre o link, e um 404 derruba a ficha de um app em produção. Forma
canônica: **com barra final**.

Todo path responde 200 (rewrite `**` → `index.html`): status HTTP não prova que
uma página existe; compare o conteúdo (`curl -s <url> | grep <texto>`).

## Regra: o site é um produto só

O orddum.com é o portfólio principal da Orddum. Toda melhoria de design ou de
estrutura (cabeçalho, rodapé, tipografia, espaçamento, componentes, movimento)
vale para TODAS as páginas — home e filhas (`/<app>/privacidade/`,
`/<app>/termos/`, `/lastro/importar/` e as que vierem) — no mesmo PR. Nunca
deixe uma página com o visual antigo. (Regra do Luiz, 22/10/2026.)

- Cabeçalho e rodapé são blocos idênticos em todas as páginas, entre
  `<!-- site-header -->` e `<!-- site-footer -->`; o que muda por página
  (link ativo) é feito no `script.js`.
- `tools/check-coerencia.sh` confere isso e roda em todo PR
  (`.github/workflows/coerencia.yml`).
- Página nova nasce do molde de uma filha existente, não do zero.
- Antes de publicar, verificar na tela a home e pelo menos uma filha de cada
  tipo (política, termos, importar), no desktop e no celular.

## Versões dos apps: automáticas, não se editam à mão

O número da versão de cada app (home e `/kerux/`) e o download do Kerux para Mac
(botão, nome, tamanho e SHA-256 do `.dmg`) são escritos por `tools/versoes.py`,
que lê o que está **de fato disponível**: App Store (lookup público), Google Play
(página do app) e a última release de `orddum/kerux-releases`. O workflow
`.github/workflows/versoes.yml` roda de hora em hora, à mão
(`gh workflow run versoes.yml -R orddum/orddum-website`) e no aviso
`repository_dispatch` `versao-nova`; se algo mudou, commita na `main` e publica
(ele mesmo faz o deploy: push do `GITHUB_TOKEN` não dispara outro workflow).
Última leitura boa em `public/versoes.json` (falha de rede não apaga versão).
App novo: entrada em `APPS` no script e `<span data-versao="<app>"></span>` na
página. Por isso o release de um app **não** precisa abrir PR no site só para
trocar número ou link do `.dmg` (aconteceu em 17/11/2026: a página do Kerux
Controle Remoto 1.5.0 ficou num commit local esperando a loja aprovar, e
ninguém voltou para publicar).

## Páginas por app

`public/<app>/privacidade/`, `public/<app>/termos/` e páginas auxiliares
(`public/lastro/importar/`). O texto canônico de privacidade e termos é
versionado **no repositório do app** (`docs/politica-de-privacidade.md` etc.) e
publicado aqui a partir dele; arquivos gerados (modelo de importação do Lastro)
são cópias — regere no app e copie, não edite aqui. Quem decide o conteúdo
legal: skill `legal` do kit e `docs/legal-compliance.md`.
Não há molde de política neste repositório (o `privacy-policy-template.md`
de 2025 saiu em 15/10/2026): o ponto de partida de uma política nova é o
`legal-compliance.md` do kit.

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
- Cache (`firebase.json` § headers): tudo `no-cache` (o navegador revalida
  pelo ETag a cada visita) e só `/img/**` com 1 h. CSS e JS não têm versão no
  nome, e com o padrão do Hosting (1 h para tudo) o deploy de 22/10/2026
  deixou HTML novo com CSS velho no cache: a home apareceu quebrada.

## Conhecimento

Aprendizado que sirva a outros apps (Hosting, rewrite, DNS, o que a revisão das
lojas exige de uma página) vai para o kit pela skill `kit-sync`: doc dono
`release-playbook.md` ou `legal-compliance.md`. Este repositório não tem
`docs/aprendizados.md` nem hooks do kit — é site, não app.
