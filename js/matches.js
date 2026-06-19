// FIFA World Cup 2026 — live fixtures & results (data: TheSportsDB, free key)
// Times are converted to IST (Asia/Kolkata).
(function () {
  var listEl = document.getElementById('matchList');
  if (!listEl) return;

  var KEY = '3';                 // TheSportsDB free/test key
  var LEAGUE = '4429';           // FIFA World Cup
  var SEASON = '2026';
  var base = 'https://www.thesportsdb.com/api/v1/json/' + KEY + '/';
  var urls = [
    base + 'eventsseason.php?id=' + LEAGUE + '&s=' + SEASON,
    base + 'eventsnextleague.php?id=' + LEAGUE,
    base + 'eventspastleague.php?id=' + LEAGUE
  ];

  var tabs = document.querySelectorAll('.match-tab');
  var all = [];
  var current = 'upcoming';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function istString(ts) {
    if (!ts) return 'TBD';
    var d = new Date(ts.replace(' ', 'T') + 'Z'); // TheSportsDB timestamps are UTC
    if (isNaN(d.getTime())) return 'TBD';
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short', day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true
    }) + ' IST';
  }

  function finished(m) {
    var hs = m.intHomeScore;
    if (hs !== null && hs !== '' && hs !== undefined) return true;
    var st = (m.strStatus || '').toLowerCase();
    return st === 'ft' || st === 'match finished' || st === 'aet' || st === 'pen';
  }

  function badge(url, alt) {
    return url
      ? '<img class="match-badge" src="' + esc(url) + '" alt="' + esc(alt) + '" loading="lazy">'
      : '<span class="match-badge match-badge--ph">⚽</span>';
  }

  function row(m) {
    var fin = finished(m);
    var mid = fin
      ? '<span class="match-score">' + esc(m.intHomeScore || 0) + ' - ' + esc(m.intAwayScore || 0) + '</span>'
        + '<span class="match-time">FULL TIME</span>'
      : '<span class="match-vs">VS</span>'
        + '<span class="match-time">' + esc(istString(m.strTimestamp)) + '</span>';

    var venue = m.strVenue
      ? '📍 ' + esc(m.strVenue) + (m.strCity ? ', ' + esc(m.strCity) : '')
      : '';
    var meta = fin
      ? (venue ? venue + ' · ' : '') + esc(istString(m.strTimestamp))
      : venue;

    return '<div class="match-row">'
      + '<div class="match-team match-team--home"><span class="match-team__name">'
        + esc(m.strHomeTeam) + '</span>' + badge(m.strHomeTeamBadge, m.strHomeTeam) + '</div>'
      + '<div class="match-mid">' + mid + '</div>'
      + '<div class="match-team match-team--away">' + badge(m.strAwayTeamBadge, m.strAwayTeam)
        + '<span class="match-team__name">' + esc(m.strAwayTeam) + '</span></div>'
      + (meta ? '<div class="match-meta">' + meta + '</div>' : '')
      + '</div>';
  }

  function render() {
    var items = all.filter(function (m) {
      return current === 'past' ? finished(m) : !finished(m);
    });
    items.sort(function (a, b) {
      return String(a.strTimestamp || '').localeCompare(String(b.strTimestamp || ''));
    });
    if (current === 'past') items.reverse(); // most recent result first

    if (!items.length) {
      listEl.innerHTML = '<div class="match-empty">No '
        + (current === 'past' ? 'results' : 'upcoming matches')
        + ' available right now. Check back soon ⚽</div>';
      return;
    }
    listEl.innerHTML = items.map(row).join('');
  }

  function merge(results) {
    var seen = {};
    results.forEach(function (d) {
      var evs = (d && d.events) || [];
      evs.forEach(function (e) {
        var id = e.idEvent || (e.strEvent + e.dateEvent);
        if (!seen[id]) seen[id] = e;
      });
    });
    return Object.keys(seen).map(function (k) { return seen[k]; });
  }

  Promise.all(urls.map(function (u) {
    return fetch(u).then(function (r) { return r.json(); }).catch(function () { return {}; });
  })).then(function (results) {
    all = merge(results);
    render();
  }).catch(function () {
    listEl.innerHTML = '<div class="match-empty">Could not load match data. Please try again later.</div>';
  });

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () {
      for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove('active');
      this.classList.add('active');
      current = this.getAttribute('data-tab');
      render();
    });
  }
})();
