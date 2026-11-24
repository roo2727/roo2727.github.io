/**
 * LIFE — lobby.js
 * 월드맵 페이지의 상태와 동작.
 *   - 섬 선택 → 우측 상세 정보 갱신
 *   - ← → (↑ ↓, Home/End, 1~6) 키와 패널의 화살표 버튼으로 지역 이동
 *   - 입장하기 → 해당 섬으로 확대되며 지역 페이지로 이동
 *   - 방문 기록과 탐험 진행도 표시
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;
  var reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (id) { return doc.getElementById(id); };

  LIFE.i18n.translate();
  LIFE.controls.bind($('panel'));
  LIFE.particles.create($('particles'), { density: 0.45 });

  var map = LIFE.worldmap.create({
    background: $('map-bg'),
    routes: $('map-routes'),
    container: $('islands')
  });

  var regions = map.regions;
  var total = regions.length;
  var current = 0;
  var entering = false;

  var el = {
    world: $('map-world'),
    info: $('region-info'),
    index: $('region-index'),
    total: $('region-total'),
    tagline: $('region-tagline'),
    name: $('region-name'),
    status: $('region-status'),
    desc: $('region-desc'),
    contents: $('region-contents'),
    previewBgDay: $('preview-bg-day'),
    previewBgNight: $('preview-bg-night'),
    previewIslandDay: $('preview-island-day'),
    previewIslandNight: $('preview-island-night'),
    previewNote: $('preview-note'),
    enter: $('enter-btn'),
    progressValue: $('progress-value'),
    progressBar: $('progress-bar'),
    progressFill: $('progress-fill'),
    progressDots: $('progress-dots')
  };

  /* ---------- 상세 패널 ---------- */
  function renderPanel(animate) {
    var r = regions[current];
    var t = LIFE.i18n.t;
    var key = 'region.' + r.id + '.';

    el.index.textContent = LIFE.worldmap.pad(current + 1);
    el.total.textContent = LIFE.worldmap.pad(total);
    el.tagline.textContent = t(key + 'tagline');
    el.name.textContent = t(key + 'name');
    el.desc.textContent = t(key + 'desc');

    var visited = LIFE.progress.isVisited(r.id);
    el.status.textContent = t(visited ? 'lobby.visited' : 'lobby.unvisited');
    el.status.classList.toggle('is-visited', visited);

    // 이 지역에서 볼 수 있는 콘텐츠 3개 (문구: region.<id>.contents, '|' 로 구분)
    el.contents.innerHTML = '';
    t(key + 'contents').split('|').forEach(function (item) {
      var li = doc.createElement('li');
      li.textContent = item.trim();
      el.contents.appendChild(li);
    });

    renderPreview(r);

    if (animate && !reduceMotion.matches) {
      el.info.classList.remove('is-fresh');
      void el.info.offsetWidth; // 애니메이션 재시작
      el.info.classList.add('is-fresh');
    }
  }

  /* ---------- 풍경 미리보기 ----------
     r.preview = { day, night } 가 있으면 그 일러스트를 쓰고,
     없으면 월드맵 배경을 섬 위치 쪽으로 잘라 보여 주고 그 위에 섬 그림을 올린다 (임시). */
  var cfg = LIFE.config.worldmap;
  function renderPreview(r) {
    var custom = r.preview && r.preview.day && r.preview.night;
    el.previewBgDay.src = custom ? r.preview.day : cfg.background.day;
    el.previewBgNight.src = custom ? r.preview.night : cfg.background.night;
    var pos = custom ? '50% 50%' : r.x + '% ' + r.y + '%';
    [el.previewBgDay, el.previewBgNight].forEach(function (img) {
      img.style.objectPosition = pos;
      img.style.setProperty('--px', custom ? '50%' : r.x + '%');
      img.style.setProperty('--py', custom ? '50%' : r.y + '%');
    });
    el.previewBgDay.classList.toggle('is-custom', !!custom);
    el.previewBgNight.classList.toggle('is-custom', !!custom);
    el.previewIslandDay.hidden = el.previewIslandNight.hidden = el.previewNote.hidden = !!custom;
    if (!custom) {
      el.previewIslandDay.src = r.images.day;
      el.previewIslandNight.src = r.images.night;
    }
  }

  /* ---------- 진행도 ---------- */
  function renderProgress() {
    var visited = LIFE.progress.visited();
    var count = regions.filter(function (r) { return visited.indexOf(r.id) !== -1; }).length;

    el.progressValue.textContent = count === total ? LIFE.i18n.t('lobby.complete') + ' · ' + count + ' / ' + total : count + ' / ' + total;
    el.progressBar.setAttribute('aria-valuenow', String(count));
    el.progressBar.setAttribute('aria-valuemax', String(total));
    el.progressFill.style.width = (count / total) * 100 + '%';

    el.progressDots.innerHTML = '';
    regions.forEach(function (r, i) {
      var li = doc.createElement('li');
      li.className = (visited.indexOf(r.id) !== -1 ? 'is-visited' : '') + (i === current ? ' is-current' : '');
      el.progressDots.appendChild(li);
    });

    map.setVisited(visited);
  }

  /* ---------- 선택 ---------- */
  function select(index, opts) {
    index = (index + total) % total;
    var changed = index !== current;
    current = index;
    map.setSelected(current);
    renderPanel(changed);
    renderProgress();
    LIFE.storage.set('lobby.selected', regions[current].id);
    if (opts && opts.focus) map.islands[current].hit.focus();
  }

  /* ---------- 입장: 섬으로 확대 후 이동 ---------- */
  function enter() {
    if (entering) return;
    entering = true;
    var r = regions[current];
    LIFE.progress.markVisited(r.id);

    doc.body.classList.add('is-zooming');
    if (!reduceMotion.matches) {
      el.world.style.transformOrigin = r.x + '% ' + r.y + '%';
      el.world.classList.add('is-zooming');
      global.setTimeout(function () { LIFE.transition.go(r.page); }, 380);
    } else {
      LIFE.transition.go(r.page);
    }
  }

  // bfcache 로 돌아왔을 때 확대 상태 초기화
  global.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    entering = false;
    doc.body.classList.remove('is-zooming');
    el.world.classList.remove('is-zooming');
    renderProgress();
    renderPanel(false);
  });

  /* ---------- 이벤트 ---------- */
  map.islands.forEach(function (item, i) {
    item.hit.addEventListener('click', function () {
      select(i);
    });
    item.hit.addEventListener('dblclick', enter);
    item.hit.addEventListener('keydown', function (e) {
      // 이미 선택된 섬에서 Enter → 입장
      if (e.key === 'Enter' && i === current) {
        e.preventDefault();
        enter();
      }
    });
  });

  $('prev-btn').addEventListener('click', function () { select(current - 1); });
  $('next-btn').addEventListener('click', function () { select(current + 1); });
  el.enter.addEventListener('click', enter);

  doc.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || entering) return;
    var active = doc.activeElement;
    // 설정 컨트롤 안에서는 방향키를 가로채지 않는다
    if (active && active.closest && active.closest('.panel__settings, a')) return;

    var onIsland = !!(active && active.classList && active.classList.contains('island__hit'));
    var target = null;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        target = current - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        target = current + 1;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = total - 1;
        break;
      case 'Enter':
        if (!active || active === doc.body) {
          e.preventDefault();
          enter();
        }
        return;
      default:
        if (/^[1-9]$/.test(e.key) && Number(e.key) <= total) target = Number(e.key) - 1;
    }

    if (target === null) return;
    e.preventDefault();
    select(target, { focus: onIsland });
  });

  doc.addEventListener('life:langchange', function () {
    renderPanel(false);
    renderProgress();
  });
  doc.addEventListener('life:progress', renderProgress);

  /* ---------- 시작: 마지막으로 보던 지역 복원 ---------- */
  var saved = LIFE.storage.get('lobby.selected', null);
  var start = 0;
  regions.forEach(function (r, i) { if (r.id === saved) start = i; });
  current = start;
  select(start);
})(window, document);
