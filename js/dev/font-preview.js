/**
 * LIFE — js/dev/font-preview.js  (임시 기능)
 * 한글 메인 UI 폰트 후보 5종을 바꿔 가며 비교한다.
 * 선택값은 localStorage `life:dev:koFont` 에 저장되어 모든 페이지에 적용된다.
 *
 * 폰트 확정 후 제거 방법:
 *   1) 각 HTML 의 font-preview.js <script> 줄 삭제
 *   2) js/dev/ 폴더 삭제
 *   3) css/base.css 의 --font-ko-display / --font-ko-display-weight 기본값을 확정 폰트로 수정
 *   4) 쓰지 않는 후보 폰트를 Google Fonts 링크·@font-face 에서 삭제
 */
(function (global, doc) {
  'use strict';

  var KEY = 'life:dev:koFont';
  var FALLBACK = ", 'Gowun Batang', 'Nanum Myeongjo', serif";
  var FONTS = [
    { id: 'dnf-medium', label: '던파 연단된 칼날 Medium (500)', family: "'DNFForgedBlade'", weight: 500 },
    { id: 'dnf-light', label: '던파 연단된 칼날 Light (300)', family: "'DNFForgedBlade'", weight: 300 },
    { id: 'diphylleia', label: 'Diphylleia Regular', family: "'Diphylleia'", weight: 400 },
    { id: 'song-myung', label: 'Song Myung Regular', family: "'Song Myung'", weight: 400 },
    { id: 'hahmlet', label: 'Hahmlet Medium', family: "'Hahmlet'", weight: 500 }
  ];

  function read() {
    try { return global.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { global.localStorage.setItem(KEY, v); } catch (e) { /* 저장 불가 시 무시 */ }
  }
  function find(id) {
    for (var i = 0; i < FONTS.length; i++) if (FONTS[i].id === id) return FONTS[i];
    return FONTS[0];
  }

  function apply(font) {
    var root = doc.documentElement.style;
    root.setProperty('--font-ko-display', font.family + FALLBACK);
    root.setProperty('--font-ko-display-weight', String(font.weight));
  }

  var current = find(read());
  apply(current); // 화면이 그려지기 전에 적용 (깜빡임 방지)

  function buildPanel() {
    var style = doc.createElement('style');
    style.textContent =
      '.dev-font{position:fixed;right:12px;bottom:12px;z-index:9999;display:flex;align-items:center;gap:8px;' +
      'padding:6px 10px;border:1px dashed rgba(255,255,255,.45);border-radius:6px;background:rgba(10,16,24,.72);' +
      "color:#e8f0f8;font:12px/1.2 'Pretendard',system-ui,sans-serif;backdrop-filter:blur(4px)}" +
      '.dev-font select{font:inherit;color:#111;background:#f4f4f4;border:0;border-radius:4px;padding:3px 4px}' +
      '.dev-font select:focus-visible{outline:2px solid #6fe3d6;outline-offset:1px}' +
      '@media (max-width:520px){.dev-font{left:12px;right:12px;justify-content:space-between}}';
    doc.head.appendChild(style);

    var box = doc.createElement('div');
    box.className = 'dev-font';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', '한글 폰트 비교 (임시)');

    var label = doc.createElement('label');
    label.htmlFor = 'dev-font-select';
    label.textContent = '한글 폰트 (임시)';

    var select = doc.createElement('select');
    select.id = 'dev-font-select';
    FONTS.forEach(function (f) {
      var opt = doc.createElement('option');
      opt.value = f.id;
      opt.textContent = f.label;
      if (f.id === current.id) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      current = find(select.value);
      apply(current);
      write(current.id);
    });
    // 페이지 단축키(↑↓, T 등)가 선택 상자 조작을 가로채지 않도록 막는다.
    select.addEventListener('keydown', function (e) { e.stopPropagation(); });

    box.appendChild(label);
    box.appendChild(select);
    doc.body.appendChild(box);
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', buildPanel);
  else buildPanel();
})(window, document);
