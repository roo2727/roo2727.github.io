/**
 * LIFE — title.js
 * 타이틀 화면의 동작을 연결한다.
 *   - 로고 글자별 형성(L·I·F·E → 장식) 완료 감지 → 빛 지나가는 효과 시작
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
  var rippleSvg = doc.querySelector('.svg-defs');

  /* ---------- 초기 문구 적용 ---------- */
  LIFE.i18n.translate();

  /* ---------- 로고 ---------- */
  // 로고는 L·I·F·E 글자 조각이 차례로 맺힌 뒤 장식(logo-orn-in)이 떠오르며 완성된다.
  // 완성되면 조각 대신 온전한 이미지로 바꾸고 빛 효과를 시작한다.
  var formed = false;
  function markFormed() {
    if (formed) return;
    formed = true;
    logo.classList.add('is-formed');
  }

  if (reduceMotion.matches) {
    markFormed();
  } else {
    logo.querySelector('.logo__art').addEventListener('animationend', function (e) {
      if (e.animationName === 'logo-orn-in') markFormed();
    });
    // 안전장치: 숨겨진 테마 쪽 이벤트만 오거나 이미지 로드가 늦어도 완성되도록
    var style = global.getComputedStyle(logo);
    var total = (parseFloat(style.getPropertyValue('--orn-delay')) || 1.75) +
                (parseFloat(style.getPropertyValue('--orn-dur')) || 1.6);
    global.setTimeout(markFormed, total * 1000 + 500);
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

  /* ---------- 언어 · 테마 ---------- */
  var controls = LIFE.controls.bind(doc);
  var langBtns = controls.langButtons;
  var themeSwitch = controls.themeSwitches[0];

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
