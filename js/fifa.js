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
