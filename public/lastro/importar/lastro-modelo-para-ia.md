# Lastro — modelo de importação, para você e para a sua IA

> Formato 1 · gerado em 23/09/2026 · <https://orddum.com/lastro/importar/>

## Para você, que vai usar

O Lastro guarda seus dados **só no seu aparelho**: ele não lê extrato, não se
conecta a banco e não manda nada para servidor nenhum. Para trazer um histórico
que já existe — planilha, extratos em PDF, faturas, capturas de tela, a
exportação de outro app —, o caminho é este arquivo: **você entrega ele mais os
seus dados a uma IA da sua escolha, e ela devolve um arquivo `.json` que o
Lastro importa.**

Passo a passo:

1. Baixe este arquivo (`lastro-modelo-para-ia.md`).
2. Abra a IA que você usa (ChatGPT, Claude, Gemini, Copilot ou outra) e anexe
   este arquivo junto com os seus dados — planilha, PDFs, imagens, texto.
3. Peça: **"Leia o modelo e monte o arquivo de importação do Lastro com os meus
   dados."** A seção *Instruções para a IA*, abaixo, já diz a ela o que fazer.
   Se ela perguntar algo (quem são as pessoas da casa, de quem é cada cartão),
   responda.
4. Salve a resposta como um arquivo `.json` — por exemplo
   `lastro-importacao.json` — e mande para o celular (e-mail para você mesmo,
   nuvem, cabo).
5. No Lastro: **Ajustes › Seus dados › Importar › Escolher um arquivo.** O app
   mostra o que o arquivo tem antes de gravar; se algo estiver errado, ele
   recusa e diz o quê.

Três coisas para saber antes:

- **A importação substitui tudo que está no app.** O Lastro grava uma cópia do
  que havia, mas o gesto é de troca, não de soma. Faça isto **antes** de
  começar a lançar à mão — ou exporte o que já tem e peça à IA para juntar.
- **Você vai entregar seus dados financeiros a um serviço de terceiros.** O
  Lastro não participa disso e nunca vê esses dados; a escolha da IA, e do que
  compartilhar com ela, é sua. Tire o que não precisa — número de cartão, CPF,
  senha — antes de anexar.
- **A IA pode errar.** Confira o resumo que o app mostra antes de confirmar e,
  depois, olhe um ou dois meses contra a fonte. O que sair errado se corrige no
  próprio app.

Quer ver o modelo funcionando antes? O arquivo `lastro-modelo.json`, na mesma
página, é este mesmo exemplo pronto para importar — uma casa fictícia com três
meses.

---

## Instruções para a IA

Você vai receber os dados financeiros de uma pessoa (planilha, extratos,
faturas, capturas de tela, texto) e este documento. **Sua tarefa é produzir um
único arquivo JSON, no formato descrito aqui, que o app Lastro importe sem
recusar e que reproduza o que a pessoa tem — nem mais, nem menos.**

### O que entregar

- **Um único JSON válido**: UTF-8, sem comentários, sem vírgula sobrando, sem
  texto antes ou depois. Se a resposta for em chat, entregue-o num único bloco
  de código. Nome sugerido: `lastro-importacao.json`.
- **Só o que a pessoa tem.** Não invente meses, valores nem lançamentos. Mês
  sem dado não entra. Valor ilegível: pergunte, ou deixe o lançamento como
  previsto sem realizado (veja `actualCents`) e avise.
- **Não calcule totais.** Os campos de total de cada mês (`incomePlanned`,
  `expenseActual`, `actualByAccountId` e afins) são recalculados pelo app na
  importação — não os escreva. Você escreve os lançamentos; a soma é do app.
- **Antes do JSON**, se faltar algo que muda o resultado — quem são as pessoas
  da casa, de quem é cada cartão, qual é o mês atual, em que mês o histórico
  termina —, pergunte. Se não for possível perguntar, assuma o mais simples e
  liste as suposições **depois** do JSON, fora dele.
- **Depois do JSON**, em uma linha por item: o que ficou de fora, o que foi
  assumido e o que a pessoa deve conferir no app.
- Histórico longo: monte por blocos de meses se precisar, mas **entregue um
  arquivo final único** — a importação é tudo-ou-nada e substitui o que há.

### O modelo em uma página

- **A casa** (`household`): as pessoas, os meios de pagamento (cartões, conta,
  Pix, dinheiro, vale), as categorias de despesa que a pessoa usa e as
  divisões do patrimônio (`wealthCategories`: Investimentos, Bens, e o que
  ela criar — Cripto, Previdência…).
- **O catálogo** (`catalog`): as regras que se repetem — de onde entra
  dinheiro (`income_sources`), o que é retido antes de entrar
  (`withholding_rules`), despesas que voltam todo mês (`recurrences`), compras
  parceladas (`installment_plans`) e os investimentos e bens (`wealth_items`).
  **Catálogo é regra; mês é fato.** O app usa o catálogo para montar os meses
  futuros sozinho.
- **Os meses** (`months`): um por mês do histórico, cada um com os seus
  lançamentos (`entries`) e as fotos de saldo dos investimentos (`balances`).
- Todo lançamento tem um de **quatro tipos**: `receita` (o que entra),
  `retencao` (o que é retido antes de chegar à mão: INSS, IRRF, plano de saúde
  em folha, DAS), `patrimonio` (dinheiro que sai do mês e vira investimento ou
  bem) e `despesa` (tudo que sai). A **receita líquida** é receita menos
  retenção; o **saldo** é o que sobra depois de tudo. O app calcula os dois.
- **Dinheiro é inteiro em centavos**: `R$ 1.234,56` → `123456`. **Percentual é
  inteiro em basis points**: `6%` → `600`, `10,5%` → `1050`, `100%` → `10000`.
  Mês é `"AAAA-MM"`. Data é ISO 8601 (`"2026-07-14T00:00:00.000Z"`).
- **Ids** são texto curto, minúsculo, sem acento nem espaço: `nubank-ana`,
  `salario-ana`, `2026-07-mercado`. Um id, uma coisa; o mesmo id em todo lugar
  que a cita. Id de mês é o próprio `"AAAA-MM"`.
- **Campo ausente é ausência.** Não escreva `null`, listas vazias nem
  `false` quando o padrão já é esse — omita. O exemplo no fim segue essa regra.

### Como mapear o que aparece na fonte

| O que aparece | Vira |
|---|---|
| Salário, pró-labore, nota fiscal recebida, aluguel recebido, rendimento sacado, benefício (vale) | lançamento `receita` na categoria `receitas`; se se repete, também uma `income_sources` |
| INSS, IRRF, plano de saúde/odonto descontado em folha, contribuição sindical, pensão em folha, DAS, ISS retido | lançamento `retencao` na categoria `retencoes`; se se repete, uma `withholding_rules`. **O líquido do holerite não é lançado** — o app o deriva do bruto menos as retenções |
| FGTS | **não entra**: é depósito da empresa, não sai da receita |
| Compra, boleto, débito, Pix enviado, assinatura, mensalidade, taxa | lançamento `despesa` numa categoria de despesa |
| Aporte em CDB, Tesouro, previdência, compra de um bem | lançamento `patrimonio` na categoria `patrimonio`, com `wealthItemId` apontando para o item em `wealth_items` |
| Pagamento da fatura do cartão | **não vira lançamento** — as compras do cartão já são os lançamentos; a fatura é derivada delas pelo `accountId` |
| Transferência entre contas da própria pessoa | **não vira lançamento** |
| Estorno ou reembolso de uma compra | parte negativa (`isRefund: true`) dentro do lançamento da compra; se veio de terceiro e não abate uma compra, `receita` com `counterpartyName` |
| "3/12", "parc. 3 de 12", "3ª de 12" numa fatura | um `installment_plans` com o cronograma **e** um lançamento `despesa` por mês, com `installment` e `installmentPlanId` |
| Saldo de investimento, previdência, cripto ou o valor de um bem | `wealth_items` (o cadastro, uma vez, com o `categoryId` da divisão) + uma `balances` no mês do extrato (a foto) |
| Aluguel, energia, internet, escola, academia que voltam todo mês | os lançamentos de cada mês **e**, só se ainda estiver valendo hoje, uma `recurrences` |
| Uma compra com várias linhas no mesmo lugar (mercado três vezes no mês) | um lançamento com `lines` — uma parte por compra —, e o valor é a soma |

O que se repete gera duas coisas: **a regra no catálogo** (para o app continuar
gerando nos meses seguintes) e **o lançamento em cada mês do histórico** (o
fato). Ligue os dois pelo id, e use o id que o app geraria:

| Nasce de | No lançamento | Id do lançamento |
|---|---|---|
| `income_sources` | `origin: "fonteReceita"`, `incomeSourceId` | `inc_<id da fonte>` |
| `withholding_rules` | `origin: "regraImposto"`, `withholdingRuleId` | `ret_<id da regra>` |
| `recurrences` | `origin: "recorrencia"`, `recurrenceId` | `rec_<id da recorrência>` |
| `installment_plans` | `origin: "parcela"`, `installmentPlanId`, `installment` | `inst_<id do plano>_<número da parcela>` |
| nada (digitado) | `origin: "manual"` | qualquer texto único no mês, por exemplo `<mês>-<slug>` |

### O que o importador recusa

O arquivo **inteiro** é rejeitado se qualquer um destes falhar, e o app diz
qual foi:

1. `schemaVersion` maior que 1.
2. `household.id` vazio.
3. Dois meses com o mesmo `id`; ou, dentro de um mês, dois lançamentos com o
   mesmo `id`.
4. Lançamento cujo `monthId` não é o `id` do mês em que está guardado.
5. `status: "realizado"` sem `actualCents`; ou `actualCents` presente com
   status diferente de `realizado`. (`actualCents: 0` é "aconteceu e custou
   zero"; **ausente** é "ainda não aconteceu" — são coisas diferentes.)
6. `status: "parcial"` sem `paidCents` maior que zero, ou com `actualCents`
   presente.
7. Lançamento com `lines` cuja soma dos `amountCents` (com sinal) é diferente
   do valor do lançamento — `actualCents` se houver, senão `plannedCents`.
8. O mesmo `labelSlug` aparecendo como `retencao` **e** como `despesa` no mesmo
   mês (é imposto contado duas vezes).
9. `type` que não bate com a categoria: `receitas` → `receita`; `retencoes` →
   `retencao`; `patrimonio` → `patrimonio`; **qualquer outra categoria** →
   `despesa`.

### Regras que não geram erro, mas geram mês errado

- **Só meses com dado, e nunca um mês futuro.** O app projeta os futuros a
  partir do catálogo. O mês atual pode — e costuma — estar pela metade.
- **`isImported: true` nos meses passados; omitido no mês atual.** O app não
  recalcula por cima de um mês importado, e recalcula o atual conforme a
  receita for caindo.
- **Mês passado, tudo resolvido.** Salário que caiu é `realizado` com
  `actualCents`; conta paga é `realizado`. Não deixe receita de mês passado
  como `previsto` sem motivo: enquanto qualquer receita ou retenção do mês
  estiver em aberto, o app mostra a receita líquida como *prevista*.
- **Toda linha tem um meio de pagamento** (`accountId`). Compra no cartão → o
  id do cartão; débito, boleto ou Pix da conta → o id da conta (ou `"pix"`);
  espécie → `"dinheiro"`; retenção em folha → `"nenhuma"`; não dá para saber →
  `"nenhuma"`.
- **`accounts` sempre tem `nenhuma` e `dinheiro`** — copie as duas do exemplo.
  Cartão de crédito tem `kind: "cartaoCredito"` e `producesBill: true`. Cartão
  cancelado fica com `active: false` e `closedOnMonth`; **nunca apague um meio
  de pagamento**, o histórico aponta para ele.
- **Categorias:** as quatro do app (`receitas`, `retencoes`, `patrimonio`,
  `despesas`) existem sempre e **não se escrevem** em `household.categories`.
  Ali vão só as categorias de despesa da pessoa, todas com `role: "despesa"`.
  Prefira poucas (cinco a oito) e os nomes que ela usa. Lançamento sem
  categoria clara → `"despesas"`.
- **Rateio** (`split`): ausente = da casa, ninguém é debitado. `individual`
  quando o gasto é de uma pessoa; `compartilhado` para dividir igual entre as
  citadas; `personalizado` com frações em basis points somando `10000`. Só faz
  sentido em `despesa` — receita, retenção e patrimônio não têm dono.
- **Parcelamento:** `schedule` lista **só as parcelas dentro do histórico e as
  futuras**, cada uma com o seu número real. Compra em 10 vezes que começou
  antes do histórico e está na 6ª no primeiro mês → o `schedule` começa em
  `number: 6`, `installmentCount` é `10`, e `firstMonth` é o mês dessa 6ª.
  Parcela de mês passado: `status: "paga"`; do mês atual: `"lancada"`; futura:
  `"agendada"`. Cada parcela paga ou lançada aponta `entryId` para o lançamento
  dela. **O título não leva o contador** (`"Geladeira"`, nunca
  `"Geladeira 6/10"`): o app escreve o `6/10` a partir de `installment`.
- **Recorrência não tem fim.** Só entram em `recurrences` as que ainda valem
  hoje; as que acabaram ficam só como lançamentos nos meses em que existiram.
  Fonte de renda e retenção, ao contrário, **têm vigência**: uma que acabou
  fica com `endMonth` e `active: false`, porque as receitas antigas continuam
  apontando para ela.
- **Patrimônio é uma série de fotos, dividido em categorias.** Todo
  `wealth_items` aponta para uma `wealthCategories` da casa (`categoryId`);
  cada categoria é uma seção da lista e uma linha do gráfico, na cor dela.
  Copie as duas do exemplo (`investimentos`, `bens`) e crie outras só quando
  a pessoa separa assim (cripto, previdência, imóveis). O saldo é sempre uma
  `balances` num mês. Sem foto num mês, vale a anterior. Uma foto
  **zero** no mês em que a posição acabou é o que a tira da curva dali em
  diante. `lastKnownBalance` no cadastro é a foto mais recente, repetida.
- **Percentual da receita** (`incomePercent`): use quando o valor da linha *é*
  uma alíquota sobre a receita do mês (dízimo, reserva de 10%). O
  `plannedCents` é o que a alíquota deu **naquele** mês.
- **`labelSlug` é opcional** — o app deriva do título (minúsculo, sem acento,
  hífens). Preencha só para juntar grafias diferentes do mesmo gasto
  (`"Super Bom"` e `"Supermercado Bom"` → `"supermercado-bom"`), para a busca
  "quanto gastei com isto" achar tudo junto.
- **Rótulo não carrega número derivado.** Nem contador de parcela, nem
  alíquota (`"DAS 8%"`): o app escreve os dois a partir dos campos. A exceção é
  quando a fonte só tem o texto e não há regra — aí o título é o texto mesmo.

---

## Referência do formato

Tipos: `int` é inteiro JSON; `cents` é `int` em centavos; `bps` é `int` em
basis points; `mês` é `"AAAA-MM"`; `data` é texto ISO 8601; `bool` é
`true`/`false`. "Padrão" é o que vale quando o campo é omitido.

### Raiz

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `schemaVersion` | int | sim | sempre `1` |
| `exportedAt` | data | não | quando o arquivo foi montado |
| `appVersion` | texto | não | livre; escreva `"ia"` |
| `household` | objeto | sim | a casa |
| `catalog` | objeto | sim | as cinco listas abaixo; cada uma pode ser `[]` |
| `months` | lista | sim | os meses, em qualquer ordem |
| `years` | lista | não | **omita** — o app recalcula |

### `household` — a casa

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | id da casa (`"casa-silva"`); vai em `householdId` de todo mês, lançamento e foto |
| `displayName` | texto | sim | como a casa se chama (`"Casa Silva"`, `"Nossa casa"`) |
| `people` | lista | sim | quem pode ser dono de um gasto |
| `accounts` | lista | sim | os meios de pagamento — **inclui sempre `nenhuma` e `dinheiro`** |
| `categories` | lista | sim | só as categorias de despesa da pessoa |
| `wealthCategories` | lista | sim | as divisões do patrimônio; comece pelas duas do exemplo |
| `firstMonth` | mês | sim | o primeiro mês do histórico |
| `lastOpenedMonthId` | mês | sim | o mês atual |
| `currencyCode` | texto | não | `"BRL"` (padrão) |

#### `people[]` — a pessoa

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"ana"` |
| `name` | texto | sim | `"Ana"` |
| `shortCode` | texto | não | uma ou duas letras, para rótulos curtos |
| `colorValue` | int ARGB | não | cor da pessoa (ver *Cores*); padrão cinza |
| `isOwner` | bool | não | `true` em uma pessoa; padrão `false` |
| `active` | bool | não | `false` para quem saiu da casa; padrão `true` |
| `sortHint` | int | não | a ordem em que aparece — em Ajustes, no seletor de rateio e em "quem gastou". Passos de 100, como no resto |

#### `accounts[]` — o meio de pagamento

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"nubank-ana"`. Os dois fixos: `"nenhuma"` e `"dinheiro"` |
| `name` | texto | sim | `"Nubank"` |
| `kind` | texto | sim | `cartaoCredito` · `debito` (conta bancária) · `pix` (transferência) · `dinheiro` · `beneficio` (vale) · `nenhuma` |
| `colorValue` | int ARGB | não | a cor do cartão (ver *Cores*) |
| `ownerPersonId` | texto | não | de quem é o cartão; ausente = da casa |
| `statementClosingDay` | int 1–31 | não | dia de fechamento da fatura |
| `dueDay` | int 1–31 | não | dia de vencimento |
| `producesBill` | bool | não | `true` em cartão de crédito |
| `active` | bool | não | `false` em cartão cancelado; padrão `true` |
| `closedOnMonth` | mês | não | quando foi cancelado |
| `sortHint` | int | não | ordem |

#### `categories[]` — a categoria de despesa da pessoa

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"moradia"` — nunca `receitas`, `retencoes`, `patrimonio` ou `despesas`, que são do app |
| `name` | texto | sim | `"Moradia"` |
| `role` | texto | sim | sempre `"despesa"` |
| `colorValue` | int ARGB | não | cor da seção |
| `sortHint` | int | não | ordem entre as seções de despesa; a `Despesas` do app é `300` |

#### `wealthCategories[]` — a divisão do patrimônio

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"investimentos"`, `"bens"`, `"cripto"` |
| `name` | texto | sim | `"Investimentos"` |
| `colorValue` | int ARGB | sim | a cor da seção e da linha do gráfico (ver *Cores*) |
| `sortHint` | int | não | a ordem das seções e das linhas |

O app nasce com `investimentos` e `bens`, e a pessoa pode renomear, recolorir,
reordenar e apagar as duas. Mantenha-as no arquivo com esses ids, e acrescente
outras só para o que a pessoa separa de fato.

### `catalog.income_sources[]` — de onde entra dinheiro

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"salario-ana"` |
| `name` | texto | sim | `"Salário"` |
| `kind` | texto | sim | `salario` · `pj` · `beneficio` · `rendimento` · `transferencia` · `eventual` |
| `personId` | texto | não | de quem é a renda |
| `defaultPlannedCents` | cents | sim | o valor previsto que nasce todo mês |
| `payDay` | int 1–31 | não | dia em que costuma cair |
| `destinationAccountId` | texto | não | em que meio de pagamento cai (`"bb-conta"`, `"pix"`) |
| `startMonth` | mês | sim | primeiro mês em que vale |
| `endMonth` | mês | não | último mês; ausente = sem prazo |
| `active` | bool | não | `false` quando encerrada; padrão `true` |
| `frequency` | texto | não | `mensal` (padrão) · `bimestral` · `trimestral` · `semestral` · `anual` — contando de `startMonth` |
| `lineTemplate` | lista | não | partes que a receita nasce carregando: `{label, amountCents, sortHint}` |
| `sortHint` | int | não | ordem |

### `catalog.withholding_rules[]` — o que é retido antes de entrar

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"inss-ana"` |
| `name` | texto | sim | `"INSS"` — **sem** a alíquota no nome |
| `kind` | texto | sim | `fixo` (valor transcrito do holerite) · `calculado` (alíquota sobre a base) |
| `fixedAmountCents` | cents | se `fixo` | o valor retido |
| `rateHistory` | lista | se `calculado` | alíquotas por período: `{rateBasisPoints, startMonth, endMonth}`; a última sem `endMonth` |
| `baseIncomeSourceIds` | lista | não | ids das fontes sobre as quais incide; vazio = todas |
| `accountId` | texto | sim | quase sempre `"nenhuma"` — retenção não sai de um meio de pagamento |
| `personId` | texto | não | de quem é |
| `startMonth` / `endMonth` / `active` / `frequency` | | | como em `income_sources` |
| `lineTemplate` | lista | não | partes (`{label, amountCents, sortHint}`) |
| `sortHint` | int | não | ordem |

### `catalog.recurrences[]` — despesa que se repete

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"aluguel"` |
| `title` | texto | sim | `"Aluguel"` |
| `labelSlug` | texto | não | ver regra do slug |
| `categoryId` | texto | não | categoria de despesa da pessoa, `"despesas"` (padrão) ou `"patrimonio"` (aporte que se repete) |
| `split` | objeto | não | rateio (ver *split*); ausente = da casa |
| `accountId` | texto | sim | de onde sai |
| `expectedAmountCents` | cents | não | o previsto de cada mês |
| `expectedStrategy` | texto | não | `valorFixo` (padrão) · `ultimoRealizado` · `mediaTresMeses` |
| `incomePercent` | objeto | não | `{rateBasisPoints, base}` com `base` = `liquida` ou `bruta`; quando presente, manda sobre `expectedAmountCents` |
| `lineTemplate` | lista | não | partes (`{label, amountCents, sortHint}`) |
| `deviationAlertBasisPoints` | bps | não | a partir de que desvio avisar; padrão `2000` (20%) |
| `frequency` | texto | não | `mensal` (padrão) · `bimestral` · `trimestral` · `semestral` · `anual` |
| `anchorMonth` | int 1–12 | não | mês de cobrança quando não é mensal (IPVA em março = `3`) |
| `skipMonths` | lista de int | não | meses do ano em que não cobra (`[1]` = pula janeiro) |
| `dueDay` | int 1–31 | não | dia de vencimento |
| `startMonth` | mês | sim | desde quando vale |
| `sortHint` | int | não | ordem |

Não existe `endMonth` nem `active` aqui: recorrência que acabou **não entra**.

### `catalog.installment_plans[]` — compra parcelada

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"geladeira"` |
| `title` | texto | sim | `"Geladeira"` — sem contador |
| `labelSlug` | texto | não | |
| `installmentAmountCents` | cents | sim | o valor de cada parcela |
| `installmentCount` | int | não | total de parcelas; **omita** se desconhecido |
| `totalAmountCents` | cents | não | o total combinado, se a soma das parcelas não fecha nele |
| `firstMonth` | mês | sim | o mês da **primeira parcela que está no `schedule`** |
| `accountId` | texto | sim | o cartão ou conta |
| `categoryId` | texto | não | uma categoria de **despesa**; padrão `"despesas"` |
| `split` | objeto | sim | rateio; `{"mode": "casa"}` para da casa |
| `schedule` | lista | sim | uma entrada por parcela, ver abaixo |
| `status` | texto | não | `ativo` (padrão) · `quitado` · `concluido` · `cancelado` |
| `finalResidualCents` | cents | não | o centavo de sobra jogado na última parcela |
| `note` | texto | não | observação |

`schedule[]`: `{number, monthRef, amountCents, status, entryId, throughNumber}`
— `number` é o número real da parcela (`6`, e não `1`, se o histórico começa
na 6ª); `monthRef` é o mês; `status` é `agendada` · `lancada` · `paga` ·
`pulada` · `quitada`; `entryId` é o id do lançamento daquela parcela quando ele
existe; `throughNumber` só numa quitação em bloco (`6-12`).

### `catalog.wealth_items[]` — investimento ou bem

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | `"cdb-nubank"` |
| `institution` | texto | sim | `"Nubank"`, `"Tesouro Direto"`, `"Carro"` |
| `categoryId` | texto | sim | o `id` de uma `wealthCategories` da casa: `"investimentos"` (rende e se saca), `"bens"` (vale, mas tem de vender), ou uma criada |
| `description` | texto | não | o que distingue: `"CDB 100% do CDI"` |
| `active` | bool | não | `false` quando liquidado; padrão `true` |
| `closedOnMonth` | mês | não | mês em que acabou — e ponha uma foto **zero** nesse mês |
| `lastKnownBalance` | cents | não | a foto mais recente, repetida aqui |
| `lastKnownBalanceMonthId` | mês | não | de que mês é essa foto |
| `sortHint` | int | não | ordem |

### `months[]` — o mês

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | mês | sim | `"2026-07"` |
| `ref` | mês | sim | igual a `id` |
| `householdId` | texto | sim | o id da casa |
| `isImported` | bool | não | `true` nos meses passados; omita no atual |
| `openedAt` | data | não | o primeiro dia do mês, em ISO |
| `entries` | lista | sim | os lançamentos |
| `balances` | lista | não | as fotos de patrimônio do mês |

**Não escreva** `incomePlanned`, `incomeActual`, `withholdingPlanned`,
`expenseActual`, `wealthActual`, `actualByAccountId`, `plannedByPersonId`,
`actualByCategoryId`, `actualByLabelSlug`, `entryCount`, `lineCount`,
`pendingIncomeCount` nem `aggregateRevision`: o app os recalcula a partir dos
lançamentos.

#### `entries[]` — o lançamento

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `id` | texto | sim | único dentro do mês (ver a tabela de ids) |
| `householdId` | texto | sim | o id da casa |
| `monthId` | mês | sim | o `id` do mês em que está |
| `type` | texto | sim | `receita` · `retencao` · `patrimonio` · `despesa` — **segue a categoria** |
| `categoryId` | texto | sim | `receitas` · `retencoes` · `patrimonio` · `despesas` · ou uma categoria da pessoa |
| `title` | texto | sim | o que aparece na lista: `"Mercado"` |
| `labelSlug` | texto | não | ver regra do slug |
| `amount` | objeto | sim | `{plannedCents, actualCents, paidCents}` — ver abaixo |
| `status` | texto | sim | `previsto` · `realizado` · `parcial` · `naoEntrou` · `cancelado` |
| `occurredOn` | data | não | o dia, quando a fonte tem |
| `accountId` | texto | sim | o meio de pagamento |
| `split` | objeto | não | o rateio; ausente = da casa |
| `lines` | lista | não | as partes; a soma tem de ser o valor |
| `note` | texto | não | observação livre |
| `origin` | texto | não | `manual` (padrão) · `recorrencia` · `parcela` · `regraImposto` · `fonteReceita` |
| `recurrenceId` / `installmentPlanId` / `withholdingRuleId` / `incomeSourceId` | texto | não | o vínculo com a regra do catálogo, conforme a origem |
| `installment` | objeto | não | `{number, total}` — o contador `6/10`; `total` ausente = `N` (desconhecido) |
| `wealthItemId` | texto | não | para onde foi, quando `type` é `patrimonio` |
| `counterpartyName` | texto | não | de quem ou para quem, quando é dinheiro de terceiro |
| `incomePercent` | objeto | não | `{rateBasisPoints, base}` — o valor é este percentual da receita do mês |
| `amountExpression` | texto | não | a conta escrita no campo (`"=150+100"`), só sem `lines` e sem `incomePercent` |
| `isLocked` | bool | não | `true` quando a pessoa digitou por cima de um valor gerado; padrão `false` |
| `isPinned` | bool | não | `true` fixa no topo da seção; padrão `false` |
| `sortHint` | int | não | ordem dentro da seção |

**`amount`** — o par previsto × realizado:

| Situação | `plannedCents` | `actualCents` | `paidCents` | `status` |
|---|---|---|---|---|
| ainda não aconteceu | o esperado | ausente | ausente | `previsto` |
| aconteceu | o esperado (ou igual ao realizado, se não havia previsão) | o que de fato entrou/saiu | ausente | `realizado` |
| aconteceu e custou zero | o esperado | `0` | ausente | `realizado` |
| saiu uma parte, falta o resto | o compromisso inteiro | ausente | o que já saiu | `parcial` |
| a cobrança/receita não veio | o esperado | ausente | ausente | `naoEntrou` |
| cancelado, não conta em nada | o esperado | ausente | ausente | `cancelado` |

**`split`** — de quem é o gasto:

| `mode` | Outros campos | Significa |
|---|---|---|
| `casa` (ou `split` ausente) | — | da casa; ninguém é debitado |
| `individual` | `personId`, e `sharesByPersonId: {"<id>": 10000}` | de uma pessoa |
| `compartilhado` | `sharesByPersonId` com frações iguais somando `10000` (`5000`/`5000`; `3334`/`3333`/`3333`) | dividido igual |
| `personalizado` | `sharesByPersonId` com frações livres somando `10000` | divisão livre |

##### `lines[]` — a parte

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `label` | texto | não | `"Supermercado"` |
| `amountCents` | cents | sim | **pode ser negativo** (estorno, abatimento) |
| `labelSlug` | texto | não | |
| `occurredOn` | data | não | |
| `isRefund` | bool | não | `true` marca a parte negativa como estorno |
| `isSettled` | bool | não | `true` quando esta parte já saiu; marcar parte a parte deixa o pai `parcial` com `paidCents` = soma das marcadas; todas marcadas = pai `realizado` |
| `note` | texto | não | |
| `sortHint` | int | não | ordem dentro do lançamento |

#### `balances[]` — a foto do patrimônio no mês

| Campo | Tipo | Obrigatório | Significado |
|---|---|---|---|
| `wealthItemId` | texto | sim | o item em `wealth_items` |
| `householdId` | texto | sim | o id da casa |
| `monthId` | mês | sim | o mês da foto |
| `balance` | cents | sim | o saldo naquele mês; `0` no mês em que acabou |
| `source` | texto | não | `manual` (padrão: informado) · `repetido` · `projetado` |

### Cores de referência

`colorValue` é a cor ARGB como inteiro: `#RRGGBB` vira `0xFFRRGGBB` em
decimal. As cores abaixo são as de marca dos meios de pagamento mais comuns;
para pessoa e categoria, qualquer cor serve — prefira tons médios, legíveis
nos temas claro e escuro.

| Banco / meio | Cor (hex) | `colorValue` (ARGB inteiro) | Observação |
|---|---|---|---|
| Nubank | `#820AD1` | `4286712529` |  |
| Itaú | `#EC7000` | `4293685248` |  |
| Bradesco | `#CC092F` | `4291561775` |  |
| Santander | `#E30613` | `4293068307` |  |
| Banco do Brasil | `#FAE128` | `4294631720` |  |
| Caixa | `#005CA9` | `4278213801` |  |
| Inter | `#FF7A00` | `4294932992` |  |
| C6 Bank | `#242424` | `4280558628` | escuro: quase some no tema escuro do app |
| BTG Pactual | `#001E62` | `4278197858` |  |
| XP | `#000000` | `4278190080` | preto: some no tema escuro do app; considere outra |
| Mercado Pago | `#009EE3` | `4278230755` |  |
| PicPay | `#21C25E` | `4280402526` |  |
| Sicredi | `#3FA110` | `4282360080` |  |
| Sicoob | `#00AE9D` | `4278234781` |  |
| Alelo (vale) | `#00A64F` | `4278232655` |  |
| Pix (transferência) | `#32BCAD` | `4281515181` |  |
| Dinheiro (espécie) | `#335D00` | `4281556224` | a cor com que o app cria "Dinheiro" |

---

## Exemplo completo

A **Casa Aurora**: Ana (dona da conta) e Bruno. Três meses — julho e agosto de
2026 fechados, setembro em andamento. Tudo fictício. O que procurar, e onde:

- **duas fontes de renda mensais, uma anual e uma encerrada**
  (`income_sources`); o salário da Ana com três retenções fixas (uma com
  partes) e o DAS do Bruno calculado com **duas alíquotas no histórico**
  (`withholding_rules`);
- **recorrências** com valor fixo, com *último realizado* (energia), com partes
  e rateio meio a meio (streaming), individual (academia, natação), pulando
  janeiro (natação), **percentual da líquida** na categoria patrimônio
  (reserva) e **anual ancorada em março** (IPVA);
- **um parcelamento no meio da série** (geladeira: 6ª de 10 em julho) e outro
  com **total combinado e centavo de sobra** (celular);
- **cinco peças de patrimônio em três categorias**: dois investimentos, um bem
  com uma foto só, um bitcoin na categoria **Cripto** que a casa criou (a
  terceira linha do gráfico) e uma poupança **encerrada com a foto zero** em
  julho;
- em **julho**: uma receita eventual, a **conta escrita no campo**
  (`amountExpression`), uma compra no **cartão encerrado**;
- em **agosto**: um reembolso que **não entrou**, um conserto **pago em
  parte**, um mercado com **parte negativa** (estorno), passagens com **divisão
  personalizada**, um gasto de terceiros (`counterpartyName`) e a reserva
  **travada** à mão;
- em **setembro**, o mês atual: a receita PJ **paga pela metade** (o que deixa
  a líquida prevista), o mercado com **duas de três partes pagas**, contas
  ainda por pagar e um show **cancelado**.

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-09-23T12:00:00.000Z",
  "appVersion": "modelo",
  "household": {
    "id": "casa-aurora",
    "displayName": "Casa Aurora",
    "people": [
      {
        "id": "ana",
        "name": "Ana",
        "shortCode": "A",
        "colorValue": 4282285211,
        "isOwner": true,
        "active": true,
        "sortHint": 0
      },
      {
        "id": "bruno",
        "name": "Bruno",
        "shortCode": "B",
        "colorValue": 4288372542,
        "active": true,
        "sortHint": 1
      }
    ],
    "accounts": [
      {
        "id": "nenhuma",
        "name": "Sem meio definido",
        "kind": "nenhuma",
        "colorValue": 4288585374,
        "producesBill": false,
        "active": true,
        "sortHint": -1
      },
      {
        "id": "dinheiro",
        "name": "Dinheiro",
        "kind": "dinheiro",
        "colorValue": 4281556224,
        "producesBill": false,
        "active": true,
        "sortHint": 0
      },
      {
        "id": "pix",
        "name": "Pix",
        "kind": "pix",
        "colorValue": 4281515181,
        "producesBill": false,
        "active": true,
        "sortHint": 10
      },
      {
        "id": "bb-conta",
        "name": "Banco do Brasil",
        "kind": "debito",
        "colorValue": 4294631720,
        "producesBill": false,
        "active": true,
        "sortHint": 20
      },
      {
        "id": "nubank-ana",
        "name": "Nubank",
        "kind": "cartaoCredito",
        "colorValue": 4286712529,
        "ownerPersonId": "ana",
        "statementClosingDay": 3,
        "dueDay": 10,
        "producesBill": true,
        "active": true,
        "sortHint": 30
      },
      {
        "id": "itau-bruno",
        "name": "Itaú",
        "kind": "cartaoCredito",
        "colorValue": 4293685248,
        "ownerPersonId": "bruno",
        "statementClosingDay": 25,
        "dueDay": 5,
        "producesBill": true,
        "active": true,
        "sortHint": 40
      },
      {
        "id": "alelo",
        "name": "Alelo",
        "kind": "beneficio",
        "colorValue": 4278232655,
        "producesBill": false,
        "active": true,
        "sortHint": 50
      },
      {
        "id": "santander-antigo",
        "name": "Santander",
        "kind": "cartaoCredito",
        "colorValue": 4293068307,
        "ownerPersonId": "bruno",
        "producesBill": true,
        "active": false,
        "closedOnMonth": "2026-07",
        "sortHint": 60
      }
    ],
    "categories": [
      {
        "id": "moradia",
        "name": "Moradia",
        "role": "despesa",
        "colorValue": 4285222819,
        "sortHint": 310
      },
      {
        "id": "mercado",
        "name": "Mercado",
        "role": "despesa",
        "colorValue": 4281236827,
        "sortHint": 320
      },
      {
        "id": "transporte",
        "name": "Transporte",
        "role": "despesa",
        "colorValue": 4282150559,
        "sortHint": 330
      },
      {
        "id": "assinaturas",
        "name": "Assinaturas",
        "role": "despesa",
        "colorValue": 4282262854,
        "sortHint": 340
      }
    ],
    "wealthCategories": [
      {
        "id": "investimentos",
        "name": "Investimentos",
        "colorValue": 4288314674,
        "sortHint": 0
      },
      {
        "id": "bens",
        "name": "Bens",
        "colorValue": 4286148967,
        "sortHint": 100
      },
      {
        "id": "cripto",
        "name": "Cripto",
        "colorValue": 4284250797,
        "sortHint": 200
      }
    ],
    "firstMonth": "2026-07",
    "lastOpenedMonthId": "2026-09",
    "currencyCode": "BRL"
  },
  "catalog": {
    "income_sources": [
      {
        "id": "salario-ana",
        "name": "Salário",
        "kind": "salario",
        "personId": "ana",
        "defaultPlannedCents": 650000,
        "payDay": 5,
        "destinationAccountId": "bb-conta",
        "startMonth": "2026-01",
        "sortHint": 0,
        "active": true,
        "frequency": "mensal"
      },
      {
        "id": "pj-bruno",
        "name": "Consultoria PJ",
        "kind": "pj",
        "personId": "bruno",
        "defaultPlannedCents": 420000,
        "payDay": 10,
        "destinationAccountId": "pix",
        "startMonth": "2025-08",
        "sortHint": 10,
        "active": true,
        "frequency": "mensal"
      },
      {
        "id": "vale-ana",
        "name": "Vale-alimentação",
        "kind": "beneficio",
        "personId": "ana",
        "defaultPlannedCents": 80000,
        "payDay": 1,
        "destinationAccountId": "alelo",
        "startMonth": "2026-01",
        "sortHint": 20,
        "active": true,
        "frequency": "mensal"
      },
      {
        "id": "bonus-ana",
        "name": "Bônus anual",
        "kind": "eventual",
        "personId": "ana",
        "defaultPlannedCents": 300000,
        "destinationAccountId": "bb-conta",
        "startMonth": "2025-12",
        "sortHint": 30,
        "active": true,
        "frequency": "anual"
      },
      {
        "id": "freela-bruno",
        "name": "Freelas de design",
        "kind": "eventual",
        "personId": "bruno",
        "defaultPlannedCents": 150000,
        "destinationAccountId": "pix",
        "startMonth": "2025-06",
        "endMonth": "2026-02",
        "sortHint": 40,
        "active": false,
        "frequency": "mensal"
      }
    ],
    "withholding_rules": [
      {
        "id": "inss-ana",
        "name": "INSS",
        "kind": "fixo",
        "baseIncomeSourceIds": [
          "salario-ana"
        ],
        "fixedAmountCents": 71408,
        "accountId": "nenhuma",
        "personId": "ana",
        "startMonth": "2026-01",
        "sortHint": 0,
        "active": true,
        "frequency": "mensal"
      },
      {
        "id": "irrf-ana",
        "name": "IRRF",
        "kind": "fixo",
        "baseIncomeSourceIds": [
          "salario-ana"
        ],
        "fixedAmountCents": 42000,
        "accountId": "nenhuma",
        "personId": "ana",
        "startMonth": "2026-01",
        "sortHint": 10,
        "active": true,
        "frequency": "mensal"
      },
      {
        "id": "saude-ana",
        "name": "Plano de saúde",
        "kind": "fixo",
        "baseIncomeSourceIds": [
          "salario-ana"
        ],
        "fixedAmountCents": 38000,
        "accountId": "nenhuma",
        "personId": "ana",
        "startMonth": "2026-01",
        "lineTemplate": [
          {
            "label": "Titular",
            "amountCents": 25000,
            "sortHint": 0
          },
          {
            "label": "Dependente",
            "amountCents": 13000,
            "sortHint": 100
          }
        ],
        "sortHint": 20,
        "active": true,
        "frequency": "mensal"
      },
      {
        "id": "das-bruno",
        "name": "DAS (Simples Nacional)",
        "kind": "calculado",
        "rateHistory": [
          {
            "rateBasisPoints": 600,
            "startMonth": "2025-08",
            "endMonth": "2025-12"
          },
          {
            "rateBasisPoints": 800,
            "startMonth": "2026-01"
          }
        ],
        "baseIncomeSourceIds": [
          "pj-bruno"
        ],
        "accountId": "nenhuma",
        "personId": "bruno",
        "startMonth": "2025-08",
        "sortHint": 30,
        "active": true,
        "frequency": "mensal"
      }
    ],
    "recurrences": [
      {
        "id": "aluguel",
        "title": "Aluguel",
        "labelSlug": "aluguel",
        "categoryId": "moradia",
        "split": {
          "mode": "casa"
        },
        "accountId": "bb-conta",
        "expectedAmountCents": 210000,
        "expectedStrategy": "valorFixo",
        "deviationAlertBasisPoints": 2000,
        "frequency": "mensal",
        "dueDay": 10,
        "startMonth": "2025-08",
        "sortHint": 100
      },
      {
        "id": "energia",
        "title": "Energia",
        "labelSlug": "energia",
        "categoryId": "moradia",
        "split": {
          "mode": "casa"
        },
        "accountId": "bb-conta",
        "expectedAmountCents": 21000,
        "expectedStrategy": "ultimoRealizado",
        "deviationAlertBasisPoints": 2000,
        "frequency": "mensal",
        "dueDay": 15,
        "startMonth": "2025-08",
        "sortHint": 110
      },
      {
        "id": "internet",
        "title": "Internet",
        "labelSlug": "internet",
        "categoryId": "moradia",
        "split": {
          "mode": "casa"
        },
        "accountId": "nubank-ana",
        "expectedAmountCents": 11990,
        "expectedStrategy": "valorFixo",
        "deviationAlertBasisPoints": 2000,
        "frequency": "mensal",
        "startMonth": "2025-08",
        "sortHint": 120
      },
      {
        "id": "streaming",
        "title": "Streaming",
        "labelSlug": "streaming",
        "categoryId": "assinaturas",
        "split": {
          "mode": "compartilhado",
          "sharesByPersonId": {
            "ana": 5000,
            "bruno": 5000
          }
        },
        "accountId": "nubank-ana",
        "expectedAmountCents": 10270,
        "expectedStrategy": "valorFixo",
        "lineTemplate": [
          {
            "label": "Netflix",
            "amountCents": 5590,
            "sortHint": 0
          },
          {
            "label": "Spotify",
            "amountCents": 2190,
            "sortHint": 100
          },
          {
            "label": "YouTube Premium",
            "amountCents": 2490,
            "sortHint": 200
          }
        ],
        "deviationAlertBasisPoints": 2000,
        "frequency": "mensal",
        "startMonth": "2025-08",
        "sortHint": 200
      },
      {
        "id": "academia-bruno",
        "title": "Academia",
        "labelSlug": "academia",
        "categoryId": "despesas",
        "split": {
          "mode": "individual",
          "personId": "bruno",
          "sharesByPersonId": {
            "bruno": 10000
          }
        },
        "accountId": "itau-bruno",
        "expectedAmountCents": 12990,
        "expectedStrategy": "valorFixo",
        "deviationAlertBasisPoints": 2000,
        "frequency": "mensal",
        "startMonth": "2025-08",
        "sortHint": 210
      },
      {
        "id": "natacao-ana",
        "title": "Natação",
        "labelSlug": "natacao",
        "categoryId": "despesas",
        "split": {
          "mode": "individual",
          "personId": "ana",
          "sharesByPersonId": {
            "ana": 10000
          }
        },
        "accountId": "pix",
        "expectedAmountCents": 18000,
        "expectedStrategy": "valorFixo",
        "deviationAlertBasisPoints": 2000,
        "frequency": "mensal",
        "skipMonths": [
          1
        ],
        "startMonth": "2025-08",
        "sortHint": 220
      },
      {
        "id": "reserva",
        "title": "Reserva de emergência",
        "labelSlug": "reserva-de-emergencia",
        "categoryId": "patrimonio",
        "split": {
          "mode": "casa"
        },
        "accountId": "bb-conta",
        "expectedAmountCents": 0,
        "incomePercent": {
          "rateBasisPoints": 1000,
          "base": "liquida"
        },
        "expectedStrategy": "valorFixo",
        "deviationAlertBasisPoints": 2000,
        "frequency": "mensal",
        "startMonth": "2025-08",
        "sortHint": 300
      },
      {
        "id": "ipva",
        "title": "IPVA",
        "labelSlug": "ipva",
        "categoryId": "transporte",
        "split": {
          "mode": "casa"
        },
        "accountId": "bb-conta",
        "expectedAmountCents": 185000,
        "expectedStrategy": "valorFixo",
        "deviationAlertBasisPoints": 2000,
        "frequency": "anual",
        "anchorMonth": 3,
        "startMonth": "2025-03",
        "sortHint": 400
      }
    ],
    "installment_plans": [
      {
        "id": "geladeira",
        "title": "Geladeira",
        "installmentAmountCents": 31990,
        "installmentCount": 10,
        "firstMonth": "2026-07",
        "accountId": "nubank-ana",
        "categoryId": "despesas",
        "split": {
          "mode": "casa"
        },
        "labelSlug": "geladeira",
        "schedule": [
          {
            "number": 6,
            "monthRef": "2026-07",
            "amountCents": 31990,
            "status": "paga",
            "entryId": "inst_geladeira_6"
          },
          {
            "number": 7,
            "monthRef": "2026-08",
            "amountCents": 31990,
            "status": "paga",
            "entryId": "inst_geladeira_7"
          },
          {
            "number": 8,
            "monthRef": "2026-09",
            "amountCents": 31990,
            "status": "lancada",
            "entryId": "inst_geladeira_8"
          },
          {
            "number": 9,
            "monthRef": "2026-10",
            "amountCents": 31990,
            "status": "agendada"
          },
          {
            "number": 10,
            "monthRef": "2026-11",
            "amountCents": 31990,
            "status": "agendada"
          }
        ],
        "status": "ativo"
      },
      {
        "id": "celular-bruno",
        "title": "Celular",
        "installmentAmountCents": 20825,
        "installmentCount": 12,
        "totalAmountCents": 249990,
        "firstMonth": "2026-08",
        "accountId": "itau-bruno",
        "categoryId": "despesas",
        "split": {
          "mode": "individual",
          "personId": "bruno",
          "sharesByPersonId": {
            "bruno": 10000
          }
        },
        "labelSlug": "celular",
        "schedule": [
          {
            "number": 1,
            "monthRef": "2026-08",
            "amountCents": 20825,
            "status": "paga",
            "entryId": "inst_celular-bruno_1"
          },
          {
            "number": 2,
            "monthRef": "2026-09",
            "amountCents": 20825,
            "status": "lancada",
            "entryId": "inst_celular-bruno_2"
          },
          {
            "number": 3,
            "monthRef": "2026-10",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 4,
            "monthRef": "2026-11",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 5,
            "monthRef": "2026-12",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 6,
            "monthRef": "2027-01",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 7,
            "monthRef": "2027-02",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 8,
            "monthRef": "2027-03",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 9,
            "monthRef": "2027-04",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 10,
            "monthRef": "2027-05",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 11,
            "monthRef": "2027-06",
            "amountCents": 20825,
            "status": "agendada"
          },
          {
            "number": 12,
            "monthRef": "2027-07",
            "amountCents": 20915,
            "status": "agendada"
          }
        ],
        "status": "ativo",
        "finalResidualCents": 90
      }
    ],
    "wealth_items": [
      {
        "id": "cdb-nubank",
        "institution": "Nubank",
        "categoryId": "investimentos",
        "description": "CDB 100% do CDI",
        "active": true,
        "lastKnownBalance": 1235000,
        "lastKnownBalanceMonthId": "2026-09",
        "sortHint": 0
      },
      {
        "id": "tesouro-selic",
        "institution": "Tesouro Direto",
        "categoryId": "investimentos",
        "description": "Tesouro Selic 2029",
        "active": true,
        "lastKnownBalance": 840000,
        "lastKnownBalanceMonthId": "2026-09",
        "sortHint": 10
      },
      {
        "id": "carro",
        "institution": "Carro",
        "categoryId": "bens",
        "description": "Hatch 2021",
        "active": true,
        "lastKnownBalance": 5800000,
        "lastKnownBalanceMonthId": "2026-07",
        "sortHint": 20
      },
      {
        "id": "bitcoin",
        "institution": "Corretora de cripto",
        "categoryId": "cripto",
        "description": "Bitcoin",
        "active": true,
        "lastKnownBalance": 310000,
        "lastKnownBalanceMonthId": "2026-09",
        "sortHint": 25
      },
      {
        "id": "poupanca-caixa",
        "institution": "Caixa",
        "categoryId": "investimentos",
        "description": "Poupança",
        "active": false,
        "closedOnMonth": "2026-07",
        "lastKnownBalance": 0,
        "lastKnownBalanceMonthId": "2026-07",
        "sortHint": 30
      }
    ]
  },
  "months": [
    {
      "id": "2026-07",
      "ref": "2026-07",
      "householdId": "casa-aurora",
      "isImported": true,
      "openedAt": "2026-07-01T00:00:00.000Z",
      "entries": [
        {
          "id": "inc_salario-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Salário",
          "amount": {
            "plannedCents": 650000,
            "actualCents": 650000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "fonteReceita",
          "incomeSourceId": "salario-ana",
          "sortHint": 0
        },
        {
          "id": "inc_pj-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Consultoria PJ",
          "amount": {
            "plannedCents": 420000,
            "actualCents": 420000
          },
          "status": "realizado",
          "accountId": "pix",
          "origin": "fonteReceita",
          "incomeSourceId": "pj-bruno",
          "sortHint": 10
        },
        {
          "id": "inc_vale-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Vale-alimentação",
          "amount": {
            "plannedCents": 80000,
            "actualCents": 80000
          },
          "status": "realizado",
          "accountId": "alelo",
          "origin": "fonteReceita",
          "incomeSourceId": "vale-ana",
          "sortHint": 20
        },
        {
          "id": "2026-07-venda-bicicleta",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Venda da bicicleta",
          "labelSlug": "venda-da-bicicleta",
          "amount": {
            "plannedCents": 45000,
            "actualCents": 45000
          },
          "status": "realizado",
          "occurredOn": "2026-07-12T00:00:00.000Z",
          "accountId": "pix",
          "note": "Anunciada em junho, paga por Pix",
          "origin": "manual",
          "sortHint": 40
        },
        {
          "id": "ret_inss-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "INSS",
          "amount": {
            "plannedCents": 71408,
            "actualCents": 71408
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "inss-ana",
          "sortHint": 100
        },
        {
          "id": "ret_irrf-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "IRRF",
          "amount": {
            "plannedCents": 42000,
            "actualCents": 42000
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "irrf-ana",
          "sortHint": 110
        },
        {
          "id": "ret_saude-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "Plano de saúde",
          "amount": {
            "plannedCents": 38000,
            "actualCents": 38000
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "lines": [
            {
              "label": "Titular",
              "amountCents": 25000,
              "labelSlug": "titular",
              "isSettled": true,
              "sortHint": 0
            },
            {
              "label": "Dependente",
              "amountCents": 13000,
              "labelSlug": "dependente",
              "isSettled": true,
              "sortHint": 100
            }
          ],
          "origin": "regraImposto",
          "withholdingRuleId": "saude-ana",
          "sortHint": 120
        },
        {
          "id": "ret_das-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "DAS (Simples Nacional) (8%)",
          "amount": {
            "plannedCents": 33600,
            "actualCents": 33600
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "das-bruno",
          "sortHint": 130
        },
        {
          "id": "rec_aluguel",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Aluguel",
          "labelSlug": "aluguel",
          "amount": {
            "plannedCents": 210000,
            "actualCents": 210000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "recorrencia",
          "recurrenceId": "aluguel",
          "isPinned": true,
          "sortHint": 100
        },
        {
          "id": "rec_energia",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Energia",
          "labelSlug": "energia",
          "amount": {
            "plannedCents": 21000,
            "actualCents": 23450
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "recorrencia",
          "recurrenceId": "energia",
          "sortHint": 110
        },
        {
          "id": "rec_internet",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Internet",
          "labelSlug": "internet",
          "amount": {
            "plannedCents": 11990,
            "actualCents": 11990
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "origin": "recorrencia",
          "recurrenceId": "internet",
          "sortHint": 120
        },
        {
          "id": "rec_streaming",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "assinaturas",
          "title": "Streaming",
          "labelSlug": "streaming",
          "amount": {
            "plannedCents": 10270,
            "actualCents": 10270
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "split": {
            "mode": "compartilhado",
            "sharesByPersonId": {
              "ana": 5000,
              "bruno": 5000
            }
          },
          "lines": [
            {
              "label": "Netflix",
              "amountCents": 5590,
              "labelSlug": "netflix",
              "isSettled": true,
              "sortHint": 0
            },
            {
              "label": "Spotify",
              "amountCents": 2190,
              "labelSlug": "spotify",
              "isSettled": true,
              "sortHint": 100
            },
            {
              "label": "YouTube Premium",
              "amountCents": 2490,
              "labelSlug": "youtube-premium",
              "isSettled": true,
              "sortHint": 200
            }
          ],
          "origin": "recorrencia",
          "recurrenceId": "streaming",
          "sortHint": 200
        },
        {
          "id": "rec_academia-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Academia",
          "labelSlug": "academia",
          "amount": {
            "plannedCents": 12990,
            "actualCents": 12990
          },
          "status": "realizado",
          "accountId": "itau-bruno",
          "split": {
            "mode": "individual",
            "personId": "bruno",
            "sharesByPersonId": {
              "bruno": 10000
            }
          },
          "origin": "recorrencia",
          "recurrenceId": "academia-bruno",
          "sortHint": 210
        },
        {
          "id": "rec_natacao-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Natação",
          "labelSlug": "natacao",
          "amount": {
            "plannedCents": 18000,
            "actualCents": 18000
          },
          "status": "realizado",
          "accountId": "pix",
          "split": {
            "mode": "individual",
            "personId": "ana",
            "sharesByPersonId": {
              "ana": 10000
            }
          },
          "origin": "recorrencia",
          "recurrenceId": "natacao-ana",
          "sortHint": 220
        },
        {
          "id": "rec_reserva",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "patrimonio",
          "categoryId": "patrimonio",
          "title": "Reserva de emergência",
          "labelSlug": "reserva-de-emergencia",
          "amount": {
            "plannedCents": 100999,
            "actualCents": 100999
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "recorrencia",
          "recurrenceId": "reserva",
          "wealthItemId": "cdb-nubank",
          "incomePercent": {
            "rateBasisPoints": 1000,
            "base": "liquida"
          },
          "sortHint": 300
        },
        {
          "id": "inst_geladeira_6",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Geladeira",
          "labelSlug": "geladeira",
          "amount": {
            "plannedCents": 31990,
            "actualCents": 31990
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "origin": "parcela",
          "installmentPlanId": "geladeira",
          "installment": {
            "number": 6,
            "total": 10
          },
          "sortHint": 906
        },
        {
          "id": "2026-07-mercado",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "mercado",
          "title": "Mercado",
          "labelSlug": "mercado",
          "amount": {
            "plannedCents": 64000,
            "actualCents": 64000
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "lines": [
            {
              "label": "Supermercado",
              "amountCents": 43210,
              "labelSlug": "supermercado",
              "sortHint": 0
            },
            {
              "label": "Feira",
              "amountCents": 8750,
              "labelSlug": "feira",
              "sortHint": 100
            },
            {
              "label": "Padaria",
              "amountCents": 12040,
              "labelSlug": "padaria",
              "sortHint": 200
            }
          ],
          "origin": "manual",
          "sortHint": 500
        },
        {
          "id": "2026-07-farmacia",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Farmácia",
          "labelSlug": "farmacia",
          "amount": {
            "plannedCents": 8650,
            "actualCents": 8650
          },
          "status": "realizado",
          "occurredOn": "2026-07-14T00:00:00.000Z",
          "accountId": "nubank-ana",
          "split": {
            "mode": "individual",
            "personId": "ana",
            "sharesByPersonId": {
              "ana": 10000
            }
          },
          "origin": "manual",
          "sortHint": 510
        },
        {
          "id": "2026-07-combustivel",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "transporte",
          "title": "Combustível",
          "labelSlug": "combustivel",
          "amount": {
            "plannedCents": 32000,
            "actualCents": 31540
          },
          "status": "realizado",
          "accountId": "itau-bruno",
          "split": {
            "mode": "individual",
            "personId": "bruno",
            "sharesByPersonId": {
              "bruno": 10000
            }
          },
          "origin": "manual",
          "sortHint": 520
        },
        {
          "id": "2026-07-presentes",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Presentes",
          "labelSlug": "presentes",
          "amount": {
            "plannedCents": 25000,
            "actualCents": 25000
          },
          "status": "realizado",
          "accountId": "pix",
          "note": "Aniversário da mãe e amigo secreto",
          "origin": "manual",
          "amountExpression": "=150+100",
          "sortHint": 530
        },
        {
          "id": "2026-07-seguro-carro",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "despesa",
          "categoryId": "transporte",
          "title": "Seguro do carro",
          "labelSlug": "seguro-do-carro",
          "amount": {
            "plannedCents": 8900,
            "actualCents": 8900
          },
          "status": "realizado",
          "accountId": "santander-antigo",
          "note": "Última compra antes do cancelamento do cartão",
          "origin": "manual",
          "sortHint": 540
        },
        {
          "id": "2026-07-tesouro",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "type": "patrimonio",
          "categoryId": "patrimonio",
          "title": "Tesouro Selic",
          "labelSlug": "tesouro-selic",
          "amount": {
            "plannedCents": 50000,
            "actualCents": 50000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "manual",
          "wealthItemId": "tesouro-selic",
          "sortHint": 600
        }
      ],
      "balances": [
        {
          "wealthItemId": "cdb-nubank",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "balance": 1100000,
          "source": "manual"
        },
        {
          "wealthItemId": "tesouro-selic",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "balance": 730000,
          "source": "manual"
        },
        {
          "wealthItemId": "carro",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "balance": 5800000,
          "source": "manual"
        },
        {
          "wealthItemId": "bitcoin",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "balance": 250000,
          "source": "manual"
        },
        {
          "wealthItemId": "poupanca-caixa",
          "householdId": "casa-aurora",
          "monthId": "2026-07",
          "balance": 0,
          "source": "manual"
        }
      ]
    },
    {
      "id": "2026-08",
      "ref": "2026-08",
      "householdId": "casa-aurora",
      "isImported": true,
      "openedAt": "2026-08-01T00:00:00.000Z",
      "entries": [
        {
          "id": "inc_salario-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Salário",
          "amount": {
            "plannedCents": 650000,
            "actualCents": 650000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "fonteReceita",
          "incomeSourceId": "salario-ana",
          "sortHint": 0
        },
        {
          "id": "inc_pj-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Consultoria PJ",
          "amount": {
            "plannedCents": 420000,
            "actualCents": 420000
          },
          "status": "realizado",
          "accountId": "pix",
          "origin": "fonteReceita",
          "incomeSourceId": "pj-bruno",
          "sortHint": 10
        },
        {
          "id": "inc_vale-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Vale-alimentação",
          "amount": {
            "plannedCents": 80000,
            "actualCents": 80000
          },
          "status": "realizado",
          "accountId": "alelo",
          "origin": "fonteReceita",
          "incomeSourceId": "vale-ana",
          "sortHint": 20
        },
        {
          "id": "2026-08-reembolso-empresa",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Reembolso da empresa",
          "labelSlug": "reembolso-da-empresa",
          "amount": {
            "plannedCents": 32000
          },
          "status": "naoEntrou",
          "accountId": "bb-conta",
          "note": "A empresa não aprovou o relatório de despesas",
          "origin": "manual",
          "sortHint": 40
        },
        {
          "id": "ret_inss-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "INSS",
          "amount": {
            "plannedCents": 71408,
            "actualCents": 71408
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "inss-ana",
          "sortHint": 100
        },
        {
          "id": "ret_irrf-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "IRRF",
          "amount": {
            "plannedCents": 42000,
            "actualCents": 42000
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "irrf-ana",
          "sortHint": 110
        },
        {
          "id": "ret_saude-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "Plano de saúde",
          "amount": {
            "plannedCents": 38000,
            "actualCents": 38000
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "lines": [
            {
              "label": "Titular",
              "amountCents": 25000,
              "labelSlug": "titular",
              "isSettled": true,
              "sortHint": 0
            },
            {
              "label": "Dependente",
              "amountCents": 13000,
              "labelSlug": "dependente",
              "isSettled": true,
              "sortHint": 100
            }
          ],
          "origin": "regraImposto",
          "withholdingRuleId": "saude-ana",
          "sortHint": 120
        },
        {
          "id": "ret_das-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "DAS (Simples Nacional) (8%)",
          "amount": {
            "plannedCents": 33600,
            "actualCents": 33600
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "das-bruno",
          "sortHint": 130
        },
        {
          "id": "rec_aluguel",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Aluguel",
          "labelSlug": "aluguel",
          "amount": {
            "plannedCents": 210000,
            "actualCents": 210000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "recorrencia",
          "recurrenceId": "aluguel",
          "isPinned": true,
          "sortHint": 100
        },
        {
          "id": "rec_energia",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Energia",
          "labelSlug": "energia",
          "amount": {
            "plannedCents": 23450,
            "actualCents": 19870
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "recorrencia",
          "recurrenceId": "energia",
          "sortHint": 110
        },
        {
          "id": "rec_internet",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Internet",
          "labelSlug": "internet",
          "amount": {
            "plannedCents": 11990,
            "actualCents": 11990
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "origin": "recorrencia",
          "recurrenceId": "internet",
          "sortHint": 120
        },
        {
          "id": "rec_streaming",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "assinaturas",
          "title": "Streaming",
          "labelSlug": "streaming",
          "amount": {
            "plannedCents": 10270,
            "actualCents": 10270
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "split": {
            "mode": "compartilhado",
            "sharesByPersonId": {
              "ana": 5000,
              "bruno": 5000
            }
          },
          "lines": [
            {
              "label": "Netflix",
              "amountCents": 5590,
              "labelSlug": "netflix",
              "isSettled": true,
              "sortHint": 0
            },
            {
              "label": "Spotify",
              "amountCents": 2190,
              "labelSlug": "spotify",
              "isSettled": true,
              "sortHint": 100
            },
            {
              "label": "YouTube Premium",
              "amountCents": 2490,
              "labelSlug": "youtube-premium",
              "isSettled": true,
              "sortHint": 200
            }
          ],
          "origin": "recorrencia",
          "recurrenceId": "streaming",
          "sortHint": 200
        },
        {
          "id": "rec_academia-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Academia",
          "labelSlug": "academia",
          "amount": {
            "plannedCents": 12990,
            "actualCents": 12990
          },
          "status": "realizado",
          "accountId": "itau-bruno",
          "split": {
            "mode": "individual",
            "personId": "bruno",
            "sharesByPersonId": {
              "bruno": 10000
            }
          },
          "origin": "recorrencia",
          "recurrenceId": "academia-bruno",
          "sortHint": 210
        },
        {
          "id": "rec_natacao-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Natação",
          "labelSlug": "natacao",
          "amount": {
            "plannedCents": 18000,
            "actualCents": 18000
          },
          "status": "realizado",
          "accountId": "pix",
          "split": {
            "mode": "individual",
            "personId": "ana",
            "sharesByPersonId": {
              "ana": 10000
            }
          },
          "origin": "recorrencia",
          "recurrenceId": "natacao-ana",
          "sortHint": 220
        },
        {
          "id": "rec_reserva",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "patrimonio",
          "categoryId": "patrimonio",
          "title": "Reserva de emergência",
          "labelSlug": "reserva-de-emergencia",
          "amount": {
            "plannedCents": 100000,
            "actualCents": 100000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "note": "Arredondado à mão",
          "origin": "recorrencia",
          "recurrenceId": "reserva",
          "wealthItemId": "cdb-nubank",
          "incomePercent": {
            "rateBasisPoints": 1000,
            "base": "liquida"
          },
          "isLocked": true,
          "sortHint": 300
        },
        {
          "id": "inst_geladeira_7",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Geladeira",
          "labelSlug": "geladeira",
          "amount": {
            "plannedCents": 31990,
            "actualCents": 31990
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "origin": "parcela",
          "installmentPlanId": "geladeira",
          "installment": {
            "number": 7,
            "total": 10
          },
          "sortHint": 907
        },
        {
          "id": "inst_celular-bruno_1",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Celular",
          "labelSlug": "celular",
          "amount": {
            "plannedCents": 20825,
            "actualCents": 20825
          },
          "status": "realizado",
          "accountId": "itau-bruno",
          "split": {
            "mode": "individual",
            "personId": "bruno",
            "sharesByPersonId": {
              "bruno": 10000
            }
          },
          "origin": "parcela",
          "installmentPlanId": "celular-bruno",
          "installment": {
            "number": 1,
            "total": 12
          },
          "sortHint": 901
        },
        {
          "id": "2026-08-mercado",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "mercado",
          "title": "Mercado",
          "labelSlug": "mercado",
          "amount": {
            "plannedCents": 88630,
            "actualCents": 88630
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "lines": [
            {
              "label": "Supermercado",
              "amountCents": 51230,
              "labelSlug": "supermercado",
              "sortHint": 0
            },
            {
              "label": "Atacado",
              "amountCents": 38900,
              "labelSlug": "atacado",
              "sortHint": 100
            },
            {
              "label": "Estorno de embalagem",
              "amountCents": -1500,
              "labelSlug": "estorno-de-embalagem",
              "isRefund": true,
              "sortHint": 200
            }
          ],
          "origin": "manual",
          "sortHint": 500
        },
        {
          "id": "2026-08-combustivel",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "transporte",
          "title": "Combustível",
          "labelSlug": "combustivel",
          "amount": {
            "plannedCents": 32000,
            "actualCents": 29980
          },
          "status": "realizado",
          "accountId": "itau-bruno",
          "split": {
            "mode": "individual",
            "personId": "bruno",
            "sharesByPersonId": {
              "bruno": 10000
            }
          },
          "origin": "manual",
          "sortHint": 520
        },
        {
          "id": "2026-08-conserto-carro",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "transporte",
          "title": "Conserto do carro",
          "labelSlug": "conserto-do-carro",
          "amount": {
            "plannedCents": 90000,
            "paidCents": 40000
          },
          "status": "parcial",
          "accountId": "pix",
          "note": "Restante na entrega",
          "origin": "manual",
          "sortHint": 530
        },
        {
          "id": "2026-08-passagens",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "transporte",
          "title": "Passagens",
          "labelSlug": "passagens",
          "amount": {
            "plannedCents": 98000,
            "actualCents": 98000
          },
          "status": "realizado",
          "occurredOn": "2026-08-03T00:00:00.000Z",
          "accountId": "nubank-ana",
          "split": {
            "mode": "personalizado",
            "sharesByPersonId": {
              "ana": 6000,
              "bruno": 4000
            }
          },
          "origin": "manual",
          "sortHint": 540
        },
        {
          "id": "2026-08-presente-equipe",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Presente da equipe",
          "labelSlug": "presente-da-equipe",
          "amount": {
            "plannedCents": 12000,
            "actualCents": 12000
          },
          "status": "realizado",
          "accountId": "pix",
          "split": {
            "mode": "individual",
            "personId": "ana",
            "sharesByPersonId": {
              "ana": 10000
            }
          },
          "note": "Cada um transferiu R$ 30 depois",
          "origin": "manual",
          "counterpartyName": "Colegas do trabalho",
          "sortHint": 550
        }
      ],
      "balances": [
        {
          "wealthItemId": "cdb-nubank",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "balance": 1210000,
          "source": "manual"
        },
        {
          "wealthItemId": "tesouro-selic",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "balance": 785000,
          "source": "manual"
        },
        {
          "wealthItemId": "bitcoin",
          "householdId": "casa-aurora",
          "monthId": "2026-08",
          "balance": 285000,
          "source": "manual"
        }
      ]
    },
    {
      "id": "2026-09",
      "ref": "2026-09",
      "householdId": "casa-aurora",
      "openedAt": "2026-09-01T00:00:00.000Z",
      "entries": [
        {
          "id": "inc_salario-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Salário",
          "amount": {
            "plannedCents": 650000,
            "actualCents": 650000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "fonteReceita",
          "incomeSourceId": "salario-ana",
          "sortHint": 0
        },
        {
          "id": "inc_pj-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Consultoria PJ",
          "amount": {
            "plannedCents": 420000,
            "paidCents": 200000
          },
          "status": "parcial",
          "accountId": "pix",
          "origin": "fonteReceita",
          "incomeSourceId": "pj-bruno",
          "sortHint": 10
        },
        {
          "id": "inc_vale-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "receita",
          "categoryId": "receitas",
          "title": "Vale-alimentação",
          "amount": {
            "plannedCents": 80000,
            "actualCents": 80000
          },
          "status": "realizado",
          "accountId": "alelo",
          "origin": "fonteReceita",
          "incomeSourceId": "vale-ana",
          "sortHint": 20
        },
        {
          "id": "ret_inss-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "INSS",
          "amount": {
            "plannedCents": 71408,
            "actualCents": 71408
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "inss-ana",
          "sortHint": 100
        },
        {
          "id": "ret_irrf-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "IRRF",
          "amount": {
            "plannedCents": 42000,
            "actualCents": 42000
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "irrf-ana",
          "sortHint": 110
        },
        {
          "id": "ret_saude-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "Plano de saúde",
          "amount": {
            "plannedCents": 38000,
            "actualCents": 38000
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "lines": [
            {
              "label": "Titular",
              "amountCents": 25000,
              "labelSlug": "titular",
              "isSettled": true,
              "sortHint": 0
            },
            {
              "label": "Dependente",
              "amountCents": 13000,
              "labelSlug": "dependente",
              "isSettled": true,
              "sortHint": 100
            }
          ],
          "origin": "regraImposto",
          "withholdingRuleId": "saude-ana",
          "sortHint": 120
        },
        {
          "id": "ret_das-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "retencao",
          "categoryId": "retencoes",
          "title": "DAS (Simples Nacional) (8%)",
          "amount": {
            "plannedCents": 33600,
            "actualCents": 33600
          },
          "status": "realizado",
          "accountId": "nenhuma",
          "origin": "regraImposto",
          "withholdingRuleId": "das-bruno",
          "sortHint": 130
        },
        {
          "id": "rec_aluguel",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Aluguel",
          "labelSlug": "aluguel",
          "amount": {
            "plannedCents": 210000,
            "actualCents": 210000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "recorrencia",
          "recurrenceId": "aluguel",
          "isPinned": true,
          "sortHint": 100
        },
        {
          "id": "rec_energia",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Energia",
          "labelSlug": "energia",
          "amount": {
            "plannedCents": 19870
          },
          "status": "previsto",
          "accountId": "bb-conta",
          "origin": "recorrencia",
          "recurrenceId": "energia",
          "sortHint": 110
        },
        {
          "id": "rec_internet",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "moradia",
          "title": "Internet",
          "labelSlug": "internet",
          "amount": {
            "plannedCents": 11990,
            "actualCents": 11990
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "origin": "recorrencia",
          "recurrenceId": "internet",
          "sortHint": 120
        },
        {
          "id": "rec_streaming",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "assinaturas",
          "title": "Streaming",
          "labelSlug": "streaming",
          "amount": {
            "plannedCents": 10270,
            "actualCents": 10270
          },
          "status": "realizado",
          "accountId": "nubank-ana",
          "split": {
            "mode": "compartilhado",
            "sharesByPersonId": {
              "ana": 5000,
              "bruno": 5000
            }
          },
          "lines": [
            {
              "label": "Netflix",
              "amountCents": 5590,
              "labelSlug": "netflix",
              "isSettled": true,
              "sortHint": 0
            },
            {
              "label": "Spotify",
              "amountCents": 2190,
              "labelSlug": "spotify",
              "isSettled": true,
              "sortHint": 100
            },
            {
              "label": "YouTube Premium",
              "amountCents": 2490,
              "labelSlug": "youtube-premium",
              "isSettled": true,
              "sortHint": 200
            }
          ],
          "origin": "recorrencia",
          "recurrenceId": "streaming",
          "sortHint": 200
        },
        {
          "id": "rec_academia-bruno",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Academia",
          "labelSlug": "academia",
          "amount": {
            "plannedCents": 12990
          },
          "status": "previsto",
          "accountId": "itau-bruno",
          "split": {
            "mode": "individual",
            "personId": "bruno",
            "sharesByPersonId": {
              "bruno": 10000
            }
          },
          "origin": "recorrencia",
          "recurrenceId": "academia-bruno",
          "sortHint": 210
        },
        {
          "id": "rec_natacao-ana",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Natação",
          "labelSlug": "natacao",
          "amount": {
            "plannedCents": 18000,
            "actualCents": 18000
          },
          "status": "realizado",
          "accountId": "pix",
          "split": {
            "mode": "individual",
            "personId": "ana",
            "sharesByPersonId": {
              "ana": 10000
            }
          },
          "origin": "recorrencia",
          "recurrenceId": "natacao-ana",
          "sortHint": 220
        },
        {
          "id": "rec_reserva",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "patrimonio",
          "categoryId": "patrimonio",
          "title": "Reserva de emergência",
          "labelSlug": "reserva-de-emergencia",
          "amount": {
            "plannedCents": 96499
          },
          "status": "previsto",
          "accountId": "bb-conta",
          "origin": "recorrencia",
          "recurrenceId": "reserva",
          "wealthItemId": "cdb-nubank",
          "incomePercent": {
            "rateBasisPoints": 1000,
            "base": "liquida"
          },
          "sortHint": 300
        },
        {
          "id": "inst_geladeira_8",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Geladeira",
          "labelSlug": "geladeira",
          "amount": {
            "plannedCents": 31990
          },
          "status": "previsto",
          "accountId": "nubank-ana",
          "origin": "parcela",
          "installmentPlanId": "geladeira",
          "installment": {
            "number": 8,
            "total": 10
          },
          "sortHint": 908
        },
        {
          "id": "inst_celular-bruno_2",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Celular",
          "labelSlug": "celular",
          "amount": {
            "plannedCents": 20825
          },
          "status": "previsto",
          "accountId": "itau-bruno",
          "split": {
            "mode": "individual",
            "personId": "bruno",
            "sharesByPersonId": {
              "bruno": 10000
            }
          },
          "origin": "parcela",
          "installmentPlanId": "celular-bruno",
          "installment": {
            "number": 2,
            "total": 12
          },
          "sortHint": 902
        },
        {
          "id": "2026-09-mercado",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "mercado",
          "title": "Mercado",
          "labelSlug": "mercado",
          "amount": {
            "plannedCents": 62990,
            "paidCents": 47590
          },
          "status": "parcial",
          "accountId": "nubank-ana",
          "lines": [
            {
              "label": "Supermercado",
              "amountCents": 39990,
              "labelSlug": "supermercado",
              "isSettled": true,
              "sortHint": 0
            },
            {
              "label": "Feira",
              "amountCents": 7600,
              "labelSlug": "feira",
              "isSettled": true,
              "sortHint": 100
            },
            {
              "label": "Açougue",
              "amountCents": 15400,
              "labelSlug": "acougue",
              "sortHint": 200
            }
          ],
          "origin": "manual",
          "sortHint": 500
        },
        {
          "id": "2026-09-farmacia",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Farmácia",
          "labelSlug": "farmacia",
          "amount": {
            "plannedCents": 9000
          },
          "status": "previsto",
          "accountId": "nubank-ana",
          "split": {
            "mode": "individual",
            "personId": "ana",
            "sharesByPersonId": {
              "ana": 10000
            }
          },
          "origin": "manual",
          "sortHint": 510
        },
        {
          "id": "2026-09-combustivel",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "transporte",
          "title": "Combustível",
          "labelSlug": "combustivel",
          "amount": {
            "plannedCents": 30000,
            "actualCents": 30000
          },
          "status": "realizado",
          "accountId": "itau-bruno",
          "split": {
            "mode": "individual",
            "personId": "bruno",
            "sharesByPersonId": {
              "bruno": 10000
            }
          },
          "origin": "manual",
          "sortHint": 520
        },
        {
          "id": "2026-09-show",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "despesa",
          "categoryId": "despesas",
          "title": "Show",
          "labelSlug": "show",
          "amount": {
            "plannedCents": 24000
          },
          "status": "cancelado",
          "accountId": "nubank-ana",
          "note": "Evento cancelado pela produtora",
          "origin": "manual",
          "sortHint": 530
        },
        {
          "id": "2026-09-tesouro",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "type": "patrimonio",
          "categoryId": "patrimonio",
          "title": "Tesouro Selic",
          "labelSlug": "tesouro-selic",
          "amount": {
            "plannedCents": 50000,
            "actualCents": 50000
          },
          "status": "realizado",
          "accountId": "bb-conta",
          "origin": "manual",
          "wealthItemId": "tesouro-selic",
          "sortHint": 600
        }
      ],
      "balances": [
        {
          "wealthItemId": "cdb-nubank",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "balance": 1235000,
          "source": "manual"
        },
        {
          "wealthItemId": "tesouro-selic",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "balance": 840000,
          "source": "manual"
        },
        {
          "wealthItemId": "bitcoin",
          "householdId": "casa-aurora",
          "monthId": "2026-09",
          "balance": 310000,
          "source": "manual"
        }
      ]
    }
  ]
}
```

---

## Checklist antes de entregar

- [ ] É um JSON só, válido, sem comentários, sem texto dentro do bloco.
- [ ] `schemaVersion` é `1`; `household.id`, `firstMonth` e
      `lastOpenedMonthId` preenchidos.
- [ ] `accounts` tem `nenhuma` e `dinheiro`; todo `accountId` citado existe.
- [ ] Toda `categoryId` citada é uma das quatro do app ou está em
      `household.categories`; nenhuma das quatro está em `categories`.
- [ ] Todo `personId`/`sharesByPersonId` cita uma pessoa de `people`.
- [ ] Todo `categoryId` de `wealth_items` está em `household.wealthCategories`.
- [ ] Cada mês tem `id`, `ref`, `householdId` e `monthId` coerentes; ids de
      lançamento únicos no mês.
- [ ] `status` e `actualCents`/`paidCents` combinam (tabela de `amount`).
- [ ] Onde há `lines`, a soma com sinal é o valor do lançamento.
- [ ] `type` segue a categoria.
- [ ] Nenhum mês futuro; nenhum total escrito; nenhum `years`.
- [ ] Meses passados com `isImported: true`; o atual sem.
- [ ] Depois do JSON: o que ficou de fora, o que foi assumido, o que conferir.
