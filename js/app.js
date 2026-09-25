/* Renders the portfolio from window.PORTFOLIO (js/data.js) and wires up interactions. */
(function () {
  'use strict';

  var D = window.PORTFOLIO;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, D);
  }
  function mount(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }
  function chips(items, cls) {
    return items.map(function (t) { return '<li class="' + (cls || 'chip') + '">' + esc(t) + '</li>'; }).join('');
  }
  function store(kind, action, key, value) {
    try {
      var s = kind === 'session' ? sessionStorage : localStorage;
      if (action === 'get') return s.getItem(key);
      s.setItem(key, value);
    } catch (e) { return null; }
  }
  function focusables(root) {
    return $all('a[href], button:not([disabled]), input:not([type="hidden"]):not(.hp), textarea, [tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  // ---------- social links ----------
  var socialDefs = [
    { key: 'github', label: 'GitHub', icon: 'github' },
    { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
    { key: 'email', label: 'Email', icon: 'mail' }
  ];

  // Links that are not set yet (null in data.js) are left out rather than shown as placeholders
  function socialButtons() {
    return socialDefs.map(function (s) {
      var url = D.social[s.key];
      if (!url) return '';
      var ext = /^https?:/.test(url);
      return '<a class="icon-btn" href="' + esc(url) + '" aria-label="' + s.label + '" title="' + s.label + '"' +
        (ext ? ' target="_blank" rel="noopener"' : '') + '>' + icon(s.icon) + '</a>';
    }).join('');
  }

  // ---------- render ----------
  function renderBindings() {
    $all('[data-bind]').forEach(function (el) { el.textContent = get(el.getAttribute('data-bind')) || ''; });
    $all('[data-bind-href]').forEach(function (el) { el.setAttribute('href', get(el.getAttribute('data-bind-href')) || '#'); });
    $all('[data-icon]').forEach(function (el) { el.outerHTML = icon(el.getAttribute('data-icon')); });
    $all('[data-cv-download]').forEach(function (el) {
      el.setAttribute('href', D.profile.cvPdf);
      el.setAttribute('download', D.profile.cvPdfName);
      el.setAttribute('type', 'application/pdf');
    });
    ['cv-page-link', 'cvv-print'].forEach(function (id) {
      var a = document.getElementById(id);
      if (a) a.setAttribute('href', D.profile.cvPage);
    });
  }

  function renderNav() {
    function links(filter) {
      return D.nav.filter(filter).map(function (n) {
        return '<li><a href="#' + n.id + '" data-nav="' + n.id + '">' + esc(n.label) + '</a></li>';
      }).join('');
    }
    mount('nav-links', links(function (n) { return !n.mobile; }));
    mount('mobile-links', links(function () { return true; }));
    mount('footer-links', links(function (n) { return n.id !== 'home'; }));
    mount('header-social', socialButtons());
    mount('mobile-social', socialButtons());
    mount('footer-social', socialButtons());
  }

  function renderHero() {
    var p = D.profile;
    var avatar = document.getElementById('hero-avatar');
    if (avatar) avatar.src = p.avatar || p.headshot || p.photo;
    mount('hero-roles', p.roles.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join(''));
    mount('footer-roles', p.roles.map(function (r) { return '<span>' + esc(r) + '</span>'; }).join(''));
    var headline = $('.hero-headline');
    if (headline) {
      var h = esc(p.headline);
      if (p.headlineHighlight) h = h.replace(esc(p.headlineHighlight), '<span class="hl">' + esc(p.headlineHighlight) + '</span>');
      headline.innerHTML = h;
    }
    mount('hero-meta',
      '<li>' + icon('pin') + esc(p.location) + '</li>' +
      '<li><a href="' + esc(D.social.email) + '">' + icon('mail') + esc(p.email) + '</a></li>' +
      (p.phone ? '<li><a href="tel:' + esc(p.phone.replace(/\s+/g, '')) + '">' + icon('phone') + esc(p.phone) + '</a></li>' : ''));
  }

  // Hero profile card — a quick, recruiter-friendly summary built from the same data as the CV
  function renderHeroCard() {
    var p = D.profile, e = D.education[0], x = D.experience[0], l = D.leadership[0];
    function fact(ic, label, title, meta) {
      return '<li class="hc-fact"><span class="card-icon">' + icon(ic) + '</span><div><span class="hc-label">' + esc(label) + '</span>' +
        '<strong>' + esc(title) + '</strong><span class="hc-meta">' + esc(meta) + '</span></div></li>';
    }
    var contact = '<a class="icon-btn" href="' + esc(D.social.email) + '" aria-label="Email" title="Email">' + icon('mail') + '</a>' +
      (p.phone ? '<a class="icon-btn" href="tel:' + esc(p.phone.replace(/\s+/g, '')) + '" aria-label="Call ' + esc(p.phone) + '" title="' + esc(p.phone) + '">' + icon('phone') + '</a>' : '') +
      (D.social.github ? '<a class="icon-btn" href="' + esc(D.social.github) + '" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">' + icon('github') + '</a>' : '');
    mount('hero-card',
      '<div class="hc-top">' +
      '<div><p class="hc-name">' + esc(p.fullName) + '</p><p class="hc-role">' + esc(p.roles[0]) + '</p>' +
      '<p class="hc-loc">' + icon('pin') + esc(p.location) + '</p></div></div>' +
      '<ul class="hc-facts">' +
      fact('graduation', 'Education', e.degree.replace('Bachelor of Science in', 'BSc'), e.institution.replace(/\s*\(.*\)$/, '') + ' · ' + e.period) +
      fact('briefcase', 'Experience', x.role.split(' / ')[0], x.organization.replace(/^.*\((\w+)\)$/, '$1') + ' · ' + x.period) +
      fact('users', 'Leadership', l.role, l.organization.split(' — ')[0] + ' · ' + l.period) +
      '</ul>' +
      '<div class="hc-stack"><p class="label">Core stack</p><ul class="chip-list">' + chips(p.coreStack || [], 'chip') + '</ul></div>' +
      '<div class="hc-actions"><a class="btn btn-outline btn-sm" data-cv-download href="#">' + icon('download') + 'Download CV</a>' +
      '<div class="hc-links">' + contact + '</div></div>');
  }

  function renderAbout() {
    var a = D.about;
    var img = document.getElementById('about-photo');
    if (img) img.src = D.profile.photo;
    mount('about-text', a.paragraphs.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''));
    mount('about-focus', chips(a.focus, 'chip chip-soft'));
    mount('about-stats', a.stats.map(function (s) {
      return '<li><strong>' + esc(s.value) + '</strong><span>' + esc(s.label) + '</span></li>';
    }).join(''));
  }

  function renderSkills() {
    mount('skills-grid', D.skills.map(function (g, i) {
      return '<article class="skill-card reveal" style="--d:' + (i % 4) + '">' +
        '<div class="card-top"><span class="card-icon">' + icon(g.icon) + '</span></div>' +
        '<h3>' + esc(g.title) + '</h3>' +
        '<ul class="chip-list">' + chips(g.items, 'chip skill-chip') + '</ul></article>';
    }).join(''));
  }

  function renderExperience() {
    mount('experience-list', D.experience.map(function (x) {
      return '<li class="timeline-item reveal">' +
        '<span class="timeline-dot" aria-hidden="true">' + icon('briefcase') + '</span>' +
        '<article class="card timeline-card">' +
        '<div class="tl-head"><div><h3>' + esc(x.role) + '</h3>' +
        '<p class="org">' + esc(x.organization) + '</p>' +
        (x.department ? '<p class="muted">Department: ' + esc(x.department) + '</p>' : '') + '</div>' +
        '<span class="period">' + icon('calendar') + esc(x.period) + '</span></div>' +
        '<h4 class="label">Responsibilities &amp; practical work</h4>' +
        '<ul class="check-list cols-2">' + x.points.map(function (p) { return '<li>' + icon('check') + '<span>' + esc(p) + '</span></li>'; }).join('') + '</ul>' +
        '<div class="tl-foot">' +
        (x.supervisors && x.supervisors.length ? '<dl class="supervisors">' + x.supervisors.map(function (s) {
          return '<div><dt>' + esc(s.label) + '</dt><dd>' + esc(s.name) + '</dd></div>';
        }).join('') + '</dl>' : '') +
        '<ul class="chip-list">' + chips(x.tags, 'chip chip-soft') + '</ul>' +
        '</div></article></li>';
    }).join(''));
  }

  // Illustrated previews used until a real screenshot is provided in data.js
  var previews = {
    dashboard:
      '<div class="pv pv-dash"><div class="pv-side"><i></i><i class="on"></i><i></i><i></i><i></i></div>' +
      '<div class="pv-main"><div class="pv-kpis"><b><em></em><small>Open</small></b><b><em></em><small>Resolved</small></b><b><em></em><small>Escalated</small></b></div>' +
      '<div class="pv-bars"><span style="--h:40%"></span><span style="--h:65%"></span><span style="--h:52%"></span><span style="--h:80%"></span><span style="--h:60%"></span><span style="--h:92%"></span><span style="--h:70%"></span></div>' +
      '<div class="pv-rows"><p><i></i><s class="ok">Resolved</s></p><p><i></i><s class="warn">Escalated</s></p><p><i></i><s class="info">Assigned</s></p>' +
      '<p><i></i><s class="ok">Resolved</s></p><p><i></i><s class="info">Assigned</s></p><p><i></i><s class="ok">Resolved</s></p><p><i></i><s class="warn">Escalated</s></p></div></div></div>',
    records:
      '<div class="pv pv-rec"><div class="pv-tb"><i></i><span class="pv-lock">' + icon('lock') + 'QA · read-only</span></div>' +
      '<div class="pv-table"><p class="th"><i></i><i></i><i></i><i></i></p>' +
      '<p><i></i><i></i><i></i><s class="ok">Active</s></p><p><i></i><i></i><i></i><s class="ok">Active</s></p>' +
      '<p><i></i><i></i><i></i><s class="info">Deferred</s></p><p><i></i><i></i><i></i><s class="ok">Active</s></p></div>' +
      '<div class="pv-tree"><span>College</span><span>School</span><span>Department</span></div></div>',
    prediction:
      '<div class="pv pv-pred"><div class="pv-tb"><i></i><span class="pv-pill">Estimate</span></div>' +
      '<svg class="pv-chart" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">' +
      '<polyline points="0,70 25,62 50,64 75,50 100,46 125,38" fill="none" stroke="#5b93ff" stroke-width="2.5"/>' +
      '<polyline points="125,38 150,30 175,24 200,14" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-dasharray="5 4"/>' +
      '<circle cx="200" cy="14" r="4" fill="#2dd4bf"/></svg>' +
      '<div class="pv-form"><p><i></i><b></b></p><p><i></i><b></b></p><p><i></i><b class="go"></b></p></div></div>',
    rental:
      '<div class="pv pv-rent"><div class="pv-tb"><i></i><span class="pv-pill">Houses</span></div>' +
      '<div class="pv-units"><p><i></i><s class="ok">Occupied</s></p><p><i></i><s class="info">Vacant</s></p>' +
      '<p><i></i><s class="ok">Occupied</s></p><p><i></i><s class="warn">Due</s></p><p><i></i><s class="ok">Occupied</s></p><p><i></i><s class="info">Vacant</s></p></div></div>',
    kanban:
      '<div class="pv pv-kan"><div class="pv-col"><h6>Requirements</h6><i></i><i></i><i class="s"></i></div>' +
      '<div class="pv-col"><h6>Design</h6><i class="hl"></i><i></i></div>' +
      '<div class="pv-col"><h6>Development</h6><i></i><i class="s"></i><i></i></div></div>'
  };

  function projectMedia(p) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="Screenshot of ' + esc(p.title) + '" loading="lazy" decoding="async">';
    return (previews[p.preview] || previews.dashboard) + '<span class="pv-note">Illustrative preview</span>';
  }

  function statusBadge(p) {
    return p.status ? '<span class="status-badge">' + icon('check') + esc(p.status) + '</span>' : '';
  }

  function linkButtons(p, compact) {
    var sz = compact ? ' btn-sm' : '';
    var gh = p.github
      ? '<a class="btn btn-outline' + sz + '" href="' + esc(p.github) + '" target="_blank" rel="noopener">' + icon('github') + 'GitHub</a>'
      : '';
    var live = p.live
      ? '<a class="btn btn-outline' + sz + '" href="' + esc(p.live) + '" target="_blank" rel="noopener">' + icon('external') + 'Live demo</a>'
      : '';
    return gh + live;
  }

  function renderProjects() {
    mount('projects-grid', D.projects.map(function (p, i) {
      var featured = i === 0;
      var shown = p.features.slice(0, featured ? 8 : 5);
      var more = p.features.length - shown.length;
      return '<article class="project-card reveal' + (featured ? ' featured' : '') + '" style="--d:' + i + '">' +
        '<button class="project-media" type="button" data-project="' + esc(p.id) + '" aria-label="View details for ' + esc(p.title) + '">' + projectMedia(p) + '</button>' +
        '<div class="project-body">' +
        '<div class="project-meta"><p class="project-cat">' + esc(p.category) + '</p>' + statusBadge(p) + '</div>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="project-sum">' + esc(p.summary) + '</p>' +
        '<ul class="chip-list" aria-label="Skills and technologies">' + chips(p.tech, 'chip chip-tech') + '</ul>' +
        '<div class="project-feats"><p>' + esc(p.featuresLabel || 'Main features') + '</p><ul>' +
        shown.map(function (f) { return '<li>' + icon('check') + '<span>' + esc(f) + '</span></li>'; }).join('') +
        (more > 0 ? '<li class="more">+' + more + ' more</li>' : '') + '</ul></div>' +
        '<div class="project-actions"><button class="btn btn-primary btn-sm" type="button" data-project="' + esc(p.id) + '">' + icon('eye') + 'View Project</button>' +
        linkButtons(p, true) + '</div>' +
        '</div></article>';
    }).join(''));
  }

  function renderEducation() {
    mount('education-list', D.education.map(function (e) {
      return '<article class="card edu-card reveal">' +
        '<div class="edu-head"><span class="card-icon lg">' + icon('graduation') + '</span>' +
        '<div><h3>' + esc(e.degree) + '</h3><p class="org">' + esc(e.institution) + '</p>' +
        (e.note ? '<p class="muted">' + esc(e.note) + '</p>' : '') + '</div>' +
        '<span class="period">' + icon('calendar') + esc(e.period) + '</span></div>' +
        '<h4 class="label">Relevant coursework</h4>' +
        '<ul class="course-grid">' + e.courses.map(function (c) { return '<li>' + icon('file') + '<span>' + esc(c) + '</span></li>'; }).join('') + '</ul>' +
        '</article>';
    }).join(''));
  }

  function renderLeadership() {
    mount('leadership-list', D.leadership.map(function (l) {
      return '<article class="card lead-card reveal">' +
        '<div class="lead-side">' +
        '<span class="card-icon lg">' + icon('users') + '</span>' +
        '<h3>' + esc(l.role) + '</h3>' +
        '<p class="org">' + esc(l.organization) + '</p>' +
        '<p class="muted">' + esc(l.institution) + '</p>' +
        '<span class="period">' + icon('calendar') + esc(l.period) + '</span>' +
        '</div>' +
        '<div class="lead-main"><h4 class="label">Responsibilities</h4>' +
        '<ul class="check-list cols-2">' + l.points.map(function (p) { return '<li>' + icon('check') + '<span>' + esc(p) + '</span></li>'; }).join('') + '</ul>' +
        '<div class="impact"><span class="impact-icon">' + icon('target') + '</span><div><h4 class="label">Role &amp; contribution</h4><p>' + esc(l.impact) + '</p></div></div>' +
        '</div></article>';
    }).join(''));
  }

  function renderInterests() {
    mount('interests-grid', D.interests.map(function (x, i) {
      return '<li class="interest reveal" style="--d:' + (i % 4) + '"><span class="card-icon">' + icon(x.icon) + '</span><span>' + esc(x.title) + '</span></li>';
    }).join(''));
  }

  function renderServices() {
    mount('services-grid', D.services.map(function (s, i) {
      return '<article class="service-card reveal" style="--d:' + (i % 4) + '">' +
        '<span class="card-icon">' + icon(s.icon) + '</span>' +
        '<h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></article>';
    }).join(''));
  }

  function renderCv() {
    mount('cv-contents', chips(['Profile', 'Education', 'Skills', 'Experience', 'Leadership', 'Projects', 'Interests', 'References'], 'chip chip-soft'));
    // Same renderer as the popup and the printable page — one source of truth
    mount('cv-preview', window.renderCvDocument(D, { headingLevel: 3 }));
    mount('cvv-doc', window.renderCvDocument(D, { headingLevel: 2 }));
    mount('cvv-subtitle', esc(D.profile.name) + ' · ' + esc(D.profile.cvPdfName));
  }

  function renderContact() {
    var p = D.profile;
    var phone = p.phone
      ? '<a class="info-card" href="tel:' + esc(p.phone.replace(/\s+/g, '')) + '"><span class="card-icon">' + icon('phone') + '</span><div><small>Phone</small><strong>' + esc(p.phone) + '</strong></div></a>'
      : '<div class="info-card is-pending"><span class="card-icon">' + icon('phone') + '</span><div><small>Phone</small><strong>Available on request</strong></div></div>';
    mount('contact-info',
      '<a class="info-card" href="' + esc(D.social.email) + '"><span class="card-icon">' + icon('mail') + '</span><div><small>Email</small><strong>' + esc(p.email) + '</strong></div></a>' +
      phone +
      '<div class="info-card"><span class="card-icon">' + icon('pin') + '</span><div><small>Location</small><strong>' + esc(p.location) + '</strong></div></div>' +
      '<div class="info-links"><p>Find me online</p>' +
      socialDefs.map(function (s) {
        var url = D.social[s.key];
        if (!url) return '';
        var ext = /^https?:/.test(url);
        return '<a class="link-row" href="' + esc(url) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + icon(s.icon) +
          '<span>' + s.label + '</span>' + icon('arrowRight', 'go') + '</a>';
      }).join('') + '</div>');
  }

  // ---------- interactions ----------
  function setupTheme() {
    var btn = document.getElementById('theme-toggle');
    var root = document.documentElement;
    function paint() {
      var dark = root.getAttribute('data-theme') === 'dark';
      btn.innerHTML = icon(dark ? 'sun' : 'moon');
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', dark ? 'Light theme' : 'Dark theme');
    }
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      root.setAttribute('data-bs-theme', next); // keep Bootstrap components in step
      store('local', 'set', 'theme', next);
      paint();
    });
    paint();
  }

  var menu = { set: function () {} };
  function setupMenu() {
    var btn = document.getElementById('menu-toggle');
    var panel = document.getElementById('mobile-menu');
    function set(open) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      btn.innerHTML = icon(open ? 'x' : 'menu');
      document.body.classList.toggle('menu-open', open);
    }
    menu.set = set;
    btn.addEventListener('click', function () { set(panel.hidden); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a, [data-open-cv]')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1180 && !panel.hidden) set(false); });
    set(false);
  }

  // With pages that fit the window, the page area scrolls instead of the window
  var scroller = document.getElementById('page-scroll');

  function setupHeaderShadow() {
    var header = document.getElementById('site-header');
    var root = document.documentElement;
    function onScroll() {
      header.classList.toggle('scrolled', Math.max(window.scrollY, scroller.scrollTop) > 8);
      // Fade the bottom edge of the page area while there is more to scroll to
      scroller.classList.toggle('has-more', scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 4);
      // Header and pager leave the same room as the page area's scrollbar, so everything lines up
      root.style.setProperty('--sbw', (scroller.offsetWidth - scroller.clientWidth) + 'px');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if ('ResizeObserver' in window) new ResizeObserver(onScroll).observe(document.getElementById('main'));
    onScroll();
  }

  // ---------- Pages: one section at a time, sliding in from the side ----------
  // Every <section> in <main> is a page. Links to "#<section id>" switch pages (with history),
  // as do the pager, the ←/→ keys and a horizontal swipe. Without JS all sections show stacked.
  var pages = { go: function () {} };
  function setupPages() {
    var root = document.documentElement;
    var main = document.getElementById('main');
    var pager = document.getElementById('pager');
    var sections = $all('main > section[id]');
    var ids = sections.map(function (s) { return s.id; });
    var labels = {};
    D.nav.forEach(function (n) { labels[n.id] = n.label; });
    // A section without a link in a given menu highlights its nearest preceding item instead
    var fallback = { interests: 'leadership', cv: 'services' };
    var lists = $all('#nav-links, #mobile-links, #footer-links');
    var baseTitle = document.title;
    var current = null;
    var animTimer = null;

    function activate(id) {
      lists.forEach(function (list) {
        var target = list.querySelector('[data-nav="' + id + '"]') ? id : fallback[id];
        $all('[data-nav]', list).forEach(function (a) {
          var on = a.getAttribute('data-nav') === target;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
      });
    }

    function renderPager(i) {
      function side(j, dir) {
        var id = ids[j];
        if (!id) return '<span class="pager-link pager-' + dir + '" aria-hidden="true"></span>';
        return '<a class="pager-link pager-' + dir + '" href="#' + id + '">' +
          (dir === 'prev' ? icon('arrowLeft') : '') +
          '<span class="pager-text"><small>' + (dir === 'prev' ? 'Previous' : 'Next') + '</small>' +
          '<strong>' + esc(labels[id] || id) + '</strong></span>' +
          (dir === 'next' ? icon('arrowRight') : '') + '</a>';
      }
      pager.innerHTML = '<div class="container pager-inner">' + side(i - 1, 'prev') +
        '<div class="pager-mid"><ol class="pager-dots">' + ids.map(function (id, j) {
          return '<li><a href="#' + id + '" aria-label="' + esc(labels[id] || id) + '"' +
            (j === i ? ' aria-current="page"' : '') + '></a></li>';
        }).join('') + '</ol><span class="pager-count">' + (i + 1) + ' / ' + ids.length + '</span></div>' +
        side(i + 1, 'next') + '</div>';
    }

    // The page a hash belongs to: a section id, or the section containing that element
    function pageFor(hash) {
      if (!hash) return null;
      if (ids.indexOf(hash) !== -1) return hash;
      var el = document.getElementById(hash);
      var sec = el && el.closest('main > section[id]');
      return sec ? sec.id : null;
    }

    function show(id, focus) {
      var i = ids.indexOf(id);
      if (i === -1) return;
      if (id !== current) {
        var from = ids.indexOf(current);
        sections.forEach(function (s) { s.classList.remove('is-current', 'enter-next', 'enter-prev'); });
        var sec = sections[i];
        sec.classList.add('is-current');
        if (current !== null && !reduceMotion) {
          sec.classList.add(i > from ? 'enter-next' : 'enter-prev');
          clearTimeout(animTimer);
          animTimer = setTimeout(function () { sec.classList.remove('enter-next', 'enter-prev'); }, 600);
        }
        current = id;
        activate(id);
        renderPager(i);
        document.title = i === 0 ? baseTitle : (labels[id] || id) + ' | Gidah Thomas';
        root.setAttribute('data-page', id); // the current page, for page-specific styling
      }
      scroller.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (focus) {
        var h = sections[i].querySelector('h1, h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      }
    }

    function go(id) {
      if (ids.indexOf(id) === -1) return;
      if (id !== current) history.pushState(null, '', '#' + id);
      show(id, true);
    }
    pages.go = go;

    function step(delta) {
      var j = ids.indexOf(current) + delta;
      if (j >= 0 && j < ids.length) go(ids[j]);
    }

    function dialogOpen() {
      return root.classList.contains('cv-open') || document.body.classList.contains('modal-open') ||
        document.body.classList.contains('menu-open');
    }

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      if (a.classList.contains('to-top')) {
        e.preventDefault();
        scroller.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        return;
      }
      var id = pageFor(a.getAttribute('href').slice(1));
      if (!id) return;
      e.preventDefault();
      go(id);
    });

    // Back / forward and hand-edited URLs
    window.addEventListener('hashchange', function () {
      show(pageFor(location.hash.slice(1)) || ids[0], true);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || dialogOpen()) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
      e.preventDefault();
      step(e.key === 'ArrowRight' ? 1 : -1);
    });

    // Horizontal swipe on touch screens (ignored inside form fields and sideways-scrolling areas)
    var sx = 0, sy = 0, st = 0, tracking = false;
    main.addEventListener('touchstart', function (e) {
      tracking = e.touches.length === 1 && !(e.target.closest && e.target.closest('input, textarea, select'));
      for (var el = e.target; tracking && el && el !== main; el = el.parentElement) {
        if (el.scrollWidth > el.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(el).overflowX)) tracking = false;
      }
      if (!tracking) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
    }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Date.now() - st < 700 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8 && !dialogOpen()) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    root.classList.add('paged');
    var start = location.hash.slice(1);
    show(pageFor(start) || ids[0], false);
    // A deep link to something inside a page (e.g. #cf-name) still lands on that element
    if (start && ids.indexOf(start) === -1 && document.getElementById(start)) {
      document.getElementById(start).scrollIntoView({ block: 'start' });
    }
  }

  function setupReveal() {
    var els = $all('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  function setupSkillFilter() {
    var input = document.getElementById('skill-filter');
    var empty = document.getElementById('skill-empty');
    if (!input) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var anyCard = false;
      $all('.skill-card').forEach(function (card) {
        var hits = 0;
        $all('.skill-chip', card).forEach(function (c) {
          var match = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
          c.classList.toggle('match', !!q && match);
          c.classList.toggle('dim', !!q && !match);
          if (match) hits++;
        });
        var titleHit = q && card.querySelector('h3').textContent.toLowerCase().indexOf(q) !== -1;
        var show = !q || hits > 0 || titleHit;
        card.hidden = !show;
        if (show) anyCard = true;
      });
      empty.hidden = anyCard;
    });
  }

  // Page regions made inert while a dialog is open
  function setBackgroundInert(on) {
    ['site-header', 'page-scroll', 'pager'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
  }

  function trapTab(e, container) {
    var f = focusables(container);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === container)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ---------- CV viewer (opening popup) ----------
  var cvViewer = { open: function () {} };
  function setupCvViewer() {
    var root = document.documentElement;
    var viewer = document.getElementById('cv-viewer');
    var win = $('.cvv-window', viewer);
    var scroller = document.getElementById('cvv-scroll');
    var lastFocus = null;
    var closing = null;

    function isOpen() { return root.classList.contains('cv-open'); }

    function open(fromIntro) {
      clearTimeout(closing);
      lastFocus = fromIntro ? null : document.activeElement;
      root.classList.remove('cv-closing');
      root.classList.add('cv-open');
      document.body.classList.add('modal-open');
      setBackgroundInert(true);
      scroller.scrollTop = 0;
      // Focus the dialog itself so screen readers announce it and keyboard scrolling works immediately
      requestAnimationFrame(function () { win.focus({ preventScroll: true }); });
    }

    function close(action) {
      if (!isOpen()) return;
      store('session', 'set', 'cvIntroSeen', '1');
      root.classList.add('cv-closing');
      setBackgroundInert(false);
      document.body.classList.remove('modal-open');
      closing = setTimeout(function () {
        root.classList.remove('cv-open', 'cv-closing', 'cv-intro');
      }, reduceMotion ? 0 : 220);

      if (action === 'portfolio') {
        pages.go('about'); // also moves focus to the About heading
      } else if (lastFocus && document.contains(lastFocus)) {
        lastFocus.focus({ preventScroll: true });
      } else {
        var name = document.getElementById('hero-name');
        name.setAttribute('tabindex', '-1');
        name.focus({ preventScroll: true });
      }
    }

    cvViewer.open = open;

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-cv]');
      if (opener) { e.preventDefault(); menu.set(false); open(false); return; }
      var act = e.target.closest('[data-cv-action]');
      if (act && viewer.contains(act)) { e.preventDefault(); close(act.getAttribute('data-cv-action')); }
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); close('continue'); }
      else if (e.key === 'Tab') trapTab(e, win);
    });

    // Opening experience: decided before first paint (see inline script in <head>)
    if (root.classList.contains('cv-intro') && D.cv.showOnLoad !== false) open(true);
    else root.classList.remove('cv-intro');
  }

  // ---------- project modal ----------
  function setupModal() {
    var modal = document.getElementById('project-modal');
    var panel = $('.modal-panel', modal);
    var lastFocus = null;
    $('.modal-close', modal).innerHTML = icon('x');

    function open(id) {
      var p = D.projects.filter(function (x) { return x.id === id; })[0];
      if (!p) return;
      mount('modal-body',
        '<div class="modal-media">' + projectMedia(p) + '</div>' +
        '<div class="modal-content">' +
        '<div class="project-meta"><p class="project-cat">' + esc(p.category) + '</p>' + statusBadge(p) + '</div>' +
        '<h3 id="modal-title">' + esc(p.title) + '</h3>' +
        '<p class="lead">' + esc(p.summary) + '</p>' +
        '<p>' + esc(p.description) + '</p>' +
        '<h4 class="label">Skills &amp; technologies</h4><ul class="chip-list">' + chips(p.tech, 'chip chip-tech') + '</ul>' +
        '<h4 class="label">' + esc(p.featuresLabel || 'Main features') + '</h4>' +
        '<ul class="check-list cols-2">' + p.features.map(function (f) { return '<li>' + icon('check') + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' +
        (p.github || p.live ? '<div class="project-actions">' + linkButtons(p, false) + '</div>' : '') +
        '</div>');
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('modal-open');
      setBackgroundInert(true);
      panel.scrollTop = 0;
      requestAnimationFrame(function () { modal.classList.add('open'); panel.focus(); });
    }
    function close() {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      setBackgroundInert(false);
      setTimeout(function () { modal.hidden = true; }, reduceMotion ? 0 : 200);
      if (lastFocus) lastFocus.focus();
    }
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-project]');
      if (t) { open(t.getAttribute('data-project')); return; }
      if (e.target.closest('[data-close-modal]')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') trapTab(e, panel);
    });
  }

  function setupContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('cf-status');
    var submit = document.getElementById('cf-submit');
    var label = $('.btn-label', submit);
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var rules = {
      name: function (v) { return v.length >= 2 ? '' : 'Please enter your name.'; },
      email: function (v) { return emailRe.test(v) ? '' : 'Please enter a valid email address.'; },
      subject: function (v) { return v.length >= 3 ? '' : 'Please add a subject.'; },
      message: function (v) { return v.length >= 10 ? '' : 'Please write a message (at least 10 characters).'; }
    };

    function check(name) {
      var input = form.elements[name];
      var msg = rules[name](input.value.trim());
      document.getElementById('cf-' + name + '-error').textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }
    Object.keys(rules).forEach(function (n) {
      form.elements[n].addEventListener('blur', function () { if (form.elements[n].value) check(n); });
      form.elements[n].addEventListener('input', function () { if (form.elements[n].getAttribute('aria-invalid') === 'true') check(n); });
    });

    function show(kind, text) {
      status.hidden = false;
      status.className = 'form-status ' + kind;
      status.innerHTML = icon(kind === 'ok' ? 'check' : 'x') + '<span>' + text + '</span>';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var names = Object.keys(rules);
      var ok = names.map(check).every(Boolean);
      if (!ok) {
        var bad = names.filter(function (n) { return form.elements[n].getAttribute('aria-invalid') === 'true'; })[0];
        if (bad) form.elements[bad].focus();
        return;
      }
      if (form.elements._honey.value) return; // bot

      var data = new FormData(form);
      data.append('_subject', 'Portfolio enquiry: ' + form.elements.subject.value.trim());
      data.append('_template', 'table');
      data.append('_captcha', 'false');

      submit.disabled = true;
      label.textContent = 'Sending…';
      status.hidden = true;

      fetch(D.contact.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (res) {
          if (res && (res.success === false || res.success === 'false')) throw new Error(res.message || 'Rejected');
          form.reset();
          names.forEach(function (n) { form.elements[n].removeAttribute('aria-invalid'); });
          show('ok', 'Thank you — your message has been sent. I will reply as soon as possible.');
        })
        .catch(function () {
          show('err', 'Your message could not be sent right now. Please email me directly at <a href="' +
            esc(D.social.email) + '">' + esc(D.profile.email) + '</a>.');
        })
        .then(function () { submit.disabled = false; label.textContent = 'Send Message'; });
    });
  }

  function reportPlaceholders() {
    var missing = [];
    if (!D.social.linkedin) missing.push('social.linkedin');
    if (!D.profile.phone) missing.push('profile.phone');
    D.projects.forEach(function (p) {
      if (!p.github) missing.push('projects[' + p.id + '].github');
      if (!p.status) missing.push('projects[' + p.id + '].status');
    });
    if (missing.length && /^(localhost|127\.|$)/.test(location.hostname)) {
      console.info('[portfolio] Placeholders to fill in js/data.js:', missing.join(', '));
    }
  }

  // ---------- boot ----------
  renderNav();
  renderHero();
  renderHeroCard();
  renderAbout();
  renderSkills();
  renderExperience();
  renderProjects();
  renderEducation();
  renderLeadership();
  renderInterests();
  renderServices();
  renderCv();
  renderContact();
  renderBindings(); // last: resolves data-bind / data-icon placeholders in static markup

  setupTheme();
  setupMenu();
  setupHeaderShadow();
  setupPages();
  setupReveal();
  setupSkillFilter();
  setupCvViewer();
  setupModal();
  setupContactForm();
  reportPlaceholders();
})();
