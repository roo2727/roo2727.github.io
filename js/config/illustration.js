/**
 * LIFE — 우측 일러스트 설정
 *
 * ▶ 리소스 교체 방법
 *   1) 새 파일을 assets/illustration/ 에 넣는다.
 *   2) 아래 src 경로(와 type)만 바꾼다. HTML/CSS 는 건드릴 필요 없다.
 *
 * type
 *   'image' : png / jpg / webp / gif / svg (애니메이션 GIF·APNG·WebP 도 가능)
 *   'video' : mp4 / webm (자동 재생·반복·음소거). poster 는 모션 감소 시 대체 이미지
 *
 * motion
 *   'float' : 위아래로 천천히 떠다니는 효과 (CSS)
 *   'none'  : 효과 없음 (영상처럼 자체 애니메이션이 있을 때)
 *
 * position : CSS object-position 값. 이미지의 어느 부분을 기준으로 맞출지
 * fit      : CSS object-fit 값 ('contain' | 'cover')
 *
 * 경로는 index.html 기준 상대 경로.
 */
(function (global) {
  'use strict';
  var LIFE = (global.LIFE = global.LIFE || {});
  LIFE.config = LIFE.config || {};

  LIFE.config.illustration = {
    day: {
      type: 'image',
      src: 'assets/illustration/placeholder-day.svg',
      poster: '',
      motion: 'float',
      fit: 'contain',
      position: 'right bottom'
    },
    night: {
      type: 'image',
      src: 'assets/illustration/placeholder-night.svg',
      poster: '',
      motion: 'float',
      fit: 'contain',
      position: 'right bottom'
    }
  };
})(window);
