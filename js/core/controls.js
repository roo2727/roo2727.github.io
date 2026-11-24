/**
 * LIFE — controls.js
 * 여러 페이지에서 공통으로 쓰는 설정 컨트롤을 연결한다.
 *   <button data-lang="ko|en" aria-pressed>   → 언어 선택
 *   <button data-theme-toggle role="switch">  → 낮/밤 전환 (켜짐 = 밤)
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;

  function bind(scope) {
    scope = scope || doc;
    var langBtns = Array.prototype.slice.call(scope.querySelectorAll('[data-lang]'));
    var themeSwitches = Array.prototype.slice.call(scope.querySelectorAll('[data-theme-toggle]'));

    function syncLang() {
      var lang = LIFE.i18n.get();
      langBtns.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
      });
    }

    function syncTheme() {
      var night = LIFE.theme.get() === 'night';
      themeSwitches.forEach(function (sw) {
        sw.setAttribute('aria-checked', String(night));
      });
    }

    langBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        LIFE.i18n.set(btn.getAttribute('data-lang'));
      });
    });
    themeSwitches.forEach(function (sw) {
      sw.addEventListener('click', LIFE.theme.toggle);
    });

    doc.addEventListener('life:langchange', syncLang);
    doc.addEventListener('life:themechange', syncTheme);
    syncLang();
    syncTheme();

    return { langButtons: langBtns, themeSwitches: themeSwitches };
  }

  LIFE.controls = { bind: bind };
})(window, document);
