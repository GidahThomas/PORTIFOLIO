/*
 * Shared CV document renderer.
 * Used by the opening CV popup, the CV section preview (index.html) and the printable CV page (cv/).
 * All content comes from window.PORTFOLIO (js/data.js), so every copy of the CV is identical.
 *
 *   renderCvDocument(data, { root: '', headingLevel: 2, idPrefix: 'cv' }) -> HTML string
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function bare(url) { return String(url).replace(/^(https?:\/\/|mailto:)(www\.)?/, '').replace(/\/$/, ''); }

  window.renderCvDocument = function (D, opts) {
    opts = opts || {};
    var root = opts.root || '';
    var h = opts.headingLevel || 2; // name heading; section headings are h+1, entries h+2
    var H = 'h' + h, S = 'h' + (h + 1), E = 'h' + (h + 2);
    var ic = window.icon;
    var p = D.profile;

    function section(key, title, body) {
      return '<section class="cvd-sec cvd-' + key + '"><' + S + ' class="cvd-h">' + esc(title) + '</' + S + '>' + body + '</section>';
    }
    function entry(title, org, period, body) {
      return '<article class="cvd-entry"><div class="cvd-entry-head"><' + E + '>' + esc(title) + '</' + E + '>' +
        (period ? '<span class="cvd-when">' + esc(period) + '</span>' : '') + '</div>' +
        (org ? '<p class="cvd-org">' + org + '</p>' : '') + (body || '') + '</article>';
    }
    function list(items) { return '<ul class="cvd-list">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }
    function tags(items) { return '<ul class="cvd-tags">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }

    // Contact line — only real links are printed (null values are skipped, never invented)
    var contacts = [
      { i: 'pin', text: p.location },
      { i: 'mail', text: p.email, href: 'mailto:' + p.email },
      p.phone ? { i: 'phone', text: p.phone, href: 'tel:' + p.phone.replace(/\s+/g, '') } : null,
      D.social.github ? { i: 'github', text: bare(D.social.github), href: D.social.github } : null,
      D.social.linkedin ? { i: 'linkedin', text: bare(D.social.linkedin), href: D.social.linkedin } : null,
      D.social.portfolio ? { i: 'globe', text: bare(D.social.portfolio), href: D.social.portfolio } : null
    ].filter(Boolean);

    var head =
      '<header class="cvd-head">' +
      '<img class="cvd-photo" src="' + esc(root + (p.headshot || p.photo)) + '" alt="Photo of ' + esc(p.name) + '" width="320" height="320">' +
      '<div class="cvd-id">' +
      '<' + H + ' class="cvd-name">' + esc(p.fullName) + '</' + H + '>' +
      '<p class="cvd-alias">' + esc(p.name) + '</p>' +
      '<p class="cvd-roles">' + p.roles.map(function (r) { return '<span class="cvd-role">' + esc(r) + '</span>'; })
        .join('<span class="cvd-sep" aria-hidden="true"> | </span>') + '</p>' +
      '</div>' +
      '<ul class="cvd-contact">' + contacts.map(function (c) {
        var inner = ic(c.i) + '<span>' + esc(c.text) + '</span>';
        return '<li>' + (c.href ? '<a href="' + esc(c.href) + '"' + (/^https?:/.test(c.href) ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a>' : inner) + '</li>';
      }).join('') + '</ul>' +
      '</header>';

    var profile = section('profile', 'Professional Profile', '<p class="cvd-lead">' + esc(D.cv.profile) + '</p>');

    var education = section('education', 'Education', D.education.map(function (e) {
      return entry(e.degree, esc(e.institution), e.period,
        '<p class="cvd-small"><strong>Relevant coursework:</strong> ' + e.courses.map(esc).join(', ') + '.</p>');
    }).join(''));

    var skills = section('skills', 'Technical Skills', tags(D.cvSkills));

    var experience = section('experience', 'Professional Experience', D.experience.map(function (x) {
      var sup = x.supervisors || [];
      return entry(x.role, esc(x.organization) + (x.department ? ' · ' + esc(x.department) : ''), x.period,
        list(x.points) +
        (sup.length ? '<p class="cvd-small">' + sup.map(function (s) { return '<strong>' + esc(s.label) + ':</strong> ' + esc(s.name); }).join(' &nbsp;·&nbsp; ') + '</p>' : ''));
    }).join(''));

    var leadership = section('leadership', 'Leadership', D.leadership.map(function (l) {
      return entry(l.role, esc(l.organization) + ', ' + esc(l.institution), l.period,
        '<p class="cvd-small">' + esc(l.points.join(' · ')) + '</p>');
    }).join(''));

    var projects = section('projects', 'Projects', D.projects.map(function (pr) {
      var links = [];
      if (pr.github) links.push('<a href="' + esc(pr.github) + '" target="_blank" rel="noopener">' + esc(bare(pr.github)) + '</a>');
      if (pr.live) links.push('<a href="' + esc(pr.live) + '" target="_blank" rel="noopener">' + esc(bare(pr.live)) + '</a>');
      // Compact on the CV (full feature lists live on the website)
      return entry(pr.title, esc(pr.category), null,
        '<p>' + esc(pr.summary) + ' <span class="cvd-small"><strong>' + (pr.featuresLabel ? esc(pr.featuresLabel) : 'Skills') + ':</strong> ' +
        (pr.featuresLabel ? pr.features : pr.tech).map(esc).join(', ') + '.</span></p>' +
        (links.length ? '<p class="cvd-small">' + links.join(' · ') + '</p>' : ''));
    }).join(''));

    var interests = section('interests', 'Professional Interests', tags(D.interests.map(function (x) { return x.title; })));

    var refs = D.cv.references || [];
    var references = section('references', 'References', refs.length
      ? '<div class="cvd-refs">' + refs.map(function (r) {
        return '<div><strong>' + esc(r.name) + '</strong><span>' + esc(r.title) + '</span>' + (r.contact ? '<span>' + esc(r.contact) + '</span>' : '') + '</div>';
      }).join('') + '</div>'
      : '<p class="cvd-small">Available upon request.</p>');

    // Two columns on wide containers; a single, reading-order column on narrow ones (see css/cv-document.css)
    return '<article class="cvdoc">' + head +
      '<div class="cvd-body">' +
      '<div class="cvd-main">' + profile + experience + projects + '</div>' +
      '<div class="cvd-side">' + education + leadership + skills + interests + references + '</div>' +
      '</div></article>';
  };
})();
