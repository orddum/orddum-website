# Orddum — site institucional

Site estático da **Orddum Serviços de Tecnologia LTDA** (Itabira, MG), hospedado
no Firebase Hosting em [orddum.com](https://orddum.com).

Ele é um **portfólio**: apresenta os apps da empresa, leva para as lojas e
publica a política de privacidade e os termos de cada um.

## As URLs que NÃO podem quebrar

Estas quatro estão gravadas em app publicado e/ou nos painéis das lojas. Mudar
qualquer uma delas derruba a ficha de um app em produção — e a revisão das lojas
**abre o link**.

| URL | Quem depende dela |
|---|---|
| `/lastro/privacidade/` | App Store Connect e Play Console do Lastro; a `PaywallScreen` do app |
| `/lastro/termos/` | idem |
| `/#contato` | URL de suporte na ficha da App Store do Lastro |
| `/lastro/importar/` | O app do Lastro (Ajustes › Seus dados › "Trazer dados de uma planilha ou de outro app", `AppConfig.importGuideUrl`). Os dois arquivos ao lado dela — `lastro-modelo-para-ia.md` e `lastro-modelo.json` — são **cópias** geradas em `lastro/tools/import-template/`; não edite aqui, regere lá e copie |
| `/ipi/privacidade/` | Play Console e App Store Connect do IPI App; o link "Política de Privacidade" do app a partir da 1.14.3 |
| `/app-ads.txt` | **AdMob**: é onde ele confere que o `pub-2322862933504397` pode vender o inventário do Lastro. Sem o arquivo, boa parte dos compradores não dá lance, e o painel avisa. Tem que ser `text/plain` na RAIZ do domínio da ficha, e a ficha diz `orddum.com` |
| `/` (raiz) | as versões do IPI App **já instaladas** (até a 1.14.1): o link do diálogo "Sobre" delas abre `www.orddum.com`, e vai continuar abrindo por todo o tempo em que alguém não atualizar |

A forma **com barra final** é a que vai nos painéis. Sem a barra, o Hosting
responde 301 para a versão com barra — funciona, mas os três lugares devem dizer
a mesma coisa.

> O remendo da raiz foi desfeito em 21/09/2026: as duas lojas do IPI e o app
> (agora `AppConfig.privacyPolicy`) apontam para `/ipi/privacidade/`.
>
> **A raiz continua na tabela mesmo assim**, e essa é a parte que se esquece: a
> troca no app só chega a quem atualizar, e uma loja leva o que foi enviado, não
> o que está instalado. Enquanto houver 1.14.1 em uso, a seção
> `id="privacidade"` da home **não pode ser renomeada** — é ela que leva da raiz
> até a política em um clique.

## Identidade visual

A paleta sai do **logo**, não de uma referência externa. Os valores foram
amostrados pixel a pixel de `public/logo_large.png` e estão documentados no topo
de [`public/styles.css`](public/styles.css):

| Cor | Onde está no logo |
|---|---|
| `#D1CDB6` | o corpo do wordmark ORDDUM — o bege da carcaça do Super Famicom |
| `#05A83F` `#1581DF` `#F20103` `#FFD604` | as quatro barras, de cima para baixo: as cores dos botões do Super Famicom (Y verde, X azul, A vermelho, B amarelo) |
| `#000000` | o fundo |

São a família **japonesa/europeia**. O SNES norte-americano é o do roxo e
lavanda, e não é o que este logo usa.

**As quatro são acento, nunca superfície.** O logo é 81% preto, 14% bege e 0,4%
colorido; inverter essa proporção transforma a marca num arco-íris.

## Estrutura

```
public/
├── index.html                    # portfólio (hero, apps, Lastro, contato, legal)
├── styles.css                    # tokens da marca + toda a landing page
├── legal.css                     # só o texto corrido das páginas legais
├── script.js                     # menu mobile e marcação da seção ativa
├── app-ads.txt                   # autorização do AdMob (IAB app-ads.txt), lido pelo Google
├── robots.txt                    # explícito: sem ele o rewrite ** devolvia a home em HTML no lugar dele
├── logo.png  logo_large.png      # material da marca, fundo preto chapado
├── img/
│   ├── logo-mark.png             # os mesmos logos com alfa, para uso na página
│   ├── logo-wordmark.png
│   ├── og.png                    # capa de compartilhamento 1200×630
│   ├── lastro/{icon,capa}.png    # ícone e feature graphic, de lastro/store/
│   ├── lastro/screens/*.webp     # as 6 capturas da App Store, reduzidas
│   ├── ipi/{icon,capa}.png       # idem, de ipi_app/store/
│   └── ipi/screens/*.webp
├── lastro/{privacidade,termos}/  # texto legal do Lastro
├── lastro/importar/              # o modelo de importação para IA (página + .md + .json copiados do app)
└── ipi/privacidade/              # texto legal do IPI App
```

As imagens dos apps são **cópias**. Cada app tem vitrine própria na home
(`#lastro` e `#ipi`), e quem gera essas imagens é o repositório do app — o
passo que as copia para cá está no `store/README.md` de cada um. Não edite nem
regere nada de `img/lastro/` ou `img/ipi/` por aqui: este repositório é o site,
e o que ele sabe sobre um app é só onde a imagem dele mora.

## Rodar local

```bash
firebase emulators:start --only hosting     # replica rewrites e index de diretório
```

`python3 -m http.server` também serve, mas **não** reproduz o 301 da URL sem
barra final nem o rewrite do `firebase.json` — e é justamente aí que mora o
contrato de URLs acima.

## Deploy

**Automático no merge da `main`**, por GitHub Actions
(`.github/workflows/firebase-hosting-merge.yml`). Pull request ganha um canal de
preview. Não rode `firebase deploy` à mão: o que está na `main` é o que está no
ar.

## Contato

- luiz.gonzaga@orddum.com · Itabira — MG, Brasil
- WhatsApp (31) 99527-9032 · [LinkedIn](https://www.linkedin.com/in/luizgonzagabn/)

---

© 2026 Orddum Serviços de Tecnologia LTDA
