/**
 * LIFE — illustration.js
 * js/config/illustration.js 의 설정을 읽어 우측 일러스트 레이어를 만든다.
 * 낮/밤 레이어를 모두 만들어 두고, CSS(data-theme)로 교차 페이드한다.
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;

  function buildMedia(conf) {
    var el;
    if (conf.type === 'video') {
      el = doc.createElement('video');
      el.src = conf.src;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      if (conf.poster) el.poster = conf.poster;
    } else {
      el = doc.createElement('img');
      el.src = conf.src;
      el.alt = '';
      el.decoding = 'async';
    }
    el.className = 'illustration__media';
    if (conf.fit) el.style.objectFit = conf.fit;
    if (conf.position) el.style.objectPosition = conf.position;
    return el;
  }

  function mount(container) {
    var config = (LIFE.config && LIFE.config.illustration) || {};
    var reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)');
    var videos = [];

    LIFE.theme.THEMES.forEach(function (variant) {
      var conf = config[variant];
      if (!conf || !conf.src || conf.type === 'none') return;

      var layer = doc.createElement('div');
      layer.className = 'illustration__layer motion-' + (conf.motion || 'none');
      layer.setAttribute('data-variant', variant);

      var media = buildMedia(conf);
      layer.appendChild(media);
      container.appendChild(layer);
      if (media.tagName === 'VIDEO') videos.push({ el: media, variant: variant });
    });

    // 영상은 현재 테마의 것만 재생하고, 모션 감소 시에는 정지
    function syncVideos() {
      var theme = LIFE.theme.get();
      videos.forEach(function (v) {
        if (v.variant === theme && !reduceMotion.matches) {
          var p = v.el.play();
          if (p && p.catch) p.catch(function () { /* 자동 재생 차단 시 무시 */ });
        } else {
          v.el.pause();
        }
      });
    }

    doc.addEventListener('life:themechange', syncVideos);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', syncVideos);
    syncVideos();
  }

  LIFE.illustration = { mount: mount };
})(window, document);
