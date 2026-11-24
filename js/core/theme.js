/**
 * LIFE — theme.js
 * 낮(day) / 밤(night) 세계관 테마 관리.
 * 실제 색과 분위기는 css/base.css 의 CSS 변수가 담당하고,
 * 이 파일은 <html data-theme> 값과 localStorage 만 관리한다.
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;
  var root = doc.documentElement;
  var THEMES = ['day', 'night'];

  function current() {
    return root.getAttribute('data-theme') === 'day' ? 'day' : 'night';
  }

  function apply(theme, opts) {
    if (THEMES.indexOf(theme) === -1) return;
    var prev = current();
    root.setAttribute('data-theme', theme);
    if (!opts || opts.persist !== false) LIFE.storage.set('theme', theme);
    if (prev !== theme) {
      doc.dispatchEvent(new CustomEvent('life:themechange', { detail: { theme: theme, previous: prev } }));
    }
  }

  LIFE.theme = {
    THEMES: THEMES,
    /** CSS 의 --theme-duration 과 맞춰 둔 전환 시간(ms) */
    DURATION: 1500,
    get: current,
    set: apply,
    toggle: function () {
      apply(current() === 'day' ? 'night' : 'day');
    }
  };

  // 다른 탭/페이지에서 테마를 바꾸면 이 페이지에도 반영
  global.addEventListener('storage', function (e) {
    if (e.key === LIFE.storage.fullKey('theme') && e.newValue) {
      try {
        apply(JSON.parse(e.newValue), { persist: false });
      } catch (err) { /* 무시 */ }
    }
  });
})(window, document);
