/* QA isolada no Edge headless: nenhuma dependência para executar o website. */
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

const root = __dirname;
const artifacts = path.join(root, '.qa');
let browser;
let socket;
let sequence = 0;
const pending = new Map();
const pageErrors = [];
const consoleErrors = [];
const failedRequests = [];
const results = [];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function command(method, params = {}) {
  const id = ++sequence;
  const response = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
  });
  socket.send(JSON.stringify({ id, method, params }));
  return response;
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression, limit = 10000) {
  const start = Date.now();
  while (Date.now() - start < limit) {
    if (await evaluate(expression)) return;
    await delay(100);
  }
  throw new Error(`Timeout: ${expression}`);
}
async function screenshot(name) {
  const result = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(path.join(artifacts, name), Buffer.from(result.data, 'base64'));
}
async function check(name, operation) {
  await operation(); results.push({ name, passed: true }); console.log(`PASS ${name}`);
}
async function viewport(width, height) {
  await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await delay(150);
}

(async () => {
  await fs.mkdir(artifacts, { recursive: true });
  const profile = path.join(artifacts, `edge-profile-${Date.now()}`);
  browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { port = Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); if (port) break; } catch {}
    await delay(100);
  }
  if (!port) throw new Error('Edge headless did not start');
  console.log('Edge headless iniciado');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find((item) => item.type === 'page');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  console.log('Sessão de teste conectada');
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const task = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) task.reject(new Error(JSON.stringify(message.error))); else task.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') pageErrors.push(message.params.exceptionDetails);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleErrors.push(message.params.args);
    if (message.method === 'Network.loadingFailed') failedRequests.push(message.params);
  };
  await command('Page.enable'); await command('Runtime.enable'); await command('Network.enable');
  await viewport(1440, 1000);
  await command('Page.navigate', { url: pathToFileURL(path.join(root, 'barbearia-demo', 'index.html')).href });
  await until('document.querySelectorAll(".service-card").length === 6');
  await evaluate('window.__opened=[]; window.open=(...args)=>{window.__opened.push(args); return null;}');
  await evaluate('document.fonts.ready');
  await delay(700);
  await screenshot('desktop-hero.png');

  await check('file:// abre com 6 serviços, 3 planos, 6 profissionais e 6 fotos', async () => {
    assert.deepEqual(await evaluate('[".service-card", ".plan-card", ".team-card", ".gallery-item"].map(s=>document.querySelectorAll(s).length)'), [6, 3, 6, 6]);
  });
  await check('planos substituem Sobre e aparecem uma única vez logo após a faixa', async () => {
    assert.equal(await evaluate('document.querySelectorAll("#clube").length'), 1);
    assert.equal(await evaluate('document.querySelector("#sobre")'), null);
    assert.equal(await evaluate('document.querySelector(".craft-strip").nextElementSibling.id'), 'clube');
    assert.deepEqual(await evaluate('[...document.querySelectorAll("main > section")].map(s=>s.id)'), ['inicio', 'clube', 'servicos', 'equipe', 'galeria', 'unidades', 'agendamento', 'depoimentos', 'faq', '']);
    assert.equal(await evaluate('document.querySelector(".desktop-nav a[href=\\"#clube\\"]").textContent'), 'Planos');
  });
  await check('imagens locais carregam', async () => {
    await evaluate('document.querySelectorAll("img").forEach(i => i.loading = "eager")');
    await until('[...document.images].every(i=>i.complete)');
    assert.deepEqual(await evaluate('[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)'), []);
  });
  await check('unidades: troca e cliques rápidos mantêm imagem, mapa e mensagem WhatsApp corretos', async () => {
    await evaluate('document.querySelector(".hero-actions [data-book]").click()');
    assert.equal(await evaluate('new URL(window.__opened.at(-1)[0]).searchParams.get("text")'), 'Olá, gostaria de agendar na unidade Centro.');
    await evaluate('document.querySelector(".hero-unit[data-unit=jardins]").click();document.querySelector(".hero-unit[data-unit=centro]").click();document.querySelector(".hero-unit[data-unit=jardins]").click()');
    assert.equal(await evaluate('document.querySelector("#hero-image-jardins").classList.contains("is-active")'), true);
    assert.match(await evaluate('document.querySelector("#hero-unit-address").textContent'), /MASP/);
    assert.match(await evaluate('document.querySelector("#map-directions").href'), /MASP/);
    await evaluate('document.querySelector(".hero-actions [data-book]").click()');
    assert.equal(await evaluate('new URL(window.__opened.at(-1)[0]).searchParams.get("text")'), 'Olá, gostaria de agendar na unidade Jardins.');
    assert.equal(await evaluate('document.querySelector("#demo-dialog").open'), false);
    await evaluate('document.querySelector(".header-cta").click()');
    assert.equal(await evaluate('new URL(window.__opened.at(-1)[0]).searchParams.get("text")'), 'Olá, gostaria de agendar.');
  });
  await check('filtros e agendamento do profissional preservam unidade', async () => {
    await evaluate('document.querySelector("[data-filter=centro]").click()');
    assert.equal(await evaluate('document.querySelectorAll(".team-card").length'), 3);
    assert.equal(await evaluate('[...document.querySelectorAll(".team-card [data-book]")].every(b=>b.dataset.bookUnit==="centro")'), true);
    await evaluate('document.querySelector(".team-card [data-book]").click()');
    assert.equal(await evaluate('new URL(window.__opened.at(-1)[0]).searchParams.get("text")'), 'Olá, gostaria de agendar com Rafael Costa na unidade Centro.');
    await evaluate('document.querySelector("[data-filter=jardins]").click()');
    assert.equal(await evaluate('document.querySelectorAll(".team-card").length'), 3);
    await evaluate('document.querySelector("[data-filter=all]").click()');
  });
  await check('FAQ abre, fecha e permite navegação por teclado', async () => {
    await evaluate('document.querySelector("#faq-question-0").click()');
    assert.equal(await evaluate('document.querySelector("#faq-answer-0").hidden'), false);
    await evaluate('document.querySelector("#faq-question-1").click()');
    assert.equal(await evaluate('document.querySelector("#faq-answer-0").hidden'), true);
    await evaluate('document.querySelector("#faq-question-1").focus()');
    await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
    assert.equal(await evaluate('document.activeElement.id'), 'faq-question-2');
  });
  await check('lightbox amplia e navega por setas, fecha restaurando foco', async () => {
    await evaluate('document.querySelector(\'[data-gallery="0"]\').click()');
    assert.equal(await evaluate('document.querySelector("#lightbox").open'), true);
    await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
    assert.equal(await evaluate('document.querySelector("#lightbox-count").textContent'), '2 / 6');
    await evaluate('document.querySelector("#lightbox-prev").click(); document.querySelector("#lightbox").close()');
    await until('document.activeElement.dataset.gallery === "0"');
    assert.equal(await evaluate('document.activeElement.dataset.gallery'), '0');
  });
  await check('todos os agendamentos e planos geram número, mensagem e proteção corretos', async () => {
    const buttons = await evaluate('[...document.querySelectorAll("[data-book], [data-plan]")].filter(b=>!b.closest("#mobile-nav")).map((b,i)=>{b.dataset.qaId=i;return {id:i,service:b.dataset.service,professional:b.dataset.professional,unit:b.dataset.bookUnit||(b.hasAttribute("data-selected-unit")?"jardins":""),plan:b.dataset.plan}})');
    for (const button of buttons) {
      const id = button.id;
      const before = await evaluate('window.__opened.length');
      await evaluate(`document.querySelector('[data-qa-id="${id}"]').click()`);
      assert.equal(await evaluate('window.__opened.length'), before + 1);
      const opened = await evaluate('window.__opened.at(-1)');
      const url = new URL(opened[0]);
      assert.equal(url.origin + url.pathname, 'https://wa.me/5531999999999');
      let expected = button.plan ? `Olá, gostaria de saber mais sobre o Plano ${button.plan}.` : `Olá, gostaria de agendar${button.service ? ' ' + button.service : ''}${button.professional ? ' com ' + button.professional : ''}${button.unit ? ' na unidade ' + (button.unit === 'centro' ? 'Centro' : 'Jardins') : ''}.`;
      assert.equal(url.searchParams.get('text'), expected);
      assert.deepEqual(opened.slice(1), ['_blank', 'noopener,noreferrer']);
      assert.equal(await evaluate('document.querySelector("#demo-dialog").open'), false);
    }
  });
  await check('apps no Hero: links vazios abrem aviso; links configurados dispensam edição HTML', async () => {
    assert.equal(await evaluate('document.querySelectorAll(".hero-apps [data-app]").length'), 2);
    for (const platform of ['ios', 'android']) {
      const before = await evaluate('window.__opened.length');
      await evaluate(`document.querySelector('.hero-apps [data-app="${platform}"]').click()`);
      assert.equal(await evaluate('document.querySelector("#demo-dialog").open'), true);
      assert.match(await evaluate('document.querySelector("#dialog-description").textContent'), /configurados posteriormente/);
      assert.equal(await evaluate('window.__opened.length'), before);
      await screenshot(`app-${platform}-modal.png`);
      await evaluate('document.querySelector("#demo-dialog").close()');
      await delay(20);
    }
    await evaluate('window.BARBER_DATA.config.apps.ios="https://apps.apple.com/"; document.querySelector(".hero-apps [data-app=ios]").click()');
    assert.equal(await evaluate('window.__opened.at(-1)[0]'), 'https://apps.apple.com/');
    await evaluate('window.BARBER_DATA.config.apps.android="https://play.google.com/store/apps"; document.querySelector(".app-copy [data-app=android]").click()');
    assert.equal(await evaluate('window.__opened.at(-1)[0]'), 'https://play.google.com/store/apps');
    const before = await evaluate('window.__opened.length');
    await evaluate('window.BARBER_DATA.config.apps.ios="javascript:alert(1)"; document.querySelector(".hero-apps [data-app=ios]").click()');
    assert.equal(await evaluate('window.__opened.length'), before);
    assert.equal(await evaluate('document.querySelector("#demo-dialog").open'), true);
    await evaluate('document.querySelector("#demo-dialog").close(); window.BARBER_DATA.config.apps.ios=""; window.BARBER_DATA.config.apps.android=""');
    await delay(20);
  });
  await check('contato e redes preservam modais informativos e restauração de foco', async () => {
    const buttons = await evaluate('[...document.querySelectorAll("[data-info]")].map((b,i)=>{b.dataset.qaInfoId=i;return i})');
    for (const id of buttons) {
      await evaluate(`document.querySelector('[data-qa-info-id="${id}"]').click()`);
      assert.equal(await evaluate('document.querySelector("#demo-dialog").open'), true, `CTA ${id}`);
      await evaluate('document.querySelector("#demo-dialog").close()');
      await delay(20);
    }
  });
  await check('larguras 320, 375, 430, 768, 1024, 1440, 1920 sem overflow horizontal', async () => {
    for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
      await viewport(width, 1000);
      const measurement = await evaluate('({client:document.documentElement.clientWidth, scroll:document.documentElement.scrollWidth, offenders:[...document.body.querySelectorAll("*")].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)&&getComputedStyle(e).position!=="absolute"}).map(e=>e.className).slice(0,10)})');
      assert.ok(measurement.scroll <= width, `width ${width}: ${JSON.stringify(measurement)}`);
    }
  });
  await viewport(375, 900);
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await delay(300);
  await screenshot('mobile-hero.png');
  await check('menu mobile, teclado Escape e CTA sem fundo focável', async () => {
    await evaluate('document.querySelector("#menu-toggle").click()');
    assert.equal(await evaluate('document.querySelector("main").inert'), true);
    assert.equal(await evaluate('document.querySelector("#mobile-nav").hidden'), false);
    await screenshot('mobile-menu.png');
    await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    assert.equal(await evaluate('document.querySelector("#mobile-nav").hidden'), true);
    await evaluate('document.querySelector("#menu-toggle").click(); document.querySelector("#mobile-nav [data-book]").click()');
    assert.equal(await evaluate('document.querySelector("main").inert'), false);
    assert.equal(await evaluate('document.querySelector("#mobile-nav").hidden'), true);
    assert.equal(await evaluate('new URL(window.__opened.at(-1)[0]).searchParams.get("text")'), 'Olá, gostaria de agendar.');
    await evaluate('document.querySelector(".hero-apps [data-app=ios]").click()');
    await screenshot('mobile-modal.png');
    await evaluate('document.querySelector("#demo-dialog").close()');
  });
  await check('movimento reduzido: conteúdo visível e animações desativadas', async () => {
    await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    assert.equal(await evaluate('getComputedStyle(document.querySelector("h1")).animationName'), 'none');
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".center-heading")).opacity'), '1');
  });
  await viewport(1440, 1000);
  for (const [id, file] of [['clube', 'desktop-club.png'], ['servicos', 'desktop-services.png'], ['equipe', 'desktop-team.png'], ['galeria', 'desktop-gallery.png'], ['unidades', 'desktop-locations.png'], ['agendamento', 'desktop-app.png'], ['faq', 'desktop-faq.png']]) {
    await evaluate(`document.getElementById('${id}').scrollIntoView({behavior:'instant'})`); await delay(200); await screenshot(file);
  }
  await check('mapa carrega e troca referência, com alternativa externa', async () => {
    await evaluate('document.querySelector("#load-map").click()');
    await until('!document.querySelector("#map-frame").hidden || !document.querySelector("#load-map").disabled', 14000);
    results.push({ name: 'Google Maps estado observado', status: await evaluate('document.querySelector("#map-status").textContent') });
    await delay(700);
    await evaluate('document.getElementById("unidades").scrollIntoView({behavior:"instant"})');
    await screenshot('desktop-map-loaded.png');
    await evaluate('document.querySelector(".location-select[data-unit=centro]").click()');
    assert.match(await evaluate('document.querySelector("#map-frame").src'), /Pra/);
    assert.match(await evaluate('document.querySelector("#map-directions").href'), /Pra/);
    assert.equal(await evaluate('document.querySelector("#map-directions").target'), '_blank');
  });
  await check('âncoras internas e botão voltar ao topo', async () => {
    assert.deepEqual(await evaluate('[...document.querySelectorAll("a[href^=\\"#\\"]")].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)'), []);
    await evaluate('document.querySelector("#back-to-top").click()');
    await until('scrollY === 0');
  });
  const onlineRequests = [...failedRequests];
  await check('offline: mapa mantém alternativa elegante e app local funciona', async () => {
    await command('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    await command('Page.reload', { ignoreCache: true });
    await until('document.querySelectorAll(".service-card").length === 6');
    await evaluate('window.__opened=[]; window.open=(...args)=>{window.__opened.push(args); return null;}');
    await viewport(320, 568);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
    await evaluate('document.querySelector("#load-map").click()');
    await delay(500);
    assert.equal(await evaluate('document.querySelector("#map-placeholder").hidden'), false);
    assert.equal(await evaluate('document.querySelector("#load-map").disabled'), false);
    assert.match(await evaluate('document.querySelector("#map-status").textContent'), /conexão|offline/i);
    await evaluate('document.querySelector(".hero-actions [data-book]").click()');
    assert.equal(await evaluate('window.__opened.length'), 1);
    await evaluate('document.querySelector(".hero-apps [data-app=ios]").click()');
    assert.equal(await evaluate('document.querySelector("#demo-dialog").open'), true);
    await evaluate('document.querySelector("#demo-dialog").close()');
  });
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(consoleErrors, []);
  await fs.writeFile(path.join(artifacts, 'results.json'), JSON.stringify({ results, pageErrors, consoleErrors, failedRequestsOnline: onlineRequests, intentionalOfflineFailures: failedRequests.slice(onlineRequests.length), fonts: await evaluate('[...document.fonts].map(f=>({family:f.family,status:f.status}))') }, null, 2));
  console.log(`PASS sem erros de JavaScript ou console; ${results.filter(r=>r.passed).length} grupos verificados`);
})().catch(async (error) => {
  console.error(error.stack);
  await fs.writeFile(path.join(artifacts, 'failure.json'), JSON.stringify({ error: error.message, results, pageErrors, consoleErrors, failedRequests }, null, 2));
  process.exitCode = 1;
}).finally(async () => {
  if (socket?.readyState === WebSocket.OPEN) { try { await command('Browser.close'); } catch {} socket.close(); }
  if (browser) browser.kill();
});
