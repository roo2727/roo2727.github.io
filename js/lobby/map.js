/**
 * LIFE — map.js
 * js/config/worldmap.js 설정으로 월드맵(배경, 항로, 섬)을 그린다.
 * 상태(선택·방문)는 lobby.js 가 관리하고, 이 파일은 화면 표시만 담당한다.
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* ---------- 배경: 낮/밤 이미지를 겹쳐 두고 CSS 로 교차 페이드 ---------- */
  function renderBackground(container, bg) {
    LIFE.theme.THEMES.forEach(function (variant) {
      if (!bg || !bg[variant]) return;
      var img = doc.createElement('img');
      img.className = 'map-bg__img only-' + variant;
      img.src = bg[variant];
      img.alt = '';
      img.decoding = 'async';
      container.appendChild(img);
    });
  }

  /* ---------- 섬 사이를 잇는 점선 항로 ---------- */
  function renderRoutes(svg, regions) {
    var d = regions.map(function (r, i) {
      return (i ? 'L' : 'M') + r.x + ' ' + r.y;
    }).join(' ');
    var path = doc.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'map-routes__path');
    svg.appendChild(path);
  }

  /* ---------- 섬 ---------- */
  function createIsland(region, index) {
    var el = doc.createElement('div');
    el.className = 'island';
    el.setAttribute('data-id', region.id);
    el.style.setProperty('--x', region.x + '%');
    el.style.setProperty('--y', region.y + '%');
    el.style.setProperty('--size', region.size + 'vmin');
    el.style.setProperty('--float', (region.float || 8) + 's');
    el.style.setProperty('--delay', (-index * 1.3) + 's');

    // 클릭 영역: 이미지 전체가 아니라 섬 몸통 타원만 (투명 여백 클릭 방지)
    var hit = region.hit || { x: 50, y: 50, w: 80, h: 70 };
    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'island__hit';
    btn.style.left = (hit.x - hit.w / 2) + '%';
    btn.style.top = (hit.y - hit.h / 2) + '%';
    btn.style.width = hit.w + '%';
    btn.style.height = hit.h + '%';
    btn.setAttribute('data-index', String(index));
    btn.setAttribute('aria-pressed', 'false');
    btn.tabIndex = -1;

    // 섬 이미지 (낮/밤 각각 독립된 이미지 요소)
    var body = doc.createElement('div');
    body.className = 'island__body';
    var lift = doc.createElement('div');
    lift.className = 'island__lift';

    // 선택 표시: 섬 윗면을 두르는 얇은 타원 (이미지 뒤에 깔려 가장자리만 보인다)
    var ring = doc.createElement('span');
    ring.className = 'island__ring';
    ring.setAttribute('aria-hidden', 'true');
    lift.appendChild(ring);
    LIFE.theme.THEMES.forEach(function (variant) {
      var src = region.images && region.images[variant];
      if (!src) return;
      var img = doc.createElement('img');
      img.className = 'island__img only-' + variant;
      img.src = src;
      img.alt = '';
      img.draggable = false;
      img.decoding = 'async';
      lift.appendChild(img);
    });
    body.appendChild(lift);

    var label = doc.createElement('span');
    label.className = 'island__label';
    label.setAttribute('aria-hidden', 'true');
    label.innerHTML =
      '<span class="island__num">' + pad(index + 1) + '</span>' +
      '<span class="island__name"></span>' +
      '<svg class="island__check" viewBox="0 0 12 12"><path d="M2.5 6.5 L5 9 L9.5 3.5" /></svg>';

    // 순서 중요: hit 버튼이 앞에 있어야 CSS 형제 선택자(~)로 hover 효과를 줄 수 있다
    el.appendChild(btn);
    el.appendChild(body);
    el.appendChild(label);

    return { el: el, hit: btn, name: label.querySelector('.island__name'), region: region };
  }

  function create(opts) {
    var config = LIFE.config.worldmap;
    var regions = config.regions;

    renderBackground(opts.background, config.background);
    renderRoutes(opts.routes, regions);

    var islands = regions.map(function (region, i) {
      var item = createIsland(region, i);
      opts.container.appendChild(item.el);
      return item;
    });

    function translate() {
      islands.forEach(function (item) {
        var name = LIFE.i18n.t('region.' + item.region.id + '.name');
        item.name.textContent = name;
        item.hit.setAttribute('aria-label', pad(islands.indexOf(item) + 1) + '. ' + name);
      });
    }

    function setSelected(index) {
      islands.forEach(function (item, i) {
        var on = i === index;
        item.el.classList.toggle('is-selected', on);
        item.hit.setAttribute('aria-pressed', String(on));
        item.hit.tabIndex = on ? 0 : -1; // 방향키로 이동하는 roving tabindex
      });
    }

    function setVisited(ids) {
      islands.forEach(function (item) {
        item.el.classList.toggle('is-visited', ids.indexOf(item.region.id) !== -1);
      });
    }

    translate();
    doc.addEventListener('life:langchange', translate);

    return {
      regions: regions,
      islands: islands,
      setSelected: setSelected,
      setVisited: setVisited
    };
  }

  LIFE.worldmap = { create: create, pad: pad };
})(window, document);
