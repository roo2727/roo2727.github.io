/**
 * LIFE — 월드맵 설정 (pages/lobby.html)
 *
 * ▶ 이미지 교체 방법
 *   배경·섬 이미지는 낮/밤을 따로 지정한다. 새 파일을 assets/worldmap/ 에 넣고
 *   아래 경로만 바꾸면 된다. 경로는 pages/lobby.html 기준 상대 경로.
 *
 * ▶ 섬 하나의 설정
 *   id     : 지역 ID. 문구 키(region.<id>.*)와 방문 기록에 쓰인다.
 *   page   : 입장 시 이동할 독립 페이지 (lobby.html 기준)
 *   x, y   : 섬 중심 좌표 (지도 영역 기준 %, 0~100). 비대칭으로 배치한다.
 *   size   : 섬 너비 (vmin). 섬마다 크기를 다르게 해 원근감을 준다.
 *   float  : 둥실거리는 주기(초). 섬마다 달라야 자연스럽다.
 *   hit    : 클릭 영역 (이미지 기준 %, 타원). 이미지의 투명한 여백은 클릭되지 않도록
 *            실제 섬 몸통 부분만 지정한다. 새 이미지로 바꾸면 이 값만 맞춰 주면 된다.
 *   images : { day, night } 낮/밤 이미지
 *
 * 섬 순서 = 방향키로 이동하는 순서 = 지역 번호.
 */
(function (global) {
  'use strict';
  var LIFE = (global.LIFE = global.LIFE || {});
  LIFE.config = LIFE.config || {};

  var IMG = '../assets/worldmap/';

  function island(id, x, y, size, float) {
    return {
      id: id,
      page: 'regions/' + id + '.html',
      x: x,
      y: y,
      size: size,
      float: float,
      hit: { x: 50, y: 52, w: 84, h: 66 },
      images: {
        day: IMG + 'islands/' + id + '-day.svg',
        night: IMG + 'islands/' + id + '-night.svg'
      }
    };
  }

  LIFE.config.worldmap = {
    background: {
      day: IMG + 'bg-day.svg',
      night: IMG + 'bg-night.svg'
    },
    regions: [
      island('intro', 19, 44, 30, 7.0),
      island('school', 43, 24, 22, 8.5),
      island('interests', 70, 17, 19, 6.2),
      island('activities', 80, 52, 27, 9.4),
      island('hobbies', 54, 72, 22, 7.6),
      island('future', 24, 80, 24, 8.8)
    ]
  };
})(window);
