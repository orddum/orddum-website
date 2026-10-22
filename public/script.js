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
 *
 * O que entrou: o PALCO DE APPS. O trilho de painéis é scroll-snap puro, então
 * deslizar já troca de app sem JS nenhum; o script só sincroniza o seletor
 * (abas, setas, teclado, âncoras) com o trilho e liga o diálogo do vídeo. Sem
 * rotação automática: quem decide o ritmo é quem lê.
 */

// A classe `js` também é posta no <head> (antes da primeira pintura, para a
// página não piscar empilhada); aqui só garante o caso de ela ter sido tirada.
document.documentElement.classList.add('js');

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
   // Os links do menu são absolutos (`/#apps`), iguais em todas as páginas: só
   // os que apontam para a página atual (`link.pathname`) viram seção na tela.
   var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
   var byId = {};
   links.forEach(function (link) {
      if (link.pathname === location.pathname && link.hash) byId[link.hash.slice(1)] = link;
   });

   // Nas páginas filhas não há seção para observar: o menu marca o grupo a que
   // a página pertence, "Privacidade" para política e termos, "Apps" para o guia
   // de importação do Lastro.
   if (!Object.keys(byId).length) {
      var group = /\/importar\/?$/.test(location.pathname) ? '#apps' : '#privacidade';
      links.forEach(function (link) {
         if (link.hash === group) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
         }
      });
   }

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

   // ------------------------------------------------------------------------
   // Páginas legais: sumário "Nesta página", montado a partir dos h2. Sem JS ele
   // não existe e o texto inteiro funciona. Nenhum id existente é trocado (o
   // #exclusao do IPI e os do Ordinal estão em URLs das lojas): o h2 que já tem
   // id fica como está, e só o que não tem ganha um, derivado do texto.
   // ------------------------------------------------------------------------
   var layout = document.querySelector('.legal-layout');
   var legalMain = layout && layout.querySelector('.legal-main');
   var headings = legalMain ? Array.prototype.slice.call(legalMain.querySelectorAll('h2')) : [];

   if (headings.length >= 3) {
      var slug = function (text) {
         return text
            .replace(/^\s*\d+\.\s*/, '')
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'secao';
      };

      var toc = document.createElement('nav');
      toc.className = 'toc';
      toc.setAttribute('aria-label', 'Nesta página');
      var details = document.createElement('details');
      var summary = document.createElement('summary');
      summary.textContent = 'Nesta página';
      var list = document.createElement('ol');

      headings.forEach(function (heading) {
         if (!heading.id) {
            var base = slug(heading.textContent);
            var id = base;
            for (var n = 2; document.getElementById(id); n++) id = base + '-' + n;
            heading.id = id;
         }
         var item = document.createElement('li');
         var anchor = document.createElement('a');
         anchor.href = '#' + heading.id;
         anchor.textContent = heading.textContent;
         item.appendChild(anchor);
         list.appendChild(item);
      });

      details.appendChild(summary);
      details.appendChild(list);
      toc.appendChild(details);
      layout.insertBefore(toc, legalMain);

      // Largo: o sumário fica sempre aberto, ao lado do texto. Estreito: um
      // <details> fechado logo abaixo do cabeçalho da página.
      var wide = window.matchMedia('(min-width: 960px)');
      var fit = function () {
         details.open = wide.matches;
         summary.tabIndex = wide.matches ? -1 : 0;
      };
      fit();
      if (wide.addEventListener) wide.addEventListener('change', fit);
      else if (wide.addListener) wide.addListener(fit);

      // Escolher um item no celular fecha o sumário, senão ele cobre o texto.
      list.addEventListener('click', function (event) {
         if (event.target.closest('a') && !wide.matches) details.open = false;
      });

      // Marca o item da seção que está sob o cabeçalho. O observador dispara
      // quando um h2 cruza a linha; a seção atual é o último h2 acima dela.
      if ('IntersectionObserver' in window) {
         var anchors = Array.prototype.slice.call(list.querySelectorAll('a'));
         var mark = function () {
            var index = -1;
            headings.forEach(function (heading, i) {
               if (heading.getBoundingClientRect().top <= 140) index = i;
            });
            anchors.forEach(function (a, i) {
               if (i === index) a.setAttribute('aria-current', 'location');
               else a.removeAttribute('aria-current');
            });
         };
         var tocObserver = new IntersectionObserver(mark, { rootMargin: '-140px 0px 0px 0px' });
         headings.forEach(function (heading) { tocObserver.observe(heading); });
         mark();
      }
   }

   // ------------------------------------------------------------------------
   // Palco de apps — padrão "tabbed carousel" do WAI-ARIA APG.
   // ------------------------------------------------------------------------
   // O vídeo mudo de cada painel (bloco no começo da galeria) toca sozinho só
   // quando é o app ativo e está a pelo menos 50% na janela. `wantPlay` é a
   // vontade da pessoa: se ela pausar, o vídeo não volta sozinho; com
   // movimento reduzido ou economia de dados, começa pausado.
   var syncVideos = function () {};
   var dialogOpen = false;

   var stage = document.querySelector('.stage');
   var rail = stage && stage.querySelector('.rail');
   var tablist = stage && stage.querySelector('[role="tablist"]');

   if (stage && rail && tablist) {
      var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(rail.querySelectorAll('[role="tabpanel"]'));
      var ids = panels.map(function (panel) { return panel.id; });
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      var current = 0;
      var pending = null;   // painel para onde uma rolagem animada está indo
      var pendingTimer = null;

      var behavior = function (instant) {
         return (instant || reduceMotion.matches) ? 'auto' : 'smooth';
      };

      // Marca a aba e o painel ativos. Os painéis fora da tela ficam `inert`:
      // sem isso o Tab do teclado entraria em botões e links que ninguém vê.
      var setActive = function (index) {
         current = index;
         tabs.forEach(function (tab, i) {
            tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
            tab.tabIndex = i === index ? 0 : -1;
         });
         panels.forEach(function (panel, i) {
            if (i === index) panel.removeAttribute('inert');
            else panel.setAttribute('inert', '');
         });
         stage.setAttribute('data-active', String(index + 1));
         syncVideos();

         // No celular as abas rolam; mantém a ativa à vista sem mexer na página
         // (scrollIntoView rolaria a janela também).
         var tab = tabs[index];
         if (tablist.scrollWidth > tablist.clientWidth) {
            tablist.scrollTo({
               left: tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2,
               behavior: behavior(false)
            });
         }
      };

      // Rola o trilho até o painel. Enquanto a rolagem animada passa pelos
      // painéis do meio, o observador fica calado, senão as abas piscariam.
      var goTo = function (index, instant) {
         index = (index + panels.length) % panels.length;
         pending = index;
         clearTimeout(pendingTimer);
         pendingTimer = setTimeout(function () { pending = null; }, instant ? 60 : 1500);
         rail.scrollTo({ left: panels[index].offsetLeft - panels[0].offsetLeft, behavior: behavior(instant) });
         setActive(index);
      };

      rail.addEventListener('scrollend', function () { pending = null; });

      // Quem desliza com o dedo: o painel que ocupa 60% do trilho é o ativo.
      if ('IntersectionObserver' in window) {
         var railObserver = new IntersectionObserver(function (entries) {
            if (pending !== null) return;
            entries.forEach(function (entry) {
               if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                  var index = panels.indexOf(entry.target);
                  if (index !== current) setActive(index);
               }
            });
         }, { root: rail, threshold: 0.6 });
         panels.forEach(function (panel) { railObserver.observe(panel); });
      }

      tabs.forEach(function (tab, index) {
         tab.addEventListener('click', function (event) {
            event.preventDefault();
            goTo(index);
            // O endereço acompanha o app aberto, para o link ser compartilhável.
            // replaceState não dispara `hashchange` nem rola a página.
            try { history.replaceState(null, '', '#' + ids[index]); } catch (e) { /* file:// */ }
         });
      });

      // Setas, Home e End dentro do seletor; o foco anda junto com a aba.
      tablist.addEventListener('keydown', function (event) {
         var next = null;
         if (event.key === 'ArrowRight') next = current + 1;
         else if (event.key === 'ArrowLeft') next = current - 1;
         else if (event.key === 'Home') next = 0;
         else if (event.key === 'End') next = panels.length - 1;
         if (next === null) return;
         event.preventDefault();
         next = (next + panels.length) % panels.length;
         goTo(next);
         tabs[next].focus({ preventScroll: true });
      });

      Array.prototype.forEach.call(stage.querySelectorAll('.arrow'), function (arrow) {
         arrow.addEventListener('click', function () {
            goTo(current + Number(arrow.getAttribute('data-dir')));
         });
      });

      // A rolagem nativa até o painel do hash deixaria as abas, que ficam logo
      // acima dele, embaixo do cabeçalho. E o Chrome a repete a cada mudança de
      // layout (um banner que termina de carregar) até a pessoa rolar, então
      // não adianta rolar para outro lugar: o jeito é ela parar onde queremos.
      // O scroll-margin-top do painel é a altura das abas mais um respiro.
      var alignMargin = function () {
         var gap = panels[0].getBoundingClientRect().top - tablist.getBoundingClientRect().top;
         panels.forEach(function (panel) { panel.style.scrollMarginTop = (gap + 21) + 'px'; });
      };
      alignMargin();

      window.addEventListener('resize', function () {
         alignMargin();
         rail.scrollTo({ left: panels[current].offsetLeft - panels[0].offsetLeft, behavior: 'auto' });
      });

      // Âncora: /#lastro, /#ipi, /#ararinha e /#faco-agora (as URLs das antigas
      // vitrines) abrem o palco no app certo, com as abas à vista. O trilho vai
      // sem animação.
      var openFromHash = function () {
         var index = ids.indexOf(decodeURIComponent(location.hash.slice(1)));
         if (index < 0) return false;
         goTo(index, true);
         panels[index].scrollIntoView({ behavior: 'instant', block: 'start' });
         return true;
      };

      var saveData = navigator.connection && navigator.connection.saveData;
      var clips = panels.map(function (panel, index) {
         var block = panel.querySelector('.shot-video');
         if (!block) return null;
         return {
            index: index,
            block: block,
            video: block.querySelector('video'),
            toggle: block.querySelector('[data-video-toggle]'),
            visible: false,
            wantPlay: !reduceMotion.matches && !saveData
         };
      });

      var paintToggle = function (clip) {
         clip.toggle.classList.toggle('is-paused', !clip.wantPlay);
         clip.toggle.setAttribute('aria-label', clip.wantPlay ? 'Pausar vídeo' : 'Tocar vídeo');
      };

      syncVideos = function () {
         clips.forEach(function (clip) {
            if (!clip) return;
            var play = clip.wantPlay && !dialogOpen && clip.index === current && clip.visible;
            if (play) {
               var started = clip.video.play();
               if (started && started.catch) started.catch(function () { /* o botão fica à mão */ });
            } else {
               clip.video.pause();
            }
         });
      };

      clips.forEach(function (clip) {
         if (!clip) return;
         paintToggle(clip);
         clip.toggle.addEventListener('click', function () {
            clip.wantPlay = !clip.wantPlay;
            paintToggle(clip);
            syncVideos();
         });
      });

      if ('IntersectionObserver' in window) {
         var clipObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
               clips.forEach(function (clip) {
                  if (clip && clip.block === entry.target) clip.visible = entry.isIntersecting;
               });
            });
            syncVideos();
         }, { threshold: 0.5 });
         clips.forEach(function (clip) { if (clip) clipObserver.observe(clip.block); });
      }

      setActive(0);
      if (openFromHash()) {
         // As fontes chegam depois e mudam a altura das abas e do que vem antes.
         // Recalcula a margem e refaz quando as fontes e a página terminam de
         // carregar, se a pessoa ainda não tiver mexido na página. Comparar o
         // scrollY não serve: a rolagem nativa do navegador também o muda.
         var touched = false;
         ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (type) {
            window.addEventListener(type, function () { touched = true; }, { once: true, passive: true });
         });
         var reopen = function () { alignMargin(); if (!touched) openFromHash(); };
         if (document.fonts && document.fonts.ready) document.fonts.ready.then(reopen);
         if (document.readyState === 'complete') reopen();
         else window.addEventListener('load', function () { setTimeout(reopen, 0); });
      }
      window.addEventListener('hashchange', openFromHash);
   }

   // ------------------------------------------------------------------------
   // Vídeo completo: o bloco é um link para o mp4 (funciona sem JS); com JS, o
   // link e o botão "Ver com som" abrem o <dialog> nativo, que já traz o Esc, o
   // foco preso e o fundo inerte. O vídeo mudo do bloco pausa enquanto ele está
   // aberto e só retoma se estava tocando.
   // ------------------------------------------------------------------------
   var dialogs = {};
   Array.prototype.forEach.call(document.querySelectorAll('[data-dialog]'), function (trigger) {
      var id = trigger.getAttribute('data-dialog');
      var dialog = document.getElementById(id);
      if (!dialog || typeof dialog.showModal !== 'function') return;
      var video = dialog.querySelector('video');

      if (!dialogs[id]) {
         dialogs[id] = { opener: null };

         dialog.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });

         // Clique no fundo escuro fecha. O alvo é o próprio <dialog> também nas
         // margens internas dele, então confere se o ponto caiu fora da caixa.
         dialog.addEventListener('click', function (event) {
            var box = dialog.getBoundingClientRect();
            var outside = event.clientX < box.left || event.clientX > box.right ||
               event.clientY < box.top || event.clientY > box.bottom;
            if (event.target === dialog && outside) dialog.close();
         });

         // `close` vale para o botão, o Esc e o fundo: pausa, devolve o foco a
         // quem abriu e deixa o vídeo do bloco retomar.
         dialog.addEventListener('close', function () {
            if (video) video.pause();
            dialogOpen = false;
            syncVideos();
            if (dialogs[id].opener) dialogs[id].opener.focus({ preventScroll: true });
         });
      }

      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.addEventListener('click', function (event) {
         event.preventDefault();
         dialogs[id].opener = trigger;
         dialogOpen = true;
         syncVideos();
         dialog.showModal();
         if (video) {
            var started = video.play();
            if (started && started.catch) started.catch(function () { /* o controle fica à mão */ });
         }
      });
   });
});
