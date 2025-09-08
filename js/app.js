// Guia Profissional de Desenvolvimento Web
// Tema, menu, atalhos, favoritos, filtros, checklist, quiz

// Tema claro/escuro
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  setTheme(saved);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
    btn.setAttribute('aria-label', 'Alternar tema claro/escuro');
  });
})();

// Menu responsivo
(function() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
  }
})();

// Atalhos de teclado
(function() {
  document.addEventListener('keydown', e => {
    if (e.key === '/') {
      const search = document.querySelector('input[type="search"]');
      if (search) search.focus();
    }
    if (e.altKey && e.key.toLowerCase() === 'm') {
      const menu = document.querySelector('.menu-toggle');
      if (menu) menu.focus();
    }
    if (e.key === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();

// Favoritar cards de tecnologias
function toggleFav(id) {
  let favs = JSON.parse(localStorage.getItem('favs') || '[]');
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem('favs', JSON.stringify(favs));
  renderFavs();
}
function renderFavs() {
  let favs = JSON.parse(localStorage.getItem('favs') || '[]');
  document.querySelectorAll('.fav[data-id]').forEach(el => {
    el.classList.toggle('active', favs.includes(el.dataset.id));
    el.setAttribute('aria-pressed', favs.includes(el.dataset.id));
  });
}
document.addEventListener('DOMContentLoaded', renderFavs);

// Filtros e busca em tecnologias.html
function filterTechs() {
  const cat = localStorage.getItem('techCat') || 'all';
  const search = document.querySelector('#tech-search').value.toLowerCase();
  document.querySelectorAll('.tech-card').forEach(card => {
    const matchCat = cat === 'all' || card.dataset.cat === cat;
    const matchText = card.textContent.toLowerCase().includes(search);
    card.style.display = matchCat && matchText ? '' : 'none';
  });
  // Erro: busca sem resultados
  const visible = Array.from(document.querySelectorAll('.tech-card')).some(card => card.style.display !== 'none');
  document.querySelector('#tech-erro').style.display = visible ? 'none' : '';
}
function setTechCat(cat) {
  localStorage.setItem('techCat', cat);
  filterTechs();
}
(function() {
  if (location.pathname.endsWith('tecnologias.html')) {
    document.querySelectorAll('.tech-filter').forEach(btn => {
      btn.addEventListener('click', () => setTechCat(btn.dataset.cat));
    });
    document.querySelector('#tech-search').addEventListener('input', filterTechs);
    filterTechs();
  }
})();

// Modal de detalhes em tecnologias.html
function showTechModal(id) {
  const modal = document.querySelector('#tech-modal');
  const card = document.querySelector('.tech-card[data-id="' + id + '"]');
  if (modal && card) {
    modal.querySelector('.modal-title').textContent = card.querySelector('.tech-title').textContent;
    modal.querySelector('.modal-bullets').innerHTML = card.querySelector('.tech-bullets').innerHTML;
    modal.classList.add('open');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'false');
  }
}
function closeTechModal() {
  const modal = document.querySelector('#tech-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}
(function() {
  if (location.pathname.endsWith('tecnologias.html')) {
    document.querySelectorAll('.tech-card').forEach(card => {
      card.addEventListener('click', () => showTechModal(card.dataset.id));
    });
    document.querySelector('#tech-modal .close').addEventListener('click', closeTechModal);
  }
})();

// Accordion e checklist em boas-praticas.html
(function() {
  if (location.pathname.endsWith('boas-praticas.html')) {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        header.parentElement.classList.toggle('open');
        header.setAttribute('aria-expanded', header.parentElement.classList.contains('open'));
      });
    });
    // Checklist
    const checklist = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    function updateChecklist() {
      const checked = Array.from(checklist).filter(c => c.checked).length;
      const percent = Math.round((checked / checklist.length) * 100);
      document.querySelector('#checklist-progress').textContent = percent + '%';
      localStorage.setItem('checklist', JSON.stringify(Array.from(checklist).map(c => c.checked)));
    }
    checklist.forEach((c, i) => {
      c.addEventListener('change', updateChecklist);
    });
    // Load checklist
    const saved = JSON.parse(localStorage.getItem('checklist') || '[]');
    checklist.forEach((c, i) => { c.checked = !!saved[i]; });
    updateChecklist();
  }
})();

// Fluxograma e tooltips em fluxo.html
(function() {
  if (location.pathname.endsWith('fluxo.html')) {
    document.querySelectorAll('.timeline-step').forEach(step => {
      step.addEventListener('click', () => {
        document.querySelectorAll('.timeline-step').forEach(s => s.classList.remove('show-tooltip'));
        step.classList.add('show-tooltip');
      });
      step.setAttribute('tabindex', '0');
      step.setAttribute('aria-label', step.querySelector('.step-title').textContent);
    });
    document.addEventListener('click', e => {
      if (!e.target.classList.contains('timeline-step')) {
        document.querySelectorAll('.timeline-step').forEach(s => s.classList.remove('show-tooltip'));
      }
    });
  }
})();

// Quiz em quiz.html
(function() {
  if (location.pathname.endsWith('quiz.html')) {
    const quizData = [
      {
        q: 'Qual elemento HTML é usado para títulos?',
        a: ['<title>', '<h1>', '<header>', '<p>'],
        c: 1,
        e: 'Títulos usam <h1> a <h6>.'
      },
      {
        q: 'Qual propriedade CSS define cor de fundo?',
        a: ['color', 'background', 'background-color', 'bg'],
        c: 2,
        e: 'background-color define cor de fundo.'
      },
      {
        q: 'Qual método JS seleciona um elemento pelo id?',
        a: ['getElementById', 'querySelector', 'getElementsByClassName', 'getById'],
        c: 0,
        e: 'getElementById seleciona por id.'
      },
      {
        q: 'Qual tecnologia é usada para versionamento?',
        a: ['Docker', 'Git', 'Node.js', 'MySQL'],
        c: 1,
        e: 'Git é para versionamento.'
      },
      {
        q: 'Qual tag HTML para listas não ordenadas?',
        a: ['<ol>', '<ul>', '<li>', '<dl>'],
        c: 1,
        e: '<ul> é lista não ordenada.'
      },
      {
        q: 'Qual é uma boa prática de JS?',
        a: ['Usar var', 'Evitar funções', 'Usar const/let', 'Ignorar erros'],
        c: 2,
        e: 'Prefira const/let.'
      },
      {
        q: 'Qual banco de dados é relacional?',
        a: ['MongoDB', 'MySQL', 'Redis', 'ElasticSearch'],
        c: 1,
        e: 'MySQL é relacional.'
      },
      {
        q: 'Qual etapa do fluxo é para testes?',
        a: ['Deploy', 'Testes', 'Design', 'Monitoramento'],
        c: 1,
        e: 'Testes validam o sistema.'
      },
      {
        q: 'Qual tecnologia é usada para DevOps?',
        a: ['Jest', 'Docker', 'React', 'Sass'],
        c: 1,
        e: 'Docker é DevOps.'
      },
      {
        q: 'Qual tag HTML para imagens?',
        a: ['<img>', '<image>', '<src>', '<pic>'],
        c: 0,
        e: '<img> insere imagens.'
      }
    ];
    let current = 0, score = 0;
    function renderQuiz() {
      const q = quizData[current];
      document.querySelector('#quiz-q').textContent = q.q;
      document.querySelectorAll('.quiz-a').forEach((btn, i) => {
        btn.textContent = q.a[i];
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
      });
      document.querySelector('#quiz-exp').textContent = '';
    }
    function answerQuiz(i) {
      const q = quizData[current];
      document.querySelectorAll('.quiz-a').forEach((btn, idx) => {
        btn.disabled = true;
        btn.classList.toggle('correct', idx === q.c);
        btn.classList.toggle('wrong', idx === i && idx !== q.c);
      });
      document.querySelector('#quiz-exp').textContent = q.e;
      if (i === q.c) score++;
      setTimeout(() => {
        current++;
        if (current < quizData.length) {
          renderQuiz();
        } else {
          finishQuiz();
        }
      }, 1200);
    }
    function finishQuiz() {
      document.querySelector('#quiz-q').textContent = 'Pontuação final: ' + score + ' de ' + quizData.length;
      document.querySelectorAll('.quiz-a').forEach(btn => btn.style.display = 'none');
      document.querySelector('#quiz-exp').textContent = 'Melhor pontuação: ' + Math.max(score, Number(localStorage.getItem('quizBest') || 0));
      localStorage.setItem('quizBest', Math.max(score, Number(localStorage.getItem('quizBest') || 0)));
    }
    document.querySelectorAll('.quiz-a').forEach((btn, i) => {
      btn.addEventListener('click', () => answerQuiz(i));
    });
    renderQuiz();
  }
})();
