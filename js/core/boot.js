/**
 * LIFE — boot.js
 * <head> 에서 동기 로드되어, CSS 가 그려지기 전에 저장된 테마·언어를
 * <html> 에 적용한다. (새로고침 시 테마가 깜빡이는 현상 방지)
 */
(function (doc, LIFE) {
  'use strict';

  var root = doc.documentElement;
  var theme = LIFE.storage.get('theme', 'night');
  var lang = LIFE.storage.get('lang', 'ko');

  root.setAttribute('data-theme', theme === 'day' ? 'day' : 'night');
  root.setAttribute('lang', lang === 'en' ? 'en' : 'ko');
  root.classList.add('js', 'is-entering');
})(document, window.LIFE);
