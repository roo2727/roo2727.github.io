/**
 * LIFE — progress.js
 * 방문한 지역(탐험 기록)을 localStorage 에 저장한다.
 * 로그인 기능이 생기면 storage scope 만 바뀌므로 사용자별 기록으로 자연스럽게 확장된다.
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;
  var KEY = 'visited';

  function list() {
    var v = LIFE.storage.get(KEY, []);
    return Array.isArray(v) ? v : [];
  }

  LIFE.progress = {
    visited: list,
    isVisited: function (id) {
      return list().indexOf(id) !== -1;
    },
    markVisited: function (id) {
      var v = list();
      if (v.indexOf(id) !== -1) return;
      v.push(id);
      LIFE.storage.set(KEY, v);
      doc.dispatchEvent(new CustomEvent('life:progress', { detail: { visited: v.slice() } }));
    },
    reset: function () {
      LIFE.storage.remove(KEY);
      doc.dispatchEvent(new CustomEvent('life:progress', { detail: { visited: [] } }));
    }
  };
})(window, document);
