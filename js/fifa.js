// FIFA World Cup 2026 badge — rotate through top players / host nations
(function () {
  var txt = document.getElementById('fifaTxt');
  if (!txt) return;

  var items = [
    'FIFA WORLD CUP 2026',
    'MESSI',
    'RONALDO',
    'MBAPPÉ',
    'HAALAND',
    'USA · CAN · MEX',
    'KICK OFF ⚽'
  ];
  var i = 0;
  setInterval(function () {
    i = (i + 1) % items.length;
    txt.textContent = items[i];
  }, 2200);

  // Clicking the badge jumps to the mini-game section
  var badge = document.getElementById('fifaBadge');
  if (badge) {
    badge.addEventListener('click', function () {
      var t = document.getElementById('goal-game');
      if (t) {
        window.scrollTo({
          top: t.getBoundingClientRect().top + window.pageYOffset - 16,
          behavior: 'smooth'
        });
      }
    });
  }
})();

// "Score a Goal" mini-game — drag the ball back & release (slingshot)
(function () {
  var pitch = document.getElementById('gamePitch');
  if (!pitch) return;

  var ball = document.getElementById('gameBall');
  var keeper = document.getElementById('gameKeeper');
  var goalsEl = document.getElementById('gameGoals');
  var shotsEl = document.getElementById('gameShots');
  var msg = document.getElementById('gameMsg');
  var btns = document.querySelectorAll('.game-shoot-btn');

  // dashed aim line shown while pulling the ball back
  var line = document.createElement('div');
  line.className = 'game-aim-line';
  pitch.appendChild(line);

  var dirs = ['left', 'center', 'right'];
  var goals = 0, shots = 0, busy = false, aiming = false;
  var homeX = 0, homeY = 0;

  function dims() { return { W: pitch.clientWidth, H: pitch.clientHeight }; }
  function cornerX(dir) {
    var W = dims().W;
    return dir === 'left' ? W * 0.18 : dir === 'right' ? W * 0.82 : W * 0.5;
  }
  function goalY() { return dims().H * 0.20; }

  function setBall(x, y, scale, rot) {
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';
    ball.style.transform = 'translate(-50%,-50%) scale(' + scale + ') rotate(' + (rot || 0) + 'deg)';
  }
  function placeHome() {
    var d = dims();
    homeX = d.W / 2;
    homeY = d.H * 0.88;
    ball.style.transition = 'none';
    setBall(homeX, homeY, 1, 0);
  }

  function resolve(dir) {
    var keeperDir = dirs[Math.floor(Math.random() * 3)];
    keeper.style.left = cornerX(keeperDir) + 'px';

    ball.style.transition = 'left .45s ease, top .45s ease, transform .45s ease';
    setBall(cornerX(dir), goalY(), 0.7, 540);

    setTimeout(function () {
      if (keeperDir === dir) {
        msg.textContent = 'SAVED! 🧤';
        msg.className = 'game-msg saved';
      } else {
        goals++;
        goalsEl.textContent = goals;
        msg.textContent = 'GOAL!!! ⚽🔥';
        msg.className = 'game-msg scored';
      }
      setTimeout(function () {
        ball.style.transition = 'left .3s ease, top .3s ease, transform .3s ease';
        setBall(homeX, homeY, 1, 0);
        keeper.style.left = '50%';
        busy = false;
      }, 800);
    }, 470);
  }

  function shoot(dir) {
    if (busy) return;
    busy = true;
    shots++;
    shotsEl.textContent = shots;
    resolve(dir);
  }

  // ---- drag-to-kick (slingshot) ----
  function rel(e) {
    var r = pitch.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function onDown(e) {
    if (busy) return;
    aiming = true;
    ball.classList.add('pulling');
    pitch.classList.add('aiming');
    ball.style.transition = 'none';
    if (ball.setPointerCapture) { try { ball.setPointerCapture(e.pointerId); } catch (_) {} }
    e.preventDefault();
  }
  function onMove(e) {
    if (!aiming) return;
    var p = rel(e), d = dims();
    p.x = Math.max(8, Math.min(d.W - 8, p.x));
    p.y = Math.max(8, Math.min(d.H - 8, p.y));
    setBall(p.x, p.y, 0.92, 0);

    var dx = homeX - p.x, dy = homeY - p.y;            // launch vector (opposite of pull)
    var len = Math.sqrt(dx * dx + dy * dy);
    var ang = Math.atan2(dy, dx) * 180 / Math.PI;
    line.style.left = p.x + 'px';
    line.style.top = p.y + 'px';
    line.style.width = len + 'px';
    line.style.transform = 'rotate(' + ang + 'deg)';
    line.classList.add('show');

    var power = Math.min(Math.round((len / (d.H * 0.6)) * 100), 100);
    msg.textContent = 'POWER ' + power + '%';
    msg.className = 'game-msg';
    e.preventDefault();
  }
  function onUp(e) {
    if (!aiming) return;
    aiming = false;
    ball.classList.remove('pulling');
    pitch.classList.remove('aiming');
    line.classList.remove('show');

    var p = rel(e), d = dims();
    var dist = Math.abs(homeX - p.x) + Math.abs(homeY - p.y);
    if (dist < 18 || busy) { placeHome(); return; }   // tiny pull = no shot

    var dx = homeX - p.x;                              // slingshot: pull right -> shoot left
    var dir = dx < -d.W * 0.07 ? 'left' : dx > d.W * 0.07 ? 'right' : 'center';
    busy = true;
    shots++;
    shotsEl.textContent = shots;
    resolve(dir);
  }

  ball.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  for (var b = 0; b < btns.length; b++) {
    btns[b].addEventListener('click', function () {
      shoot(this.getAttribute('data-dir'));
    });
  }

  placeHome();
  window.addEventListener('resize', function () {
    if (!aiming && !busy) placeHome();
  });
})();
