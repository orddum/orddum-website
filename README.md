# Site da Igreja Presbiteriana de Itabira

Este é o site oficial da Igreja Presbiteriana de Itabira, hospedado no Firebase Hosting.

## 🚀 Status do Deploy

✅ **Site Deployado com Sucesso!**
- **URL do Firebase:** https://ipi-app-b298b.web.app
- **URL de Preview:** https://ipi-app-b298b--preview-dqr1uzhv.web.app

## 🌐 Configuração do Domínio Personalizado

### Passo 1: Adicionar Domínio no Firebase Console

1. Acesse o [Firebase Console](https://console.firebase.google.com/project/ipi-app-b298b/overview)
2. Vá para **Hosting** no menu lateral
3. Clique em **Adicionar domínio personalizado**
4. Digite: `www.orddum.com`
5. Clique em **Continuar**

### Passo 2: Configurar DNS

O Firebase fornecerá os seguintes registros DNS que você deve adicionar no seu provedor de DNS:

#### Registros A (para o domínio raiz):
```
Tipo: A
Nome: @
Valor: 151.101.1.195
TTL: 1 hora

Tipo: A
Nome: @
Valor: 151.101.65.195
TTL: 1 hora
```

#### Registro CNAME (para www):
```
Tipo: CNAME
Nome: www
Valor: ipi-app-b298b.web.app
TTL: 1 hora
```

### Passo 3: Verificar Configuração

Após adicionar os registros DNS, aguarde alguns minutos e verifique se o domínio está funcionando.

## 📁 Estrutura do Projeto

```
orddum-website/
├── public/
│   ├── index.html          # Página principal
│   ├── styles.css          # Estilos CSS
│   ├── script.js           # JavaScript
│   ├── logo.png            # Logo da igreja
│   └── church.jpg          # Imagem da igreja
├── firebase.json           # Configuração do Firebase
├── .firebaserc            # Configuração do projeto
└── README.md              # Este arquivo
```

## 🛠️ Comandos Úteis

### Deploy do Site
```bash
firebase deploy --only hosting
```

### Deploy de Preview
```bash
firebase hosting:channel:deploy preview
```

### Servidor Local
```bash
firebase serve
```

## 🎨 Características do Site

- ✅ Design responsivo e moderno
- ✅ Navegação suave
- ✅ Animações CSS
- ✅ Formulário de contato
- ✅ Botão flutuante do WhatsApp
- ✅ SEO otimizado
- ✅ Performance otimizada
- ✅ Acessibilidade

## 📱 Seções do Site

1. **Hero Section** - Boas-vindas e chamada para ação
2. **Sobre Nós** - História, missão e valores da igreja
3. **Horários dos Cultos** - Informações sobre os serviços
4. **Ministérios** - Diferentes áreas de atuação
5. **Contato** - Formulário e informações de contato

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Flexbox e Grid
- **JavaScript** - Interatividade e animações
- **Firebase Hosting** - Hospedagem e CDN
- **Google Fonts** - Tipografia (Inter)

## 📞 Informações de Contato

- **Endereço:** Rua Platina, 410, Major Lage de Baixo, Itabira - MG
- **Telefone:** (31) 3834-5026
- **WhatsApp:** (31) 3834-5026
- **Email:** igrejapresbiterianadeitabira@gmail.com

## 🚀 Próximos Passos

1. ✅ Configurar domínio personalizado no Firebase
2. ✅ Adicionar registros DNS no provedor
3. 🔄 Configurar SSL automático (Firebase faz automaticamente)
4. 🔄 Configurar redirecionamento de HTTP para HTTPS
5. 🔄 Adicionar analytics (Google Analytics)

## 📝 Notas Importantes

- O Firebase Hosting fornece SSL gratuito automaticamente
- O site é otimizado para SEO e performance
- Todas as imagens são otimizadas para web
- O formulário de contato está configurado para validação básica

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do Firebase Console
2. Teste localmente com `firebase serve`
3. Verifique a configuração DNS com ferramentas online

---

**Desenvolvido com ❤️ para a Igreja Presbiteriana de Itabira** # Teste de deploy automático
