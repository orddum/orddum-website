// Orddum Website - JavaScript Simplificado

document.addEventListener('DOMContentLoaded', function () {
   // Elementos do DOM
   const navToggle = document.querySelector('.nav-toggle');
   const navMenu = document.querySelector('.nav-menu');
   const navLinks = document.querySelectorAll('.nav-link');
   const sections = document.querySelectorAll('section');
   const contactForm = document.getElementById('contactForm');
   const whatsappFloat = document.querySelector('.whatsapp-float');

   // Mobile Menu Toggle
   if (navToggle) {
      navToggle.addEventListener('click', function () {
         navMenu.classList.toggle('active');
         navToggle.classList.toggle('active');
      });
   }

   // Fechar menu mobile ao clicar em um link
   navLinks.forEach(link => {
      link.addEventListener('click', function () {
         navMenu.classList.remove('active');
         navToggle.classList.remove('active');
      });
   });

   // Smooth scrolling para links internos
   navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
         const targetId = this.getAttribute('href');
         if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
               const headerHeight = document.querySelector('.header').offsetHeight;
               const targetPosition = targetSection.offsetTop - headerHeight;

               window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
               });
            }
         }
      });
   });

   // Active navigation link based on scroll position
   function updateActiveNavLink() {
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
         const sectionTop = section.offsetTop;
         const sectionHeight = section.offsetHeight;
         const sectionId = section.getAttribute('id');

         if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
               link.classList.remove('active');
               if (link.getAttribute('href') === `#${sectionId}`) {
                  link.classList.add('active');
               }
            });
         }
      });
   }

   // Header background on scroll
   function updateHeaderBackground() {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
         header.style.background = 'rgba(255, 255, 255, 0.98)';
         header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
         header.style.background = 'rgba(255, 255, 255, 0.98)';
         header.style.boxShadow = 'none';
      }
   }

   // Animate elements on scroll
   function animateOnScroll() {
      const elements = document.querySelectorAll('.service-card, .stat, .tech-category, .contact-item');

      elements.forEach(element => {
         const elementTop = element.getBoundingClientRect().top;
         const elementVisible = 150;

         if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
         }
      });
   }

   // Contact Form Handling
   if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
         e.preventDefault();

         // Get form data
         const formData = new FormData(this);
         const name = formData.get('name');
         const email = formData.get('email');
         const phone = formData.get('phone');
         const message = formData.get('message');

         // Validate form
         if (!name || !email || !message) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
         }

         // Email validation
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
         }

         // Simulate form submission
         const submitButton = this.querySelector('button[type="submit"]');
         const originalText = submitButton.textContent;

         submitButton.textContent = 'Enviando...';
         submitButton.disabled = true;

         // Simulate API call
         setTimeout(() => {
            // Create WhatsApp message
            const whatsappMessage = `Olá! Recebi uma nova mensagem do site:

*Nome:* ${name}
*Email:* ${email}
*Telefone:* ${phone || 'Não informado'}
*Mensagem:* ${message}

Por favor, entre em contato o mais breve possível.`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/5531995279032?text=${encodedMessage}`;

            // Show success message
            showNotification('Mensagem enviada com sucesso! Redirecionando para o WhatsApp...', 'success');

            // Reset form
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Redirect to WhatsApp after 2 seconds
            setTimeout(() => {
               window.open(whatsappUrl, '_blank');
            }, 2000);

         }, 1500);
      });
   }

   // Notification system
   function showNotification(message, type = 'info') {
      // Remove existing notifications
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
         existingNotification.remove();
      }

      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

      // Add styles
      notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#000000' : type === 'error' ? '#cc0000' : '#666666'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

      // Add to page
      document.body.appendChild(notification);

      // Close button functionality
      const closeButton = notification.querySelector('.notification-close');
      closeButton.addEventListener('click', () => {
         notification.remove();
      });

      // Auto remove after 5 seconds
      setTimeout(() => {
         if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
               if (notification.parentNode) {
                  notification.remove();
               }
            }, 300);
         }
      }, 5000);
   }

   // WhatsApp float button animation
   if (whatsappFloat) {
      whatsappFloat.addEventListener('mouseenter', function () {
         this.style.transform = 'scale(1.1)';
      });

      whatsappFloat.addEventListener('mouseleave', function () {
         this.style.transform = 'scale(1)';
      });
   }

   // Counter animation for stats
   function animateCounters() {
      const counters = document.querySelectorAll('.stat-number');

      counters.forEach(counter => {
         const target = parseInt(counter.textContent.replace(/\D/g, ''));
         const suffix = counter.textContent.replace(/\d/g, '');
         let current = 0;
         const increment = target / 50;

         const updateCounter = () => {
            if (current < target) {
               current += increment;
               counter.textContent = Math.ceil(current) + suffix;
               requestAnimationFrame(updateCounter);
            } else {
               counter.textContent = target + suffix;
            }
         };

         updateCounter();
      });
   }

   // Intersection Observer for animations
   const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
   };

   const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');

            // Animate counters when about section is visible
            if (entry.target.id === 'sobre') {
               animateCounters();
            }
         }
      });
   }, observerOptions);

   // Observe elements for animation
   document.querySelectorAll('.service-card, .stat, .tech-category, .contact-item').forEach(el => {
      observer.observe(el);
   });

   // Performance optimization: Throttle scroll events
   let ticking = false;

   function updateOnScroll() {
      updateActiveNavLink();
      updateHeaderBackground();
      animateOnScroll();
      ticking = false;
   }

   function requestTick() {
      if (!ticking) {
         requestAnimationFrame(updateOnScroll);
         ticking = true;
      }
   }

   // Event listeners
   window.addEventListener('scroll', requestTick);
   window.addEventListener('resize', updateOnScroll);

   // Initialize on page load
   updateOnScroll();

   // Add CSS animations
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
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
            padding: 0;
            line-height: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
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
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                padding: 2rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                border-top: 1px solid var(--gray-200);
            }
        }
    `;
   document.head.appendChild(style);

   // Console welcome message
   console.log(`
    🚀 Orddum Website - Carregado com sucesso!
    
    📱 Especialistas em Aplicativos Mobile
    📧 Contato: luiz.gonzaga@orddum.com
    📱 WhatsApp: (31) 99527-9032
    🌐 Site: www.orddum.com
    💼 LinkedIn: https://www.linkedin.com/in/luizgonzagabn/
    
    Desenvolvido com ❤️ pela Orddum
    `);
}); 