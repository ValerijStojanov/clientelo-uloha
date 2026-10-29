/* Poplatkoměr — kalkulačka, srovnání ETF, formulář a měření celé cesty.
   Měření je first-party a bez cookies: náhodné ID relace žije jen v paměti
   stránky, nic se neukládá do zařízení, proto nepotřebuje souhlas. Události
   jdou na /api/e a zároveň do dataLayer (pro GTM / Meta pixel po souhlasu). */
(function () {
  'use strict';

  var D = window.ETF_DATA;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  // ---------- Měření ----------
  var params = new URLSearchParams(location.search);
  var variant = document.documentElement.dataset.v;
  var sid = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)).replace(/-/g, '').slice(0, 16);
  var t0 = performance.now();
  var queue = [];
  var seen = {};
  var utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
    if (params.get(k)) utm[k] = params.get(k).slice(0, 80);
  });
  var debugEl = params.get('debug') === '1' ? $('#debug') : null;
  if (debugEl) debugEl.hidden = false;
  window.dataLayer = window.dataLayer || [];

  function secs() { return Math.round((performance.now() - t0) / 100) / 10; }

  function track(name, props, once) {
    if (once) { if (seen[name + (once === true ? '' : once)]) return; seen[name + (once === true ? '' : once)] = 1; }
    var ev = { name: name, sid: sid, t: secs(), variant: variant, props: props || {} };
    queue.push(ev);
    window.dataLayer.push(Object.assign({ event: name, variant: variant }, props || {}));
    if (debugEl) debugEl.insertAdjacentHTML('afterbegin', '<div>' + ev.t + 's ' + name + ' ' + JSON.stringify(ev.props) + '</div>');
    if (name === 'lead' && window.fbq) window.fbq('track', 'Lead');
    if (name === 'lead' || name === 'page_exit') flush();
  }

  // ---------- Souhlas s reklamními pixely ----------
  // Pixely (Meta, GTM) jen po souhlasu; volba se pamatuje v localStorage.
  var CFG = window.SITE_CONFIG || {};
  function loadPixels() {
    if (CFG.gtmId) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      var g = document.createElement('script');
      g.async = true; g.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CFG.gtmId);
      document.head.appendChild(g);
    }
    if (CFG.metaPixelId) {
      var q = window.fbq = function () { q.callMethod ? q.callMethod.apply(q, arguments) : q.queue.push(arguments); };
      q.queue = []; q.loaded = true; q.version = '2.0';
      var f = document.createElement('script');
      f.async = true; f.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(f);
      window.fbq('init', CFG.metaPixelId);
      window.fbq('track', 'PageView');
      if (seen.lead) window.fbq('track', 'Lead');
    }
  }
  if (CFG.gtmId || CFG.metaPixelId) {
    var choice = null;
    try { choice = localStorage.getItem('consent'); } catch (e) {}
    if (choice === 'yes') loadPixels();
    else if (choice !== 'no') {
      var bar = $('#consent');
      bar.hidden = false;
      $$('[data-consent]', bar).forEach(function (b) {
        b.addEventListener('click', function () {
          var c = b.dataset.consent;
          try { localStorage.setItem('consent', c); } catch (e) {}
          bar.hidden = true;
          track('consent', { choice: c });
          if (c === 'yes') loadPixels();
        });
      });
    }
  }

  function flush() {
    if (!queue.length) return;
    var body = JSON.stringify({ events: queue.splice(0, queue.length) });
    if (navigator.sendBeacon && navigator.sendBeacon('/api/e', new Blob([body], { type: 'application/json' }))) return;
    fetch('/api/e', { method: 'POST', body: body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(function () {});
  }
  setInterval(flush, 3000);

  track('page_view', {
    utm: utm,
    ref: document.referrer ? new URL(document.referrer).hostname : '',
    w: window.innerWidth,
    lcp_hint: Math.round(performance.now()),
  });
  setTimeout(function () { track('engaged_10s', {}, true); }, 10000);

  var maxScroll = 0;
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? Math.round((window.scrollY / h) * 100) : 100;
    if (pct > maxScroll) {
      maxScroll = pct;
      [25, 50, 75, 100].forEach(function (s) { if (pct >= s) track('scroll_depth', { pct: s }, s); });
    }
  }, { passive: true });

  window.addEventListener('pagehide', function () { track('page_exit', { secs: secs(), max_scroll: maxScroll, lead: !!seen.lead }); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });

  // ---------- Formátování ----------
  var nf = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });
  function czk(n) { return nf.format(Math.round(n / 1000) * 1000) + ' Kč'; }
  function pct(n, d) { return n.toLocaleString('cs-CZ', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }) + ' %'; }
  function usdBn(n) { return n >= 1e9 ? nf.format(Math.round(n / 1e9)) + ' mld. USD' : nf.format(Math.round(n / 1e6)) + ' mil. USD'; }

  $$('[data-asof]').forEach(function (el) { el.textContent = D.asOf; });

  // ---------- Kalkulačka ----------
  var C = D.calc;
  var monthly = $('#monthly');
  var years = 20;

  // Měsíčně: vklad (minus vstupní poplatek) → zhodnocení trhem → strhnutí 1/12 ročního poplatku.
  function grow(m, y, ter, entry) {
    var g = Math.pow(1 + C.returnPct / 100, 1 / 12) - 1;
    var f = ter / 100 / 12;
    var v = 0;
    for (var i = 0; i < y * 12; i++) v = (v + m * (1 - entry / 100)) * (1 + g) * (1 - f);
    return v;
  }

  function renderCalc() {
    var m = Number(monthly.value);
    var bank = grow(m, years, C.bank.ter, C.bank.entry);
    var etf = grow(m, years, C.etf.ter, 0);
    $('#monthlyOut').textContent = nf.format(m) + ' Kč';
    $('#rIn').textContent = czk(m * 12 * years);
    $('#rBank').textContent = czk(bank);
    $('#rEtf').textContent = czk(etf);
    $('#rDiff').textContent = czk(etf - bank);
    $$('[data-years-label]').forEach(function (el) { el.textContent = years + ' let'; });
    $('#echoMonthly').textContent = nf.format(m) + ' Kč';
    monthly.style.setProperty('--fill', ((m - monthly.min) / (monthly.max - monthly.min)) * 100 + '%');
    return { m: m, diff: Math.round(etf - bank) };
  }
  $('#rBankFee').textContent = pct(C.bank.ter) + ' ročně + ' + pct(C.bank.entry, 0) + ' z vkladu';
  $('#rEtfFee').textContent = C.etf.label + ', ' + pct(C.etf.ter) + ' ročně';
  $('#calcBankName').textContent = C.bank.name;
  $('#calcBankTer').textContent = pct(C.bank.ter);
  $('#calcBankEntry').textContent = pct(C.bank.entry, 0);

  var calcTimer;
  var calcTouched = false;
  function onCalc(source) {
    var r = renderCalc();
    if (!calcTouched) { calcTouched = true; track('calc_interact', { via: source }, true); $('.calc-echo').hidden = false; }
    clearTimeout(calcTimer);
    calcTimer = setTimeout(function () { track('calc_change', { monthly: r.m, years: years, diff: r.diff }); }, 800);
  }
  monthly.addEventListener('input', function () { onCalc('slider'); });
  $$('.years button').forEach(function (b) {
    b.addEventListener('click', function () {
      years = Number(b.dataset.years);
      $$('.years button').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
      onCalc('years');
    });
  });
  renderCalc();

  // ---------- Srovnání ETF ----------
  var OPEN = 4;
  var unlocked = false;
  var maxTer = Math.max.apply(null, D.etfs.map(function (e) { return e.ter; }));

  function etfHTML(e, i) {
    var locked = !unlocked && i >= OPEN;
    var high = e.ter >= 0.2;
    var twin = e.twin
      ? '<span class="buy no">Bez KID</span><span>→ dvojče <span class="tw">' + e.twin.ticker + ' ' + pct(e.twin.ter) + '</span></span>'
      : '<span class="buy no">Bez KID</span><span>přesné dvojče neexistuje</span>';
    return '<li class="etf' + (locked ? ' is-locked' : '') + '" data-ticker="' + e.ticker + '"' + (locked ? ' aria-hidden="true"' : '') + '>' +
      '<button class="etf-head" type="button" aria-expanded="false"' + (locked ? ' tabindex="-1"' : '') + '>' +
        '<span class="tk">' + e.ticker + '</span>' +
        '<span class="nm">' + e.name + '</span>' +
        '<span class="fee' + (high ? ' is-high' : '') + '"><b>' + pct(e.ter) + '</b>ročně</span>' +
        '<span class="feebar' + (high ? ' is-high' : '') + '"><i style="width:' + Math.max(1, (e.ter / maxTer) * 100).toFixed(1) + '%"></i></span>' +
      '</button>' +
      '<div class="etf-row2">' + (e.ret10 != null ? '<span class="ret">10 let: ' + (e.ret10 > 0 ? '+' : '−') + pct(Math.abs(e.ret10), 1) + ' ročně</span>' : '<span class="ret">' + e.note + '</span>') + twin + '</div>' +
      '<div class="etf-more" hidden><dl>' +
        '<dt>Správce</dt><dd>' + e.issuer + '</dd>' +
        '<dt>Burza</dt><dd>' + e.exchange + '</dd>' +
        '<dt>Velikost</dt><dd>' + usdBn(e.aum) + '</dd>' +
        (e.divYield != null ? '<dt>Dividenda</dt><dd>' + pct(e.divYield) + ' ročně</dd>' : '') +
        (e.ret5 != null ? '<dt>5 let</dt><dd>' + pct(e.ret5, 1) + ' ročně</dd>' : '') +
        (e.twin ? '<dt>Dvojče</dt><dd>' + e.twin.name + ' · ' + e.twin.isin + ' · ' + e.twin.exchange + '</dd>' : '') +
      '</dl><a href="' + e.source + '" target="_blank" rel="noopener">Zdroj: ' + e.issuer + ', výnosy k ' + e.retAsOf + '</a></div>' +
    '</li>';
  }

  function renderList() {
    $('#etfList').innerHTML = D.etfs.map(etfHTML).join('');
    $('#lockedCount').textContent = String(D.etfs.length - OPEN);
  }
  renderList();

  $('#etfList').addEventListener('click', function (ev) {
    var li = ev.target.closest('.etf');
    if (!li || ev.target.closest('a')) return;
    if (li.classList.contains('is-locked')) {
      track('locked_click', { ticker: li.dataset.ticker });
      $('#odemknout').scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { $('#email').focus({ preventScroll: true }); }, 450);
      return;
    }
    var btn = $('.etf-head', li);
    var more = $('.etf-more', li);
    var open = more.hidden;
    more.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) track('etf_open', { ticker: li.dataset.ticker });
  });

  // ---------- Viditelnost sekcí, lepicí CTA ----------
  var sticky = $('#sticky');
  var heroCtaVisible = true, formVisible = false;
  function updateSticky() {
    var on = !unlocked && !heroCtaVisible && !formVisible;
    sticky.hidden = false;
    sticky.classList.toggle('is-on', on);
  }
  if ('IntersectionObserver' in window) {
    // Sekce může být vyšší než obrazovka, proto „viděl“ = sekce protnula střední pás obrazovky.
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.dataset.section;
        if (en.isIntersecting) track('section_view', { id: id }, id);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    $$('[data-section]').forEach(function (el) { sectionIO.observe(el); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (el.id === 'leadForm') {
          formVisible = en.isIntersecting;
          if (en.isIntersecting) track('form_view', {}, true);
        } else {
          heroCtaVisible = en.isIntersecting;
        }
        updateSticky();
      });
    }, { threshold: 0.5 });
    io.observe($('#leadForm'));
    $$('.btn[data-cta="hero"]').forEach(function (el) { if (el.offsetParent) io.observe(el); });
  }

  $$('[data-cta]').forEach(function (a) {
    a.addEventListener('click', function () {
      track(a.dataset.cta === 'sticky' ? 'sticky_cta' : 'hero_cta', { pos: a.dataset.cta });
      setTimeout(function () { $('#email').focus({ preventScroll: true }); }, 500);
    });
  });

  // ---------- Formulář ----------
  var form = $('#leadForm');
  var email = $('#email');
  var err = $('#err');
  var DOMAINS = ['gmail.com', 'seznam.cz', 'email.cz', 'centrum.cz', 'outlook.com', 'hotmail.com', 'icloud.com', 'post.cz', 'volny.cz', 'atlas.cz', 'yahoo.com', 'tiscali.cz'];

  // Překlepy v doméně (gmial.com, seznam.cy) stojí leady — nabídneme opravu jedním klikem.
  function lev(a, b) {
    var m = [], i, j;
    for (i = 0; i <= b.length; i++) m[i] = [i];
    for (j = 0; j <= a.length; j++) m[0][j] = j;
    for (i = 1; i <= b.length; i++) for (j = 1; j <= a.length; j++)
      m[i][j] = Math.min(m[i - 1][j - 1] + (b[i - 1] === a[j - 1] ? 0 : 1), m[i][j - 1] + 1, m[i - 1][j] + 1);
    return m[b.length][a.length];
  }
  function suggest(v) {
    var at = v.lastIndexOf('@');
    if (at < 1) return null;
    var dom = v.slice(at + 1);
    if (DOMAINS.indexOf(dom) > -1) return null;
    for (var k = 0; k < DOMAINS.length; k++) if (lev(dom, DOMAINS[k]) <= 2) return v.slice(0, at + 1) + DOMAINS[k];
    return null;
  }

  email.addEventListener('focus', function () { track('form_start', {}, true); });

  function showErr(code, text, fix) {
    email.setAttribute('aria-invalid', 'true');
    err.innerHTML = text;
    if (fix) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = fix;
      b.addEventListener('click', function () { email.value = fix; err.textContent = ''; email.removeAttribute('aria-invalid'); track('form_error', { code: 'typo_fixed' }); });
      err.appendChild(b);
      err.appendChild(document.createTextNode('?'));
    }
    track('form_error', { code: code });
  }

  var lastEmail = '';
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = email.value.trim().toLowerCase();
    err.textContent = '';
    email.removeAttribute('aria-invalid');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return showErr('format', 'Zkontrolujte prosím e-mail, něco v něm chybí.');
    var s = suggest(v);
    if (s && !form.dataset.typoAsked) { form.dataset.typoAsked = '1'; return showErr('typo', 'Nemysleli jste ', s); }

    var btn = $('button[type="submit"]', form);
    btn.disabled = true; btn.textContent = 'Odemykám…';
    var nl = $('#newsletter').checked;
    fetch('/api/lead', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: v, newsletter: nl, company: form.company.value, sid: sid, variant: variant, utm: utm, monthly: Number(monthly.value) }),
    }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      lastEmail = v;
      track('lead', { newsletter: nl, monthly: Number(monthly.value), calc: calcTouched });
      if (nl) track('newsletter_optin', {});
      unlock();
    }).catch(function () {
      btn.disabled = false; btn.textContent = 'Odemknout srovnání';
      showErr('network', 'Nepodařilo se odeslat. Zkuste to prosím znovu.');
    });
  });

  function unlock() {
    unlocked = true;
    renderList();
    $('#lockIn').hidden = true;
    var done = $('#done');
    done.hidden = false;
    $('#doneEmail').textContent = lastEmail;
    $('.lock').classList.add('is-open');
    $('.lock').style.marginTop = '0';
    $('.lock').style.paddingTop = '16px';
    updateSticky();
    done.focus({ preventScroll: true });
    done.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function update(extra) {
    return fetch('/api/lead', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Object.assign({ step: 'update', email: lastEmail, sid: sid, variant: variant }, extra)),
    });
  }

  $('#tahakLink').addEventListener('click', function () { track('tahak_open', {}); });

  $$('[data-survey]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-survey]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var a = b.dataset.survey;
      track('post_survey', { answer: a });
      update({ survey: a });
      $('#surveyThanks').hidden = false;
      // Nabídka hovoru jen tomu, komu reálně ušetří: má peníze ve fondu banky.
      if (a === 'banka') { $('#phoneOffer').hidden = false; track('phone_offer_view', {}); }
    });
  });

  $('#phoneForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var p = $('#phone').value.replace(/\s+/g, ' ').trim();
    if (!/^\+?[0-9 ]{9,16}$/.test(p)) { $('#phoneErr').textContent = 'Zadejte telefon ve tvaru +420 777 123 456.'; return; }
    update({ phone: p }).then(function () {
      track('phone_submit', {});
      $('#phoneForm').hidden = true;
      $('#phoneThanks').hidden = false;
    });
  });

  // ---------- FAQ a zdroje ----------
  $$('details[data-faq]').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) track('faq_open', { q: d.dataset.faq }); });
  });
  $('#sourceList').innerHTML = D.sources.map(function (s) {
    return '<li>' + s.label + ': <a href="' + s.url + '" target="_blank" rel="noopener">' + s.url.replace(/^https?:\/\//, '').slice(0, 70) + '</a> (' + s.date + ')</li>';
  }).join('');

  // Hero varianty B ukazuje skutečné poplatky z dat.
  var voo = D.etfs.filter(function (e) { return e.ticker === 'VOO'; })[0];
  if (voo) {
    $$('[data-fee="VOO"]').forEach(function (el) { el.textContent = pct(voo.ter); });
    if (voo.twin) {
      $$('[data-twin-tk="VOO"]').forEach(function (el) { el.textContent = voo.twin.ticker; });
      $$('[data-twin-fee="VOO"]').forEach(function (el) { el.textContent = pct(voo.twin.ter); });
    }
  }
})();
