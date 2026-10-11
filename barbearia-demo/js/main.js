(() => {
  'use strict';

  const data = window.BARBER_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
  const money = (value) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  const directions = (unit) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(unit.mapQuery)}`;

  let selectedUnit = 'centro';
  let lightboxIndex = 0;
  let dialogOrigin = null;
  let lightboxOrigin = null;
  let mapRequested = false;
  let mapTimer = null;
  let mapVersion = 0;

  function renderServices() {
    $('#services-grid').innerHTML = data.services.map((service) => `
      <article class="service-card reveal ${service.featured ? 'featured' : ''}">
        ${service.featured ? '<span class="service-badge">O RITUAL COMPLETO</span>' : ''}
        <div class="service-top">${icon(service.icon)}<span class="service-duration">${icon('clock')}${escapeHTML(service.duration)}</span></div>
        <h3>${escapeHTML(service.name)}</h3><p>${escapeHTML(service.description)}</p>
        <div class="service-bottom"><span class="service-price"><small>R$</small> ${money(service.price)}</span><button class="text-button" data-book data-service="${escapeHTML(service.name)}" aria-label="Agendar ${escapeHTML(service.name)}">Agendar ${icon('arrow')}</button></div>
      </article>`).join('');
  }

  function renderPlans() {
    $('#plans-grid').innerHTML = data.plans.map((plan) => `
      <article class="plan-card reveal ${plan.featured ? 'featured' : ''}">
        ${plan.featured ? '<span class="plan-badge">MAIS POPULAR</span>' : ''}${icon('spark')}
        <h3>${escapeHTML(plan.name)}</h3><p class="plan-tagline">${escapeHTML(plan.tagline)}</p>
        <p class="plan-price"><small>R$</small><strong>${money(plan.price)}</strong><span>/mês</span></p>
        <ul>${plan.benefits.map((benefit) => `<li>${icon('check')}${escapeHTML(benefit)}</li>`).join('')}</ul>
        <button class="button ${plan.featured ? 'button-gold' : 'button-outline'}" data-plan="${escapeHTML(plan.name)}" aria-label="Quero o Plano ${escapeHTML(plan.name)} — conversar pelo WhatsApp em nova aba">Quero este plano ${icon('arrow')}</button>
      </article>`).join('');
  }

  function renderTeam(filter = 'all') {
    const professionals = data.team.filter((person) => filter === 'all' || person.unit === filter);
    $('#team-grid').innerHTML = professionals.map((person) => `
      <article class="team-card">
        <div class="team-image"><img src="${person.image}" alt="Retrato de banco de imagens para o perfil fictício de ${escapeHTML(person.name)}" width="700" height="900" loading="lazy"><span class="team-unit">Unidade ${escapeHTML(data.units[person.unit].name)}</span></div>
        <div class="team-info"><div><h3>${escapeHTML(person.name)}</h3><p>${escapeHTML(person.specialty)}</p></div><button class="text-button" data-book data-book-unit="${person.unit}" data-professional="${escapeHTML(person.name)}" aria-label="Agendar com ${escapeHTML(person.name)} na unidade ${escapeHTML(data.units[person.unit].name)} pelo WhatsApp em nova aba">Agendar ${icon('arrow')}</button></div>
      </article>`).join('');
    $('#team-status').textContent = `${professionals.length} profissionais demonstrativos exibidos${filter === 'all' ? ' em todas as unidades.' : ` na unidade ${data.units[filter].name}.`}`;
    $$('[data-filter]').forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderGallery() {
    $('#gallery-grid').innerHTML = data.gallery.map((photo, index) => `
      <button class="gallery-item reveal" data-gallery="${index}" aria-label="Ampliar: ${escapeHTML(photo.title)}">
        <img src="${photo.image}" alt="${escapeHTML(photo.title)} — ${escapeHTML(photo.subtitle)}" width="1000" height="800" loading="lazy">
        <span class="gallery-caption"><span>${escapeHTML(photo.title)}</span>${icon('plus')}</span>
      </button>`).join('');
  }

  function renderLocations() {
    $('#location-cards').innerHTML = Object.entries(data.units).map(([key, unit]) => `
      <article class="location-card reveal" data-location-card="${key}">
        <img src="${unit.image}" alt="Ambiente de inspiração para a unidade fictícia ${escapeHTML(unit.name)}" width="300" height="450" loading="lazy">
        <div class="location-card-content"><button class="location-select" data-unit="${key}" aria-pressed="${key === selectedUnit}" aria-label="Selecionar unidade ${escapeHTML(unit.name)} no mapa"><span>${unit.number}</span><strong>UNIDADE ${escapeHTML(unit.name).toUpperCase()}</strong><span class="unit-indicator" aria-hidden="true"></span></button>
          <p class="location-detail">${icon('pin')}<span>${escapeHTML(unit.address)}</span></p>
          <p class="location-detail">${icon('clock')}<span>${escapeHTML(unit.hours)} · ilustrativo</span></p>
          <p class="location-detail">${icon('phone')}<span>${escapeHTML(unit.phone)} · telefone ilustrativo</span></p>
          <div class="location-actions"><button class="button button-gold" data-book data-book-unit="${key}">Agendar ${icon('arrow')}<span class="sr-only">na unidade ${escapeHTML(unit.name)}</span></button><a class="text-button" href="${directions(unit)}" target="_blank" rel="noopener noreferrer">Como chegar ${icon('arrow')}<span class="sr-only"> à referência pública ${escapeHTML(unit.reference)}, em nova aba</span></a></div>
        </div>
      </article>`).join('');
  }

  function renderTestimonials() {
    $('#testimonials-grid').innerHTML = data.testimonials.map((testimonial) => `
      <article class="testimonial-card reveal"><div class="testimonial-top"><span class="stars" aria-label="Cinco estrelas ilustrativas">${icon('star').repeat(5)}</span><span class="quote-symbol" aria-hidden="true">“</span></div><blockquote>${escapeHTML(testimonial.text)}</blockquote><div class="testimonial-name"><span class="testimonial-avatar" aria-hidden="true">${escapeHTML(testimonial.name.slice(0, 1))}</span><div><strong>${escapeHTML(testimonial.name)}</strong><small>Depoimento fictício · exemplo de layout</small></div></div></article>`).join('');
  }

  function renderFAQ() {
    $('#faq-list').innerHTML = data.faq.map((item, index) => `
      <div class="faq-item"><h3><button class="faq-question" id="faq-question-${index}" aria-expanded="false" aria-controls="faq-answer-${index}">${escapeHTML(item.question)}${icon('plus')}</button></h3><div class="faq-answer" id="faq-answer-${index}" role="region" aria-labelledby="faq-question-${index}" hidden><p>${escapeHTML(item.answer)}</p></div></div>`).join('');
  }

  // A seleção acompanha o hero, o mockup e o mapa. CTAs gerais usam mensagem sem unidade.
  function selectUnit(key, animate = true) {
    if (!data.units[key]) return;
    const changed = selectedUnit !== key;
    selectedUnit = key;
    const unit = data.units[key];
    $$('[data-unit]').forEach((button) => {
      const active = button.dataset.unit === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $$('[data-location-card]').forEach((card) => card.classList.toggle('is-active', card.dataset.locationCard === key));
    Object.keys(data.units).forEach((unitKey) => $(`#hero-image-${unitKey}`).classList.toggle('is-active', unitKey === key));
    $('#hero-unit-description').textContent = unit.description;
    $('#hero-unit-address').textContent = unit.address;
    const details = $('#hero-unit-details');
    details.classList.remove('is-changing');
    if (animate && changed) { void details.offsetWidth; details.classList.add('is-changing'); }
    $('#phone-unit-name').textContent = unit.name;
    $('#map-title').textContent = unit.reference;
    $('#map-directions').href = directions(unit);
    $('#map-frame').title = `Mapa demonstrativo — referência pública ${unit.reference}`;
    $$('[data-book]').forEach((button) => {
      const unitKey = button.dataset.bookUnit || (button.hasAttribute('data-selected-unit') ? selectedUnit : '');
      const service = button.dataset.service ? ` ${button.dataset.service}` : ' horário';
      const professional = button.dataset.professional ? ` com ${button.dataset.professional}` : '';
      const location = unitKey ? ` na unidade ${data.units[unitKey].name}` : '';
      button.setAttribute('aria-label', `Agendar${service}${professional}${location} pelo WhatsApp em nova aba`);
    });
    if (mapRequested && changed) loadMap();
  }

  function mapFallback(message) {
    clearTimeout(mapTimer);
    $('#map-frame').hidden = true;
    $('#map-placeholder').hidden = false;
    $('#load-map').disabled = false;
    $('#load-map').innerHTML = `Tentar carregar mapa ${icon('arrow')}`;
    $('#map-status').textContent = message;
  }

  function loadMap() {
    mapRequested = true;
    const frame = $('#map-frame');
    if (!navigator.onLine) {
      mapVersion++;
      frame.onload = null;
      frame.onerror = null;
      frame.removeAttribute('src');
      mapFallback('Você está sem conexão. Tente carregar o mapa novamente quando estiver online.');
      return;
    }
    const version = ++mapVersion;
    const unit = data.units[selectedUnit];
    clearTimeout(mapTimer);
    $('#load-map').disabled = true;
    $('#load-map').textContent = 'Carregando mapa…';
    $('#map-status').textContent = `Carregando a referência pública ${unit.reference}…`;
    $('#map-placeholder').hidden = false;
    frame.hidden = true;
    frame.onload = () => {
      if (version !== mapVersion) return;
      clearTimeout(mapTimer);
      frame.hidden = false;
      $('#map-placeholder').hidden = true;
      $('#load-map').disabled = false;
      $('#map-status').textContent = 'Se o mapa não aparecer, use “Como chegar” para abrir o Google Maps.';
    };
    frame.onerror = () => { if (version === mapVersion) mapFallback('O mapa não carregou. Tente novamente ou use “Como chegar”.'); };
    frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(unit.mapQuery)}&z=15&output=embed`;
    mapTimer = setTimeout(() => {
      if (version === mapVersion) {
        // Invalida o carregamento atrasado; o visitante pode tentar novamente.
        mapVersion++;
        frame.onload = null;
        frame.onerror = null;
        frame.removeAttribute('src');
        mapFallback('O mapa está indisponível. Use “Como chegar” ou tente novamente.');
      }
    }, 10000);
  }

  function setMenu(open, restoreFocus = true) {
    const toggle = $('#menu-toggle');
    $('#mobile-nav').hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('#header').classList.toggle('menu-open', open);
    $('main').inert = open;
    $('.footer').inert = open;
    $('#back-to-top').inert = open;
    document.body.classList.toggle('overlay-open', open);
    if (open) $('#mobile-nav a').focus();
    else if (restoreFocus) toggle.focus();
  }

  function openDialog({ title, description, note, context = [] }, origin) {
    const menuWasOpen = !$('#mobile-nav').hidden;
    if (menuWasOpen) setMenu(false, false);
    dialogOrigin = menuWasOpen ? $('#menu-toggle') : (origin || document.activeElement);
    $('#dialog-title').textContent = title;
    $('#dialog-description').textContent = description;
    $('#dialog-note').textContent = note;
    $('#dialog-context').innerHTML = context.map((item) => `<span>${escapeHTML(item)}</span>`).join('');
    $('#dialog-context').hidden = !context.length;
    document.body.classList.add('overlay-open');
    $('#demo-dialog').showModal();
    $('.dialog-done').focus();
  }

  function criarLinkWhatsApp(unidade = '', { servico = '', barbeiro = '', plano = '' } = {}) {
    let mensagem;
    if (plano) mensagem = `Olá, gostaria de saber mais sobre o Plano ${plano}.`;
    else {
      mensagem = 'Olá, gostaria de agendar';
      if (servico) mensagem += ` ${servico}`;
      if (barbeiro) mensagem += ` com ${barbeiro}`;
      if (unidade) mensagem += ` na unidade ${unidade}`;
      mensagem += '.';
    }
    return `https://wa.me/${data.config.whatsapp}?text=${encodeURIComponent(mensagem)}`;
  }

  function agendarWhatsApp(unidade = '', detalhes = {}) {
    window.open(criarLinkWhatsApp(unidade, detalhes), '_blank', 'noopener,noreferrer');
  }
  // Disponível também para futuras ações personalizadas; a configuração vive apenas em data.js.
  window.agendarWhatsApp = agendarWhatsApp;

  function book(button) {
    const key = button.dataset.bookUnit || (button.hasAttribute('data-selected-unit') ? selectedUnit : '');
    if (!$('#mobile-nav').hidden) setMenu(false);
    agendarWhatsApp(key ? data.units[key].name : '', { servico: button.dataset.service, barbeiro: button.dataset.professional });
  }

  function openApp(platform, origin) {
    const configuredLink = data.config.apps[platform];
    if (configuredLink) {
      try {
        const url = new URL(configuredLink);
        if (url.protocol === 'https:') {
          window.open(url.href, '_blank', 'noopener,noreferrer');
          return;
        }
      } catch { /* Um link incompleto mantém a experiência de preparação. */ }
    }
    openDialog({ title: 'Seu app. Em preparação.', context: [platform === 'ios' ? 'App Store' : 'Google Play'],
      description: 'Os links dos aplicativos serão configurados posteriormente.',
      note: 'Esta funcionalidade estará disponível na versão oficial. Não há link de download configurado para este aplicativo.'
    }, origin);
  }

  function showInfo(type, origin) {
    const messages = {
      contact: { title: 'Uma boa conversa começa aqui.', description: 'Na versão oficial, este espaço poderá conectar você aos canais de atendimento da barbearia.', note: 'O telefone (11) 0000-0000 e o e-mail contato@barberhouse.example são ilustrativos e não recebem contatos.' },
      social: { title: 'A casa também nas redes.', description: 'Esta funcionalidade estará disponível na versão oficial.', note: 'Os perfis sociais são demonstrativos. Não há um perfil oficial vinculado a este projeto.' }
    };
    if (messages[type]) openDialog(messages[type], origin);
  }

  function showLightbox(index, origin) {
    lightboxIndex = (index + data.gallery.length) % data.gallery.length;
    const photo = data.gallery[lightboxIndex];
    $('#lightbox-image').src = photo.image;
    $('#lightbox-image').alt = `${photo.title} — ${photo.subtitle}`;
    $('#lightbox-title').textContent = photo.title;
    $('#lightbox-subtitle').textContent = photo.subtitle;
    $('#lightbox-count').textContent = `${lightboxIndex + 1} / ${data.gallery.length}`;
    if (!$('#lightbox').open) {
      lightboxOrigin = origin || document.activeElement;
      document.body.classList.add('overlay-open');
      $('#lightbox').showModal();
      $('[data-close-lightbox]').focus();
    }
  }

  renderServices(); renderPlans(); renderTeam(); renderGallery(); renderLocations(); renderTestimonials(); renderFAQ();
  selectUnit(selectedUnit, false);
  $('#year').textContent = new Intl.DateTimeFormat('pt-BR', { year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(new Date());

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button, a');
    if (!button || button.disabled) return;
    if (button.matches('[data-book]')) book(button);
    else if (button.matches('[data-unit]')) selectUnit(button.dataset.unit);
    else if (button.matches('[data-footer-unit]')) selectUnit(button.dataset.footerUnit);
    else if (button.matches('[data-filter]')) renderTeam(button.dataset.filter);
    else if (button.matches('[data-gallery]')) showLightbox(Number(button.dataset.gallery), button);
    else if (button.matches('[data-info]')) showInfo(button.dataset.info, button);
    else if (button.matches('[data-app]')) openApp(button.dataset.app, button);
    else if (button.matches('[data-plan]')) agendarWhatsApp('', { plano: button.dataset.plan });
    else if (button.matches('[data-close-dialog]')) $('#demo-dialog').close();
    else if (button.matches('[data-close-lightbox]')) $('#lightbox').close();
    else if (button.matches('.faq-question')) {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      $$('.faq-question').forEach((question) => {
        const expanded = question === button && opening;
        question.setAttribute('aria-expanded', String(expanded));
        document.getElementById(question.getAttribute('aria-controls')).hidden = !expanded;
      });
    }
    if (button.matches('#mobile-nav a')) setMenu(false, false);
  });

  $('#menu-toggle').addEventListener('click', () => setMenu($('#mobile-nav').hidden));
  $('#load-map').addEventListener('click', loadMap);
  window.addEventListener('offline', () => { if (mapRequested) loadMap(); });
  window.addEventListener('online', () => {
    if (mapRequested && $('#map-frame').hidden) $('#map-status').textContent = 'Conexão restabelecida. Clique para carregar o mapa novamente.';
  });
  $('#lightbox-prev').addEventListener('click', () => showLightbox(lightboxIndex - 1));
  $('#lightbox-next').addEventListener('click', () => showLightbox(lightboxIndex + 1));
  $('#back-to-top').addEventListener('click', () => { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); $('.brand').focus({ preventScroll: true }); });

  [['demo-dialog', () => dialogOrigin], ['lightbox', () => lightboxOrigin]].forEach(([id, origin]) => {
    const dialog = document.getElementById(id);
    dialog.addEventListener('close', () => {
      document.body.classList.remove('overlay-open');
      const element = origin();
      if (element?.isConnected) element.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !$('#mobile-nav').hidden) setMenu(false);
    if ($('#lightbox').open && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault(); showLightbox(lightboxIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
    const faqButton = event.target.closest('.faq-question');
    const groupButton = event.target.closest('[data-filter], .hero-unit');
    if ((faqButton || groupButton) && ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      const buttons = faqButton ? $$('.faq-question') : $$('button', groupButton.parentElement);
      const current = buttons.indexOf(event.target);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
      event.preventDefault(); buttons[next].focus();
    }
  });

  const wideScreen = matchMedia('(min-width: 1024px)');
  wideScreen.addEventListener('change', (event) => { if (event.matches && !$('#mobile-nav').hidden) setMenu(false, false); });

  function updateScroll() {
    $('#header').classList.toggle('is-scrolled', scrollY > 35);
    $('#back-to-top').hidden = scrollY < 650;
  }
  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(() => { updateScroll(); scrollPending = false; });
    }
  }, { passive: true });
  updateScroll();

  if ('IntersectionObserver' in window) {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!reducedMotion.matches) {
      document.documentElement.classList.add('motion-ready');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
      }, { threshold: .08 });
      $$('.reveal').forEach((element) => observer.observe(element));
      reducedMotion.addEventListener('change', (event) => { if (event.matches) document.documentElement.classList.remove('motion-ready'); });
    }
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) $$('.desktop-nav a').forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    ['inicio', 'clube', 'servicos', 'equipe', 'unidades', 'contato'].forEach((id) => navObserver.observe(document.getElementById(id)));
  }
})();
