/**
 * LIFE — placeholder.js
 * 임시 페이지(지역 페이지) 공통 초기화.
 * <body data-region="id"> 가 있으면 방문 기록을 남기고 탭 제목을 맞춘다.
 */
(function (doc, LIFE) {
  'use strict';

  var region = doc.body.getAttribute('data-region');

  function refresh() {
    LIFE.i18n.translate();
    if (region) doc.title = 'LIFE — ' + LIFE.i18n.t('region.' + region + '.name');
  }

  if (region && LIFE.progress) LIFE.progress.markVisited(region);
  doc.addEventListener('life:langchange', refresh);
  refresh();
})(document, window.LIFE);
