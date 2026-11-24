/**
 * LIFE — i18n.js
 * KR / EN 전환. 문구는 js/i18n/ko.js, js/i18n/en.js 에 있다.
 *
 * 사용법 (HTML)
 *   <span data-i18n="title.start"></span>            → textContent 교체
 *   <button data-i18n-attr="aria-label:a11y.start">  → 속성 교체 (쉼표로 여러 개)
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;
  var root = doc.documentElement;
  var LANGS = ['ko', 'en'];

  function dict(lang) {
    return (LIFE.messages && LIFE.messages[lang]) || {};
  }

  function t(keyName, lang) {
    lang = lang || current();
    var value = dict(lang)[keyName];
    if (value === undefined) value = dict('ko')[keyName];
    return value === undefined ? keyName : value;
  }

  function current() {
    return root.getAttribute('lang') === 'en' ? 'en' : 'ko';
  }

  function translate(scope) {
    scope = scope || doc;
    var lang = current();

    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'), lang);
    });

    scope.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim(), lang));
      });
    });
  }

  function set(lang, opts) {
    if (LANGS.indexOf(lang) === -1) return;
    var prev = current();
    root.setAttribute('lang', lang);
    if (!opts || opts.persist !== false) LIFE.storage.set('lang', lang);
    translate();
    if (prev !== lang) {
      doc.dispatchEvent(new CustomEvent('life:langchange', { detail: { lang: lang, previous: prev } }));
    }
  }

  LIFE.i18n = { LANGS: LANGS, t: t, get: current, set: set, translate: translate };

  global.addEventListener('storage', function (e) {
    if (e.key === LIFE.storage.fullKey('lang') && e.newValue) {
      try {
        set(JSON.parse(e.newValue), { persist: false });
      } catch (err) { /* 무시 */ }
    }
  });
})(window, document);
