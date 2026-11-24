/**
 * LIFE — title.js
 * 타이틀 화면의 동작을 연결한다.
 *   - 로고 형성 완료 감지 → 빛 지나가는 효과 시작
 *   - START: 페이드아웃 후 메인 로비로 이동
 *   - 언어(KR/EN), 낮/밤 테마 전환
 *   - 키보드 조작(↑↓ 메뉴 이동, ←→ 언어 선택, T 테마 전환)
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;
  var LOBBY_URL = 'pages/lobby.html';
  var reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)');

  var logo = doc.getElementById('logo');
  var startBtn = doc.getElementById('start-btn');
  var themeSwitch = doc.getElementById('theme-switch');
  var langBtns = Array.prototype.slice.call(doc.querySelectorAll('[data-lang]'));
  var rippleSvg = doc.querySelector('.svg-defs');

  /* ---------- 초기 문구 적용 ---------- */
  LIFE.i18n.translate();

  /* ---------- 로고 ---------- */
  function markFormed() {
    logo.classList.add('is-formed');
  }

  var chars = logo.querySelectorAll('.logo__chars .logo__char');
  var lastChar = chars[chars.length - 1];
  if (reduceMotion.matches) {
    markFormed();
  } else {
    lastChar.addEventListener('animationend', markFormed, { once: true });
    global.setTimeout(markFormed, 3600); // 안전장치
  }

  // 물결 반사 SVG 애니메이션은 모션 감소 시 정지
  function syncRipple() {
    if (!rippleSvg || !rippleSvg.pauseAnimations) return;
    if (reduceMotion.matches) rippleSvg.pauseAnimations();
    else rippleSvg.unpauseAnimations();
  }
  syncRipple();
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', syncRipple);

  /* ---------- 배경 연출 ---------- */
  LIFE.particles.create(doc.getElementById('particles'));
  LIFE.illustration.mount(doc.getElementById('illustration'));

  /* ---------- START ---------- */
  startBtn.addEventListener('click', function () {
    startBtn.classList.add('is-pressed');
    LIFE.transition.go(LOBBY_URL);
  });

  /* ---------- 언어 ---------- */
  function syncLang() {
    var lang = LIFE.i18n.get();
    langBtns.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
  }

  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      LIFE.i18n.set(btn.getAttribute('data-lang'));
    });
  });
  doc.addEventListener('life:langchange', syncLang);
  syncLang();

  /* ---------- 테마 ---------- */
  function syncTheme() {
    themeSwitch.setAttribute('aria-checked', String(LIFE.theme.get() === 'night'));
  }

  themeSwitch.addEventListener('click', LIFE.theme.toggle);
  doc.addEventListener('life:themechange', syncTheme);
  syncTheme();

  /* ---------- 키보드 조작 ---------- */
  var menuOrder = [startBtn].concat(langBtns, [themeSwitch]);

  doc.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var active = doc.activeElement;
    var idx = menuOrder.indexOf(active);

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (idx === -1) {
          startBtn.focus();
          return;
        }
        // ↑↓ 는 [START] ↔ [설정 줄] 사이를 이동
        if (e.key === 'ArrowDown' && active === startBtn) {
          (langBtns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0] || langBtns[0]).focus();
        } else if (e.key === 'ArrowUp' && active !== startBtn) {
          startBtn.focus();
        }
        break;
      }
      case 'ArrowLeft':
      case 'ArrowRight': {
        if (idx <= 0) return;
        e.preventDefault();
        var next = menuOrder[idx + (e.key === 'ArrowRight' ? 1 : -1)];
        if (next && next !== startBtn) next.focus();
        break;
      }
      case 'Enter':
        // 아무 것도 선택되지 않은 상태에서 Enter → START 로 포커스
        if (idx === -1 && (active === doc.body || !active)) {
          e.preventDefault();
          startBtn.focus();
        }
        break;
      case 't':
      case 'T':
        if (active && /input|textarea/i.test(active.tagName)) return;
        LIFE.theme.toggle();
        break;
    }
  });
})(window, document);
