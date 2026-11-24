/**
 * LIFE — session.js
 * 회원가입·로그인 확장을 위한 자리. 현재는 서버가 없으므로 항상 게스트다.
 *
 * 나중에 인증 기능을 붙일 때 이 객체의 메서드만 실제 구현(API 호출 등)으로
 * 교체하면, 다른 페이지 코드는 수정하지 않아도 되도록 인터페이스를 고정해 둔다.
 */
(function (global) {
  'use strict';

  var LIFE = (global.LIFE = global.LIFE || {});

  LIFE.session = {
    /** @returns {null | {id: string, name: string}} */
    getUser: function () {
      return null;
    },
    isLoggedIn: function () {
      return this.getUser() !== null;
    },
    /* 추후 구현 예정 */
    signIn: function () {
      return Promise.reject(new Error('Not implemented yet'));
    },
    signUp: function () {
      return Promise.reject(new Error('Not implemented yet'));
    },
    signOut: function () {
      return Promise.resolve();
    }
  };
})(window);
