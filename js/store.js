// Прогресс игрока в localStorage: рекорды, опыт, серия дней, освоение слов.
(function () {
  const KEY = 'slovopad.v1';
  const DAILY_GOAL = 40;

  const TITLES = ['Новичок', 'Ученик', 'Знаток слов', 'Говорун', 'Полиглот', 'Лингвист', 'Мастер слов', 'Профессор', 'Легенда'];

  function today() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function dayDiff(a, b) {
    return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
  }

  const defaults = () => ({
    best: 0, totalWords: 0, games: 0, xp: 0, bestCombo: 0, bestLevel: 0, golden: 0,
    streak: { last: '', days: 0 },
    daily: { day: '', count: 0 },
    ach: {},
    mastery: {},
    settings: { voices: null, rate: 0.95, repeats: 4, sfx: 0.5 },
  });

  let data = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      data = Object.assign(defaults(), saved);
      data.settings = Object.assign(defaults().settings, saved.settings || {});
    }
  } catch (e) {}

  const Store = {
    data,
    DAILY_GOAL,

    save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} },

    // Опыт → уровень игрока. На переход n→n+1 нужно 60 + 35·(n−1) XP.
    need(n) { return 60 + 35 * (n - 1); },
    levelInfo(xp = data.xp) {
      let lvl = 1, rest = xp;
      while (rest >= this.need(lvl)) { rest -= this.need(lvl); lvl++; }
      return { lvl, into: rest, need: this.need(lvl), title: TITLES[Math.min(TITLES.length - 1, Math.floor((lvl - 1) / 3))] };
    },

    daily() {
      if (data.daily.day !== today()) data.daily = { day: today(), count: 0 };
      return data.daily;
    },

    // Отметить день игры: серия растёт, если играли вчера.
    touchStreak() {
      const t = today();
      const s = data.streak;
      if (s.last === t) return s.days;
      s.days = s.last && dayDiff(s.last, t) === 1 ? s.days + 1 : 1;
      s.last = t;
      this.save();
      return s.days;
    },
    streakDays() {
      const s = data.streak;
      if (!s.last) return 0;
      return dayDiff(s.last, today()) <= 1 ? s.days : 0;
    },

    mastery(word) { return data.mastery[word] || { c: 0, w: 0, t: 0 }; },
    // 0..3 звезды: сколько раз подряд-ish слово разложено правильно.
    stars(word) {
      const m = data.mastery[word];
      if (!m) return 0;
      const net = m.c - m.w * 2;
      return net >= 6 ? 3 : net >= 3 ? 2 : m.c > 0 ? 1 : 0;
    },
    markWord(word, ok) {
      const m = data.mastery[word] || { c: 0, w: 0, t: 0 };
      if (ok) m.c++; else m.w++;
      m.t = Date.now();
      data.mastery[word] = m;
    },
    learnedCount() { return Object.keys(data.mastery).filter(w => this.stars(w) >= 1).length; },

    unlock(id) {
      if (data.ach[id]) return false;
      data.ach[id] = Date.now();
      this.save();
      return true;
    },
  };

  window.Store = Store;
})();
