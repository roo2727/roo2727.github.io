/**
 * LIFE — title.js
 * 타이틀 화면의 동작을 연결한다.
 *   - 레이어 로고 등장 완료 감지 (is-formed)
 *   - START: 충전 효과 후 페이드아웃, 메인 로비로 이동
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
  // 레이어 로고의 마지막 단계(물 반사 등장 reflection-in)가 끝나면 완성으로 표시한다.
  // 각 레이어의 등장 타이밍은 css/title.css 4장의 타임라인 참고.
  var formed = false;
  function markFormed() {
    if (formed) return;
    formed = true;
    logo.classList.add('is-formed');
  }

  if (reduceMotion.matches) {
    markFormed();
  } else {
    logo.addEventListener('animationend', function (e) {
      if (e.animationName === 'reflection-in') markFormed();
    });
    global.setTimeout(markFormed, 4000); // 안전장치 (2.3초 + 1.2초 이후)
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

  /* ---------- START: 왼쪽→오른쪽 충전(0.48초) → 짧은 발광 → 이동 ---------- */
  var CHARGE_MS = 480;
  var FLASH_MS = 180;
  var starting = false;

  startBtn.addEventListener('click', function () {
    if (starting) return; // 중복 클릭 방지
    starting = true;
    startBtn.setAttribute('aria-disabled', 'true');
    startBtn.classList.add('is-charging');

    var quick = reduceMotion.matches;
    global.setTimeout(function () {
      startBtn.classList.add('is-charged');
      global.setTimeout(function () {
        LIFE.transition.go(LOBBY_URL);
      }, quick ? 0 : FLASH_MS);
    }, quick ? 0 : CHARGE_MS);
  });

  // 뒤로 가기로 돌아오면 버튼 상태 초기화
  global.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    starting = false;
    startBtn.removeAttribute('aria-disabled');
    startBtn.classList.remove('is-charging', 'is-charged');
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
