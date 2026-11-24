/**
 * LIFE — transition.js
 * 페이지 진입 시 페이드인, 이동 시 페이드아웃 후 location 변경.
 * 화면 전체를 덮는 .screen-fade 요소의 투명도로 처리한다.
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;
  var root = doc.documentElement;
  var reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)');
  var leaving = false;

  function fadeMs() {
    return reduceMotion.matches ? 150 : 900;
  }

  function enter() {
    // 두 프레임 뒤에 클래스를 지워야 초기 상태(덮인 화면)가 먼저 그려진다
    global.requestAnimationFrame(function () {
      global.requestAnimationFrame(function () {
        root.classList.remove('is-entering');
      });
    });
  }

  function go(url) {
    if (leaving) return;
    leaving = true;
    root.classList.add('is-leaving');
    global.setTimeout(function () {
      global.location.href = url;
    }, fadeMs());
  }

  // 뒤로 가기(bfcache)로 돌아왔을 때 덮개가 남아 있지 않도록
  global.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      leaving = false;
      root.classList.remove('is-leaving');
    }
  });

  // data-transition 링크는 자동으로 페이드 이동
  doc.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[data-transition]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(link.href);
  });

  LIFE.transition = { enter: enter, go: go };

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', enter);
  } else {
    enter();
  }
})(window, document);
