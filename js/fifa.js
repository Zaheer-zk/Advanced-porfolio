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
})();

// "Score a Goal" mini-game
(function () {
  var pitch = document.getElementById('gamePitch');
  if (!pitch) return;

  var ball = document.getElementById('gameBall');
  var keeper = document.getElementById('gameKeeper');
  var goalsEl = document.getElementById('gameGoals');
  var shotsEl = document.getElementById('gameShots');
  var msg = document.getElementById('gameMsg');
  var btns = document.querySelectorAll('.game-shoot-btn');

  var pos = { left: '18%', center: '50%', right: '82%' };
  var dirs = ['left', 'center', 'right'];
  var goals = 0, shots = 0, busy = false;

  function shoot(dir) {
    if (busy) return;
    busy = true;
    shots++;
    shotsEl.textContent = shots;

    var keeperDir = dirs[Math.floor(Math.random() * 3)];
    keeper.style.left = pos[keeperDir];

    ball.style.transition = 'left .45s ease, bottom .45s ease, transform .45s ease';
    ball.style.left = pos[dir];
    ball.style.bottom = '74%';
    ball.style.transform = 'translate(-50%, 0) scale(.7) rotate(540deg)';

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
      // reset for the next shot
      setTimeout(function () {
        ball.style.transition = 'left .3s ease, bottom .3s ease, transform .3s ease';
        ball.style.left = '50%';
        ball.style.bottom = '6%';
        ball.style.transform = 'translate(-50%, 0) scale(1)';
        keeper.style.left = '50%';
        busy = false;
      }, 800);
    }, 470);
  }

  for (var b = 0; b < btns.length; b++) {
    btns[b].addEventListener('click', function () {
      shoot(this.getAttribute('data-dir'));
    });
  }
})();
