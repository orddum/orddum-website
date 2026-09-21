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
| `/` (raiz) | **URL de política de privacidade registrada nas duas lojas para o IPI App**, e o destino do link "Política de Privacidade" dentro do próprio app |

A forma **com barra final** é a que vai nos painéis. Sem a barra, o Hosting
responde 301 para a versão com barra — funciona, mas os três lugares devem dizer
a mesma coisa.

> A raiz na tabela acima é um remendo herdado, não um desenho. O certo é apontar
> as duas lojas do IPI e o `AppConfig.orddumSite` do `ipi_app` para
> `/ipi/privacidade/`, que existe desde o redesign. Enquanto isso não for feito,
> a seção `id="privacidade"` da home **não pode ser renomeada**: ela é o que
> leva um revisor da raiz até a política em um clique.

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
├── logo.png  logo_large.png      # material da marca, fundo preto chapado
├── img/
│   ├── logo-mark.png             # os mesmos logos com alfa, para uso na página
│   ├── logo-wordmark.png
│   ├── og.png                    # capa de compartilhamento 1200×630
│   ├── lastro/{icon,capa}.png    # ícone e feature graphic, de lastro/store/
│   ├── lastro/screens/*.webp     # as 6 capturas da App Store, reduzidas
│   └── ipi/icon.png
├── lastro/{privacidade,termos}/  # texto legal do Lastro
└── ipi/privacidade/              # texto legal do IPI App
```

As imagens dos apps são **cópias**, geradas a partir de
`~/projects/lastro/store/` e `~/projects/ipi_app/assets/images/`. Para regerar,
veja o cabeçalho do commit do redesign.

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
