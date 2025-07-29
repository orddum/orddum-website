// Smooth scrolling para links de navegação
document.addEventListener('DOMContentLoaded', function () {
   // Smooth scrolling
   const navLinks = document.querySelectorAll('a[href^="#"]');
   navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
         e.preventDefault();
         const targetId = this.getAttribute('href');
         const targetSection = document.querySelector(targetId);
         if (targetSection) {
            targetSection.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
            });
         }
      });
   });

   // Navegação mobile
   const navToggle = document.querySelector('.nav-toggle');
   const navMenu = document.querySelector('.nav-menu');

   if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
         navMenu.classList.toggle('active');
         navToggle.classList.toggle('active');
      });
   }

   // Formulário de contato
   const contactForm = document.getElementById('contactForm');
   if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
         e.preventDefault();

         // Coletar dados do formulário
         const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
         };

         // Validar campos obrigatórios
         if (!formData.name || !formData.email || !formData.message) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
         }

         // Simular envio (em produção, aqui seria uma chamada para API)
         showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');

         // Limpar formulário
         contactForm.reset();

         // Redirecionar para WhatsApp com mensagem pré-formatada
         const whatsappMessage = `Olá! Sou ${formData.name} e gostaria de falar sobre desenvolvimento de aplicativo Flutter. ${formData.message}`;
         const whatsappUrl = `https://wa.me/5531995279032?text=${encodeURIComponent(whatsappMessage)}`;

         // Aguardar um pouco antes de redirecionar
         setTimeout(() => {
            window.open(whatsappUrl, '_blank');
         }, 2000);
      });
   }

   // Sistema de notificações
   function showNotification(message, type = 'info') {
      // Remover notificação existente
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
         existingNotification.remove();
      }

      // Criar nova notificação
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

      // Adicionar estilos
      notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff4444' : '#666666'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

      // Adicionar ao DOM
      document.body.appendChild(notification);

      // Botão de fechar
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
         notification.remove();
      });

      // Auto-remover após 5 segundos
      setTimeout(() => {
         if (notification.parentNode) {
            notification.remove();
         }
      }, 5000);
   }

   // Animação do botão WhatsApp
   const whatsappFloat = document.querySelector('.whatsapp-float');
   if (whatsappFloat) {
      whatsappFloat.addEventListener('mouseenter', function () {
         this.style.transform = 'scale(1.1)';
      });

      whatsappFloat.addEventListener('mouseleave', function () {
         this.style.transform = 'scale(1)';
      });
   }

   // Navegação ativa baseada no scroll
   const sections = document.querySelectorAll('section[id]');

   function updateActiveNavLink() {
      let current = '';
      sections.forEach(section => {
         const sectionTop = section.offsetTop;
         const sectionHeight = section.clientHeight;
         if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
         }
      });

      navLinks.forEach(link => {
         link.classList.remove('active');
         if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
         }
      });
   }

   window.addEventListener('scroll', updateActiveNavLink);
   updateActiveNavLink(); // Executar uma vez no carregamento

   // Header com scroll
   const header = document.querySelector('.header');
   let lastScrollTop = 0;

   window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
         // Scroll para baixo
         header.style.transform = 'translateY(-100%)';
      } else {
         // Scroll para cima
         header.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop;
   });

   // Animações de entrada
   const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
   };

   const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
         }
      });
   }, observerOptions);

   // Observar elementos para animação
   const animateElements = document.querySelectorAll('.service-card, .tech-category, .contact-item, .stat');
   animateElements.forEach(el => {
      observer.observe(el);
   });

   // Mensagem de boas-vindas no console
   console.log(`
    🚀 Bem-vindo ao site da Orddum!
    
    📱 Especialistas em desenvolvimento de aplicativos mobile com Flutter e Firebase
    
    📧 Contato: luiz.gonzaga@orddum.com
    📍 Localização: Itabira - MG
    💬 Suporte WhatsApp: (31) 99527-9032
    🔗 LinkedIn: https://www.linkedin.com/in/luizgonzagabn/
    
    Transforme sua ideia em um aplicativo profissional! 🎯
    `);
});

// CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.98);
        backdrop-filter: blur(10px);
        padding: 1rem;
        border-top: 1px solid var(--gray-300);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
        
        .nav-menu.active {
            display: flex;
        }
    }
`;
document.head.appendChild(style); 