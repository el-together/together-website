/* together.day v2 — home: the "Made for" examples and the AI switch. Vanilla JS, no libraries.
   Everything fails soft: a missing element is skipped and the page keeps its no-JS content. */
(function () {
  'use strict';

  var MODE_KEY = 'together-home-mode';

  // The seven examples (BRIEF §6). Names and numbers are examples.
  var DATA = {
    all: {
      chip: 'All groups', card: null, name: 'Acting Workshop', icon: 'masks', color: '#7c3aed', members: 16,
      next: ['Thu · 18:00', 'Scene 3 rehearsal'],
      tools: [['calendar', 'Rehearsals', 'Tue & Thu · 18:00'], ['checklist', 'Scenes to learn', '4 of 7 ready'],
        ['list', 'Who brings what', '3 open'], ['chat', 'Group chat', '2 new']],
      prompt: 'Set up our acting workshop in Together: rehearsals Tuesday and Thursday at 18:00 until 12 October, a list of the 7 scenes, and who brings what. Invite the cast from this list.',
      result: ['Calendar: every rehearsal until 12 Oct', 'Checklist: 7 scenes to learn', 'List: who brings what',
        'Group chat, with your AI in it', '16 people invited by text']
    },
    courses: {
      chip: 'Courses', card: 'Courses & workshops', name: 'Pottery Course', icon: 'pallete-2', color: '#ea580c', members: 12,
      next: ['Tue · 18:00', 'Session 4: glazing'],
      tools: [['calendar', 'Sessions', 'Every Tue · 18:00'], ['checklist', 'Materials', '2 to buy'],
        ['info', 'Useful info', 'Studio address'], ['chat', 'Class chat', '5 new']],
      prompt: 'Set up our pottery course in Together: sessions every Tuesday at 18:00 until 8 December, the materials to buy, and the studio address. Invite the class from this list.',
      result: ['Calendar: every session until 8 Dec', 'Checklist: materials to buy', 'Useful info: the studio address',
        'Class chat, with your AI in it', '12 people invited by text']
    },
    events: {
      chip: 'Events', card: 'Events & hackathons', name: 'Hack Weekend', icon: 'code-square', color: '#0891b2', members: 34,
      next: ['Fri · 18:30', 'Kick-off and team pitches'],
      tools: [['calendar', 'Schedule', 'Fri to Sun'], ['list', 'Teams', '6 teams'],
        ['info', 'Rules & Wi-Fi', 'Pinned'], ['chat', 'Everyone', '12 new']],
      prompt: 'Set up our hack weekend in Together: the schedule from Friday to Sunday, a list of the 6 teams, and the rules and Wi-Fi, pinned. Invite everyone from this list.',
      result: ['Calendar: the schedule, Fri to Sun', 'List: 6 teams', 'Useful info: rules and Wi-Fi, pinned',
        'Group chat, with your AI in it', '34 people invited by text']
    },
    weddings: {
      chip: 'Weddings', card: 'Weddings & celebrations', name: "Sam & Alex's Wedding", icon: 'rings-jewel', color: '#db2777', members: 9,
      next: ['Sat · 16:00', 'Ceremony in the garden'],
      tools: [['calendar', 'Timeline', 'Sat 14:00 to late'], ['list', 'Guests', '86 confirmed'],
        ['checklist', 'Who does what', '5 open'], ['chat', 'Helpers', '3 new']],
      prompt: "Set up Sam and Alex's wedding in Together: the timeline for Saturday from 14:00 to late, the guest list, and who does what. Invite the helpers from this list.",
      result: ['Calendar: the timeline, Sat 14:00 to late', 'List: the guests', 'Checklist: who does what',
        'Helpers chat, with your AI in it', '9 people invited by text']
    },
    trips: {
      chip: 'Trips', card: 'Trips', name: 'Lisbon Trip', icon: 'plane', color: '#0284c7', members: 4,
      next: ['Fri · 09:40', 'Flight to Lisbon'],
      tools: [['calendar', 'Day by day', '20 to 22 Nov'], ['checklist', 'Packing list', '12 items'],
        ['expenses', 'Shared costs', 'Split 4 ways'], ['chat', 'Trip chat', '4 new']],
      prompt: 'Set up our Lisbon trip in Together: day by day from 20 to 22 November, a packing list, and shared costs split 4 ways. Invite everyone from this list.',
      result: ['Calendar: day by day, 20 to 22 Nov', 'Checklist: packing list', 'Expenses: shared costs, split 4 ways',
        'Trip chat, with your AI in it', '4 people invited by text']
    },
    teams: {
      chip: 'Teams', card: 'Bands, clubs & teams', name: 'Thursday Band', icon: 'music-note', color: '#16a34a', members: 5,
      next: ['Thu · 20:00', 'Rehearsal at the studio'],
      tools: [['calendar', 'Rehearsals', 'Every Thu · 20:00'], ['list', 'Setlist', '14 songs'],
        ['checklist', 'Gear', 'Who brings what'], ['chat', 'Band chat', '1 new']],
      prompt: 'Set up our band in Together: rehearsals every Thursday at 20:00 at the studio, the setlist of 14 songs, and who brings what gear. Invite the band from this list.',
      result: ['Calendar: every rehearsal, Thu at 20:00', 'List: setlist, 14 songs', 'Checklist: gear, who brings what',
        'Band chat, with your AI in it', '5 people invited by text']
    },
    family: {
      chip: 'Family', card: 'Home & family', name: 'Our Home', icon: 'home-heart', color: '#d97706', members: 4,
      next: ['Sat · 10:00', 'The plumber comes'],
      tools: [['calendar', 'Home calendar', '3 this week'], ['checklist', "To-do's", '5 open'],
        ['list', 'Groceries', '8 items'], ['chat', 'House chat', '2 new']],
      prompt: "Set up our home in Together: a shared calendar with the plumber on Saturday at 10:00, our to-do's, and a grocery list. Invite the family from this list.",
      result: ['Calendar: the plumber, Sat at 10:00', "Checklist: our to-do's", 'List: groceries',
        'House chat, with your AI in it', '4 people invited by text']
    }
  };

  var hero = document.querySelector('.hero');
  if (!hero) return;
  var toggle = hero.querySelector('.switch[role="switch"]');

  function each(selector, root, fn) { Array.prototype.forEach.call(root.querySelectorAll(selector), fn); }
  function hook(name) { return hero.querySelector('[data-v="' + name + '"]'); }
  function setText(name, value) { var el = hook(name); if (el) el.textContent = value; }
  function swap(el) { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); } // restart the animation

  // (b) A chip or a "Who it's for" card picks the example. The headline never changes.
  function setVertical(key) {
    var d = DATA[key];
    if (!d) return;
    setText('pname', d.name);
    setText('pmembers', String(d.members));
    setText('nextWhen', d.next[0]);
    setText('nextWhat', d.next[1]);
    setText('prompt', d.prompt);
    var color = hook('pcolor'), icon = hook('picon'), tools = hook('tools'), list = hook('result');
    if (color) color.style.background = d.color;
    if (icon) icon.src = '/assets/projects/' + d.icon + '.svg';
    if (tools) each('.p-row', tools, function (row, i) {
      var t = d.tools[i], img = row.querySelector('img'), title = row.querySelector('b'), line = row.querySelector('small');
      if (!t) return;
      if (img) img.src = '/assets/tools/' + t[0] + '.svg';
      if (title) title.textContent = t[1];
      if (line) line.textContent = t[2];
    });
    if (list) {
      list.textContent = '';
      d.result.forEach(function (text) {
        var li = list.appendChild(document.createElement('li'));
        li.innerHTML = '<span class="check" aria-hidden="true"></span>';
        li.appendChild(document.createTextNode(text));
      });
    }
    each('[data-vertical]', document, function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-vertical') === key ? 'true' : 'false');
    });
    each('.p-head, .p-next, .p-rows, .prompt, .result', hero, swap);
  }

  // After a card click: focus the matching chip and bring the changed example into view.
  function showInHero(key) {
    var chip = null;
    each('.chip[data-vertical]', hero, function (c) { if (c.getAttribute('data-vertical') === key) chip = c; });
    if (chip) {
      chip.focus({ preventScroll: true });
      var row = chip.parentNode; // the chips row scrolls sideways on phones
      row.scrollLeft += chip.getBoundingClientRect().left - row.getBoundingClientRect().left - 16;
    }
    (hero.querySelector('.hero-grid > [data-only]:not([hidden])') || hero).scrollIntoView({ block: 'start' });
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest ? event.target.closest('[data-vertical]') : null;
    if (!btn) return;
    setVertical(btn.getAttribute('data-vertical'));
    if (btn.classList.contains('vcard')) showInHero(btn.getAttribute('data-vertical'));
  });

  // (c) The AI switch. Only the hero changes: its data-mode and its [data-only] elements.
  function setMode(mode, remember) {
    var ai = mode === 'ai';
    hero.setAttribute('data-mode', ai ? 'ai' : 'normal');
    each('[data-only]', hero, function (el) { el.hidden = el.getAttribute('data-only') !== (ai ? 'ai' : 'normal'); });
    if (toggle) toggle.setAttribute('aria-checked', ai ? 'true' : 'false');
    if (remember) {
      try { window.localStorage.setItem(MODE_KEY, ai ? 'ai' : 'normal'); } catch (e) { /* storage blocked: the switch still works */ }
    }
  }

  if (toggle) toggle.addEventListener('click', function () {
    setMode(hero.getAttribute('data-mode') === 'ai' ? 'normal' : 'ai', true);
    each('[data-only]:not([hidden])', hero, swap);
  });

  var saved = null;
  try { saved = window.localStorage.getItem(MODE_KEY); } catch (e) { /* no storage: start in normal mode */ }
  if (location.hash === '#ai' || saved === 'ai') setMode('ai', false);
  window.addEventListener('hashchange', function () { if (location.hash === '#ai') setMode('ai', false); });
})();
