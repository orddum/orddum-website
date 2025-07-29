// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
   const navToggle = document.querySelector('.nav-toggle');
   const navMenu = document.querySelector('.nav-menu');

   if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
         navMenu.classList.toggle('active');

         // Animate hamburger menu
         const spans = navToggle.querySelectorAll('span');
         spans.forEach(span => span.classList.toggle('active'));
      });
   }

   // Close mobile menu when clicking on a link
   const navLinks = document.querySelectorAll('.nav-link');
   navLinks.forEach(link => {
      link.addEventListener('click', function () {
         navMenu.classList.remove('active');
      });
   });

   // Smooth scrolling for anchor links
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
         e.preventDefault();
         const target = document.querySelector(this.getAttribute('href'));
         if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
               top: targetPosition,
               behavior: 'smooth'
            });
         }
      });
   });

   // Header background on scroll
   const header = document.querySelector('.header');
   window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
         header.style.background = 'rgba(255, 255, 255, 0.98)';
      } else {
         header.style.background = 'rgba(255, 255, 255, 0.95)';
      }
   });

   // Intersection Observer for fade-in animations
   const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
   };

   const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('visible');
         }
      });
   }, observerOptions);

   // Observe elements for animation
   const animateElements = document.querySelectorAll('.service-card, .ministry-card, .stat, .contact-item');
   animateElements.forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
   });

   // Contact form handling
   const contactForm = document.getElementById('contactForm');
   if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
         e.preventDefault();

         // Get form data
         const formData = new FormData(this);
         const name = formData.get('name');
         const email = formData.get('email');
         const phone = formData.get('phone');
         const message = formData.get('message');

         // Simple validation
         if (!name || !email || !message) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
         }

         // Email validation
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
            alert('Por favor, insira um email válido.');
            return;
         }

         // Here you would typically send the data to a server
         // For now, we'll just show a success message
         alert('Obrigado pela sua mensagem! Entraremos em contato em breve.');

         // Reset form
         this.reset();
      });
   }

   // Add loading animation to buttons
   const buttons = document.querySelectorAll('.btn');
   buttons.forEach(button => {
      button.addEventListener('click', function () {
         if (!this.classList.contains('btn-secondary')) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
               this.style.transform = '';
            }, 150);
         }
      });
   });

   // Parallax effect for hero section
   const hero = document.querySelector('.hero');
   if (hero) {
      window.addEventListener('scroll', function () {
         const scrolled = window.pageYOffset;
         const rate = scrolled * -0.5;
         hero.style.transform = `translateY(${rate}px)`;
      });
   }

   // Add active class to navigation links based on scroll position
   const sections = document.querySelectorAll('section[id]');
   const navLinksForScroll = document.querySelectorAll('.nav-link');

   window.addEventListener('scroll', function () {
      let current = '';
      const headerHeight = document.querySelector('.header').offsetHeight;

      sections.forEach(section => {
         const sectionTop = section.offsetTop - headerHeight - 100;
         const sectionHeight = section.offsetHeight;

         if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
         }
      });

      navLinksForScroll.forEach(link => {
         link.classList.remove('active');
         if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
         }
      });
   });

   // Add CSS for active navigation link
   const style = document.createElement('style');
   style.textContent = `
        .nav-link.active {
            color: #2563eb !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
        .nav-toggle span.active:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .nav-toggle span.active:nth-child(2) {
            opacity: 0;
        }
        .nav-toggle span.active:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
   document.head.appendChild(style);

   // Add WhatsApp floating button
   const whatsappButton = document.createElement('a');
   whatsappButton.href = 'https://wa.me/553138345026';
   whatsappButton.target = '_blank';
   whatsappButton.rel = 'noopener noreferrer';
   whatsappButton.innerHTML = '💬';
   whatsappButton.className = 'whatsapp-float';
   whatsappButton.title = 'Fale conosco no WhatsApp';

   const whatsappStyle = document.createElement('style');
   whatsappStyle.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #25d366;
            color: white;
            border-radius: 50%;
            text-align: center;
            font-size: 30px;
            line-height: 60px;
            text-decoration: none;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        }
        
        .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(37, 211, 102, 0.4);
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
            }
            70% {
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.6);
            }
            100% {
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
            }
        }
        
        @media (max-width: 768px) {
            .whatsapp-float {
                width: 50px;
                height: 50px;
                font-size: 25px;
                line-height: 50px;
                bottom: 15px;
                right: 15px;
            }
        }
    `;

   document.head.appendChild(whatsappStyle);
   document.body.appendChild(whatsappButton);

   // Add scroll to top button
   const scrollTopButton = document.createElement('button');
   scrollTopButton.innerHTML = '↑';
   scrollTopButton.className = 'scroll-top';
   scrollTopButton.title = 'Voltar ao topo';

   const scrollTopStyle = document.createElement('style');
   scrollTopStyle.textContent = `
        .scroll-top {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
        }
        
        .scroll-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-top:hover {
            background: #1d4ed8;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .scroll-top {
                bottom: 80px;
                right: 15px;
                width: 45px;
                height: 45px;
                font-size: 18px;
            }
        }
    `;

   document.head.appendChild(scrollTopStyle);
   document.body.appendChild(scrollTopButton);

   // Show/hide scroll to top button
   window.addEventListener('scroll', function () {
      if (window.pageYOffset > 300) {
         scrollTopButton.classList.add('visible');
      } else {
         scrollTopButton.classList.remove('visible');
      }
   });

   // Scroll to top functionality
   scrollTopButton.addEventListener('click', function () {
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      });
   });

   // Add loading animation for images
   const images = document.querySelectorAll('img');
   images.forEach(img => {
      img.addEventListener('load', function () {
         this.style.opacity = '1';
      });

      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
   });

   // Add counter animation for stats
   const stats = document.querySelectorAll('.stat-number');
   const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
         current += increment;
         if (current >= target) {
            current = target;
            clearInterval(timer);
         }
         element.textContent = Math.floor(current) + (target === 8 ? '' : '+');
      }, 30);
   };

   const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent.replace('+', ''));
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
         }
      });
   }, { threshold: 0.5 });

   stats.forEach(stat => {
      statsObserver.observe(stat);
   });
}); 