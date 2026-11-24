/**
 * LIFE — detail.js
 * 지역 상세 페이지 공통 동작 (여섯 페이지가 함께 쓴다).
 *   - 언어 · 테마 조작 연결
 *   - 페이지 번호(01/06), 이전 · 다음 지역 링크, 하단 진행 점을 월드맵 설정에서 만든다
 *     (지역 순서는 js/config/worldmap.js 의 regions 순서. 첫 지역의 '이전'은 마지막 지역으로 이어진다)
 * 방문 기록과 탭 제목은 placeholder.js 가 처리한다.
 */
(function (doc, LIFE) {
  'use strict';

  LIFE.controls.bind(doc);

  var regions = (LIFE.config && LIFE.config.worldmap && LIFE.config.worldmap.regions) || [];
  var id = doc.body.getAttribute('data-region');
  var index = regions.map(function (r) { return r.id; }).indexOf(id);
  if (index === -1) return;

  var total = regions.length;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function href(r) { return r.id + '.html'; } // 같은 폴더(pages/regions/)의 지역 페이지

  doc.querySelectorAll('.js-page-num').forEach(function (el) { el.textContent = pad(index + 1); });
  doc.querySelectorAll('.js-page-total').forEach(function (el) { el.textContent = pad(total); });

  var prev = regions[(index - 1 + total) % total];
  var next = regions[(index + 1) % total];
  doc.querySelectorAll('.js-prev').forEach(function (a) { a.href = href(prev); a.dataset.region = prev.id; });
  doc.querySelectorAll('.js-next').forEach(function (a) { a.href = href(next); a.dataset.region = next.id; });

  // 하단 진행 표시: 지역마다 마름모 하나. 현재 지역은 채워지고, 방문한 지역은 테두리가 진해진다.
  var list = doc.querySelector('.js-progress');
  function renderDots() {
    if (!list) return;
    var t = LIFE.i18n.t;
    list.innerHTML = '';
    regions.forEach(function (r, i) {
      var li = doc.createElement('li');
      var a = doc.createElement('a');
      a.className = 'd-progress__dot';
      a.href = href(r);
      a.setAttribute('data-transition', '');
      a.setAttribute('aria-label', pad(i + 1) + ' ' + t('region.' + r.id + '.name'));
      if (i === index) a.setAttribute('aria-current', 'page');
      if (LIFE.progress && LIFE.progress.isVisited(r.id)) a.classList.add('is-visited');
      li.appendChild(a);
      list.appendChild(li);
    });
  }
  renderDots();
  doc.addEventListener('life:langchange', renderDots);
})(document, window.LIFE);
