/**
 * LIFE — storage.js
 * localStorage 래퍼. 모든 키에 네임스페이스를 붙이고, 사생활 보호 모드 등에서
 * 저장소 접근이 막혀도 페이지가 깨지지 않도록 예외를 삼킨다.
 *
 * 추후 로그인 기능이 생기면 scope 를 사용자 ID 로 바꿔
 * 사용자별 설정을 분리하거나, 서버 동기화 계층을 이 파일 뒤에 붙이면 된다.
 */
(function (global) {
  'use strict';

  var LIFE = (global.LIFE = global.LIFE || {});
  var PREFIX = 'life';
  var scope = 'guest';

  function key(name) {
    return PREFIX + ':' + scope + ':' + name;
  }

  LIFE.storage = {
    get: function (name, fallback) {
      try {
        var raw = global.localStorage.getItem(key(name));
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set: function (name, value) {
      try {
        global.localStorage.setItem(key(name), JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: function (name) {
      try {
        global.localStorage.removeItem(key(name));
      } catch (e) { /* 무시 */ }
    },
    /** 저장소 이벤트(다른 탭에서 변경)를 판별할 때 사용 */
    fullKey: key,
    /** 로그인 확장 시: LIFE.storage.setScope(user.id) */
    setScope: function (next) {
      scope = next || 'guest';
    }
  };
})(window);
