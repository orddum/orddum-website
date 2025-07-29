# Orddum - Desenvolvimento de Aplicativos Mobile

Site institucional da Orddum, especializada em desenvolvimento de aplicativos mobile com Flutter e Firebase.

## 🚀 Sobre

A Orddum é uma empresa especializada em desenvolvimento de aplicativos mobile multiplataforma usando Flutter e Firebase. Nossa missão é transformar ideias em aplicativos profissionais para iOS e Android com arquitetura limpa e integração nativa.

## 🛠️ Tecnologias

- **Flutter & Dart** - Framework multiplataforma para desenvolvimento mobile
- **Firebase** - Backend como serviço (Authentication, Firestore, Cloud Functions, Analytics)
- **Clean Architecture** - Padrões de arquitetura limpa e SOLID
- **HTML5, CSS3, JavaScript** - Frontend do site institucional

## 📱 Serviços

- **Aplicativos Flutter** - Desenvolvimento multiplataforma para iOS e Android
- **Integração Firebase** - Implementação completa do ecossistema Firebase
- **Arquitetura Limpa** - Código escalável e manutenível seguindo padrões SOLID
- **Manutenção e Suporte** - Atualizações e suporte técnico contínuo

## 🌐 Deploy

O site está hospedado no Firebase Hosting e é acessível através de:
- **URL Principal**: https://orddum.web.app
- **Domínio Personalizado**: https://www.orddum.com

## 📞 Contato

- **Email**: luiz.gonzaga@orddum.com
- **Localização**: Itabira - MG, Brasil
- **WhatsApp**: (31) 99527-9032
- **LinkedIn**: [luizgonzagabn](https://www.linkedin.com/in/luizgonzagabn/)

## 🔧 Desenvolvimento

### Pré-requisitos
- Node.js
- Firebase CLI

### Instalação
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Fazer login no Firebase
firebase login

# Inicializar o projeto (já configurado)
firebase init hosting
```

### Deploy Local
```bash
# Servir localmente
firebase serve

# Deploy para produção
firebase deploy
```

## 📋 Estrutura do Projeto

```
orddum-website/
├── public/                 # Arquivos públicos do site
│   ├── index.html         # Página principal
│   ├── styles.css         # Estilos CSS
│   ├── script.js          # JavaScript
│   ├── logo.png           # Logo da empresa
│   └── logo_large.png     # Logo grande
├── .firebaserc            # Configuração do projeto Firebase
├── firebase.json          # Configuração do Firebase Hosting
└── README.md              # Este arquivo
```

## 🎨 Design

O site utiliza um tema dark moderno com:
- **Cores**: Preto e branco (baseado na identidade visual da Orddum)
- **Tipografia**: Inter (Google Fonts)
- **Layout**: Responsivo e otimizado para mobile
- **Animações**: Suaves e profissionais

## 🔄 CI/CD

O projeto utiliza GitHub Actions para deploy automático:
- Deploy automático na branch `main`
- Preview automático em Pull Requests
- Integração com Firebase Hosting

## 📄 Licença

© 2024 Orddum. Todos os direitos reservados.

---

**Transforme sua ideia em um aplicativo profissional com Flutter e Firebase!** 🚀
