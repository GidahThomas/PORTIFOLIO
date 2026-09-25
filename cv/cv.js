/* Printable CV page — renders the shared CV document from ../js/data.js. */
(function () {
  'use strict';

  var D = window.PORTFOLIO;
  var ROOT = '../'; // data.js paths are relative to the site root

  document.getElementById('cv-doc').innerHTML = window.renderCvDocument(D, { root: ROOT, headingLevel: 1 });

  Array.prototype.forEach.call(document.querySelectorAll('[data-icon]'), function (el) {
    el.outerHTML = icon(el.getAttribute('data-icon'), el.getAttribute('data-class'));
  });

  var dl = document.getElementById('tb-download');
  dl.setAttribute('href', ROOT + D.profile.cvPdf);
  dl.setAttribute('download', D.profile.cvPdfName);
  document.getElementById('tb-print').addEventListener('click', function () { window.print(); });
})();
