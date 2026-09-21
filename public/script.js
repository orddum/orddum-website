/* Orddum — o pouco de JavaScript que a página precisa.
 *
 * O que saiu daqui, e por quê:
 *
 *  - O FORMULÁRIO DE CONTATO. Ele dizia "Mensagem enviada com sucesso!" e não
 *    enviava nada: não havia backend. Depois abria o WhatsApp. Uma confirmação
 *    de envio que não corresponde a envio nenhum é a pior coisa que uma página
 *    de contato pode fazer, porque quem acredita nela não tenta de novo. No
 *    lugar dele ficaram os canais diretos, que abrem o app certo.
 *  - A ROLAGEM SUAVE em JavaScript, que `scroll-behavior: smooth` no CSS faz
 *    melhor — e com `scroll-padding-top`, que a versão em JS não tinha, então a
 *    âncora parava embaixo do cabeçalho fixo.
 *  - O CABEÇALHO QUE SUMIA ao rolar para baixo: numa página curta ele piscava.
 *  - O CSS injetado por JS, que agora mora no `styles.css`.
 */

document.addEventListener('DOMContentLoaded', function () {
   var toggle = document.getElementById('navToggle');
   var menu = document.getElementById('navMenu');

   if (toggle && menu) {
      toggle.addEventListener('click', function () {
         var open = menu.classList.toggle('open');
         toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
         toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      });

      var close = function () {
         if (!menu.classList.contains('open')) return;
         menu.classList.remove('open');
         toggle.setAttribute('aria-expanded', 'false');
         toggle.setAttribute('aria-label', 'Abrir menu');
      };

      // Tocar num item fecha o menu — senão ele cobre a seção recém-aberta.
      menu.addEventListener('click', function (event) {
         if (event.target.closest('a')) close();
      });

      // Esc fecha, e devolve o foco ao botão: quem abriu pelo teclado precisa
      // de um jeito de sair sem percorrer o menu inteiro.
      document.addEventListener('keydown', function (event) {
         if (event.key === 'Escape' && menu.classList.contains('open')) {
            close();
            toggle.focus();
         }
      });
   }

   // Marcar no menu a seção que está na tela. IntersectionObserver em vez de
   // listener de scroll: o listener roda a cada quadro e recalcula offsets.
   var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
   var byId = {};
   links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) === '#') byId[href.slice(1)] = link;
   });

   var sections = Object.keys(byId)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

   if (sections.length && 'IntersectionObserver' in window) {
      var visible = new Set();

      var observer = new IntersectionObserver(function (entries) {
         entries.forEach(function (entry) {
            if (entry.isIntersecting) visible.add(entry.target.id);
            else visible.delete(entry.target.id);
         });

         // A primeira visível na ordem do documento é a que o menu marca.
         var current = null;
         for (var i = 0; i < sections.length; i++) {
            if (visible.has(sections[i].id)) { current = sections[i].id; break; }
         }

         links.forEach(function (link) { link.classList.remove('active'); });
         if (current && byId[current]) byId[current].classList.add('active');
      }, { rootMargin: '-45% 0px -45% 0px' });

      sections.forEach(function (section) { observer.observe(section); });
   }
});
