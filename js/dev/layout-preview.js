/**
 * LIFE — js/dev/layout-preview.js  (임시 기능, 타이틀 화면 전용)
 * 타이틀 레이아웃 A / B 를 바꿔 가며 비교한다.
 *   A: 로고 · START · 설정 줄을 한 묶음으로 중심축에 정렬 (간격 좁게)
 *   B: 로고는 좌측 상단, START 와 설정 줄은 좌측 중하단 (처음 타이틀 화면처럼 분리)
 * <html data-layout="a|b"> 로 표시하고, css/title.css 의 "레이아웃 A / B" 절이 배치를 바꾼다.
 * 선택값은 localStorage `life:dev:titleLayout` 에 저장된다.
 *
 * 레이아웃 확정 후 제거 방법:
 *   1) index.html 의 layout-preview.js <script> 줄 삭제
 *   2) 이 파일 삭제
 *   3) css/title.css 에서 선택하지 않은 레이아웃 규칙을 지우고, 선택한 쪽을 :root[data-layout] 없이 남긴다
 */
(function (global, doc) {
  'use strict';

  var KEY = 'life:dev:titleLayout';
  var LAYOUTS = [
    { id: 'a', label: '레이아웃 A (중심축 묶음)' },
    { id: 'b', label: '레이아웃 B (로고·버튼 분리)' }
  ];

  function read() {
    try { return global.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { global.localStorage.setItem(KEY, v); } catch (e) { /* 저장 불가 시 무시 */ }
  }

  var current = read() === 'b' ? 'b' : 'a';
  doc.documentElement.setAttribute('data-layout', current); // 첫 렌더 전에 적용

  function build() {
    var row = doc.createElement('div');
    row.className = 'dev-row';

    var label = doc.createElement('label');
    label.htmlFor = 'dev-layout-select';
    label.textContent = '레이아웃 (임시)';

    var select = doc.createElement('select');
    select.id = 'dev-layout-select';
    LAYOUTS.forEach(function (l) {
      var opt = doc.createElement('option');
      opt.value = l.id;
      opt.textContent = l.label;
      if (l.id === current) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () {
      current = select.value;
      doc.documentElement.setAttribute('data-layout', current);
      write(current);
    });
    select.addEventListener('keydown', function (e) { e.stopPropagation(); });

    row.appendChild(label);
    row.appendChild(select);
    var panel = global.LIFE_DEV_PANEL ? global.LIFE_DEV_PANEL() : doc.body;
    panel.appendChild(row);
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', build);
  else build();
})(window, document);
