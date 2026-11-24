/**
 * LIFE — particles.js
 * 테마별 파티클을 하나의 <canvas> 에 그린다.
 *   낮 : 꽃잎(petal), 햇빛 입자(mote)
 *   밤 : 별빛(star), 반딧불이(firefly), 가끔 유성(meteor)
 *
 * 테마가 바뀌면 각 그룹의 가중치(weight)를 1.5초 동안 보간해
 * 한쪽은 서서히 사라지고 다른 쪽은 서서히 나타난다.
 * 모션 감소 설정이 켜져 있으면 움직임 없이 정지된 한 장면만 그린다.
 */
(function (global, doc) {
  'use strict';

  var LIFE = global.LIFE;
  var TAU = Math.PI * 2;

  var COUNTS = { star: 140, firefly: 26, petal: 26, mote: 34 };

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{density?: number}} [options] density: 기본 개수 대비 배율 (1 = 타이틀 화면)
   */
  function createParticles(canvas, options) {
    var density = (options && options.density) || 1;
    var ctx = canvas.getContext('2d');
    var reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)');
    var w = 0;
    var h = 0;
    var dpr = 1;
    var items = [];
    var meteor = null;
    var raf = 0;
    var last = 0;

    // 0 = 낮, 1 = 밤
    var nightWeight = LIFE.theme.get() === 'night' ? 1 : 0;
    var nightTarget = nightWeight;

    /* ---------- 파티클 생성 ---------- */
    function spawn(kind, initial) {
      var p = { kind: kind, life: 0 };
      switch (kind) {
        case 'star':
          p.x = Math.random() * w;
          p.y = Math.pow(Math.random(), 1.6) * h * 0.75;
          p.r = rand(0.4, 1.5);
          p.phase = rand(0, TAU);
          p.speed = rand(0.6, 2.2);
          p.cross = Math.random() < 0.08; // 십자 반짝임
          break;
        case 'firefly':
          p.x = Math.random() * w;
          p.y = rand(h * 0.45, h * 0.98);
          p.r = rand(1.2, 2.6);
          p.angle = rand(0, TAU);
          p.v = rand(10, 24);
          p.phase = rand(0, TAU);
          p.hue = Math.random() < 0.65 ? 170 : 75; // 청록 / 연두
          break;
        case 'petal':
          p.x = rand(-0.1, 1.05) * w;
          p.y = initial ? Math.random() * h : rand(-0.15, -0.02) * h;
          p.size = rand(5, 10);
          p.rot = rand(0, TAU);
          p.spin = rand(-1.6, 1.6);
          p.vx = rand(18, 42);
          p.vy = rand(26, 54);
          p.sway = rand(0.6, 1.6);
          p.phase = rand(0, TAU);
          p.tint = Math.random() < 0.7 ? '255, 214, 226' : '255, 246, 236';
          break;
        case 'mote':
          p.x = Math.random() * w;
          p.y = initial ? Math.random() * h : h + 10;
          p.r = rand(1, 3.2);
          p.vy = rand(6, 16);
          p.phase = rand(0, TAU);
          break;
      }
      return p;
    }

    function populate() {
      items = [];
      Object.keys(COUNTS).forEach(function (kind) {
        var n = Math.round(COUNTS[kind] * density * Math.min(1.2, Math.max(0.45, (w * h) / (1440 * 900))));
        for (var i = 0; i < n; i++) items.push(spawn(kind, true));
      });
    }

    function resize() {
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      populate();
      if (reduceMotion.matches) drawStatic();
    }

    /* ---------- 업데이트 ---------- */
    function update(p, dt, t) {
      switch (p.kind) {
        case 'firefly':
          p.angle += rand(-1.2, 1.2) * dt;
          p.x += Math.cos(p.angle) * p.v * dt;
          p.y += Math.sin(p.angle) * p.v * 0.6 * dt;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < h * 0.35 || p.y > h + 10) p.angle += Math.PI;
          break;
        case 'petal':
          p.x += (p.vx + Math.sin(t * p.sway + p.phase) * 22) * dt;
          p.y += p.vy * dt;
          p.rot += p.spin * dt;
          if (p.y > h + 20 || p.x > w + 30) Object.assign(p, spawn('petal', false));
          break;
        case 'mote':
          p.y -= p.vy * dt;
          p.x += Math.sin(t * 0.5 + p.phase) * 6 * dt;
          if (p.y < -10) Object.assign(p, spawn('mote', false));
          break;
      }
    }

    /* ---------- 그리기 ---------- */
    function glow(x, y, r, color, alpha) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(' + color + ',' + alpha + ')');
      g.addColorStop(1, 'rgba(' + color + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    function draw(p, t, dayW, nightW) {
      var a;
      switch (p.kind) {
        case 'star':
          if (nightW <= 0.01) return;
          a = (0.55 + 0.45 * Math.sin(t * p.speed + p.phase)) * nightW;
          ctx.fillStyle = 'rgba(235, 245, 255,' + a + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, TAU);
          ctx.fill();
          if (p.cross) {
            ctx.strokeStyle = 'rgba(200, 240, 255,' + a * 0.6 + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x - p.r * 5, p.y);
            ctx.lineTo(p.x + p.r * 5, p.y);
            ctx.moveTo(p.x, p.y - p.r * 5);
            ctx.lineTo(p.x, p.y + p.r * 5);
            ctx.stroke();
          }
          break;
        case 'firefly':
          if (nightW <= 0.01) return;
          a = (0.35 + 0.65 * Math.max(0, Math.sin(t * 1.4 + p.phase))) * nightW;
          var c = p.hue === 170 ? '120, 255, 225' : '215, 255, 140';
          glow(p.x, p.y, p.r * 6, c, a * 0.45);
          ctx.fillStyle = 'rgba(' + c + ',' + a + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.7, 0, TAU);
          ctx.fill();
          break;
        case 'petal':
          if (dayW <= 0.01) return;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, 0.55 + 0.45 * Math.sin(t * 2 + p.phase)); // 팔랑임
          ctx.fillStyle = 'rgba(' + p.tint + ',' + 0.9 * dayW + ')';
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size * 0.9, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size * 0.9, 0, 0, -p.size);
          ctx.fill();
          ctx.restore();
          break;
        case 'mote':
          if (dayW <= 0.01) return;
          a = (0.35 + 0.4 * Math.sin(t * 1.1 + p.phase)) * dayW;
          glow(p.x, p.y, p.r * 4, '255, 236, 170', a);
          break;
      }
    }

    function drawMeteor(dt, nightW) {
      if (!meteor) {
        if (nightW > 0.9 && Math.random() < dt * 0.06) {
          meteor = { x: rand(w * 0.35, w), y: rand(0, h * 0.3), vx: -rand(520, 760), vy: rand(180, 260), life: 1 };
        }
        return;
      }
      meteor.x += meteor.vx * dt;
      meteor.y += meteor.vy * dt;
      meteor.life -= dt * 0.9;
      var tail = 0.12;
      var g = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail);
      g.addColorStop(0, 'rgba(230, 250, 255,' + meteor.life * nightW + ')');
      g.addColorStop(1, 'rgba(230, 250, 255, 0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail);
      ctx.stroke();
      if (meteor.life <= 0 || meteor.x < -50) meteor = null;
    }

    function render(t, dt) {
      ctx.clearRect(0, 0, w, h);
      var nightW = nightWeight;
      var dayW = 1 - nightWeight;
      for (var i = 0; i < items.length; i++) {
        if (dt) update(items[i], dt, t);
        draw(items[i], t, dayW, nightW);
      }
      if (dt) drawMeteor(dt, nightW);
    }

    function frame(now) {
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      // 테마 가중치 보간 (약 1.5초)
      if (nightWeight !== nightTarget) {
        var step = dt / (LIFE.theme.DURATION / 1000);
        nightWeight = nightTarget > nightWeight
          ? Math.min(nightTarget, nightWeight + step)
          : Math.max(nightTarget, nightWeight - step);
      }

      render(now / 1000, dt);
      raf = global.requestAnimationFrame(frame);
    }

    function drawStatic() {
      nightWeight = nightTarget;
      render(0, 0);
    }

    function start() {
      stop();
      if (reduceMotion.matches) {
        drawStatic();
        return;
      }
      last = 0;
      raf = global.requestAnimationFrame(frame);
    }

    function stop() {
      if (raf) global.cancelAnimationFrame(raf);
      raf = 0;
    }

    doc.addEventListener('life:themechange', function (e) {
      nightTarget = e.detail.theme === 'night' ? 1 : 0;
      if (reduceMotion.matches) drawStatic();
    });

    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) stop();
      else start();
    });

    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', start);
    global.addEventListener('resize', resize);

    resize();
    start();

    return { start: start, stop: stop };
  }

  LIFE.particles = { create: createParticles };
})(window, document);
