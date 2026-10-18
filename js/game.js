// Словопад — игровая логика.
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const D = Store.data;
  const CATS = window.CATEGORIES;
  const CAT_BY_ID = Object.fromEntries(CATS.map(c => [c.id, c]));
  const TIER = {};
  for (const t of [1, 2]) window.WORD_TIERS[t].split(' ').forEach(w => { TIER[w] = t; });
  const ALL_WORDS = CATS.flatMap(c => c.words.map(([w, ru]) => ({ w, ru, cat: c.id, tier: TIER[w] || 3 })));
  const EXTRA_WORDS = window.EXTRA_WORDS.map(([w, ru, tier]) => ({ w, ru, cat: null, tier }));
  const TR_WORDS = ALL_WORDS.concat(EXTRA_WORDS);
  const SYN = {};
  window.SYNONYMS.forEach(g => {
    const ws = g.split(' ');
    ws.forEach(a => { SYN[a] = SYN[a] || new Set(); ws.forEach(b => { if (b !== a) SYN[a].add(b); }); });
  });
  const TIER_LABEL = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1' };
  const TR_COLORS = ['#f2a65a', '#7fb7e8', '#9ad48a', '#c792ea', '#ef6f6c'];
  const MODES = { category: 'Категории', translate: 'Перевод' };
  const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const WORDS_PER_LEVEL = 8;
  const MAX_LIVES = 5;

  const POWERS = {
    slow:   { tag: '❄', name: 'Замедление', desc: 'следующие 5 слов падают медленнее' },
    double: { tag: '×2', name: 'Двойные очки', desc: '15 секунд' },
    heart:  { tag: '♥', name: 'Жизнь', desc: '+1 сердце' },
    shield: { tag: '◈', name: 'Щит', desc: 'одна ошибка не считается' },
  };

  const ACH = [
    { id: 'first',    icon: '🌱', name: 'Первое слово',     desc: 'Разложи первое слово' },
    { id: 'combo10',  icon: '🔥', name: 'В ударе',          desc: '10 слов подряд без ошибок' },
    { id: 'combo25',  icon: '☄️', name: 'Неудержимый',       desc: '25 слов подряд' },
    { id: 'combo50',  icon: '👑', name: 'Безупречный',      desc: '50 слов подряд' },
    { id: 'score1k',  icon: '⭐', name: 'Тысячник',         desc: '1 000 очков за игру' },
    { id: 'score5k',  icon: '🌟', name: 'Звезда',           desc: '5 000 очков за игру' },
    { id: 'score15k', icon: '💫', name: 'Суперзвезда',      desc: '15 000 очков за игру' },
    { id: 'level5',   icon: '🚀', name: 'Разгон',           desc: 'Дойди до 5 уровня' },
    { id: 'level10',  icon: '🛸', name: 'Скорость света',   desc: 'Дойди до 10 уровня' },
    { id: 'perfect',  icon: '💎', name: 'Чистый уровень',   desc: 'Пройди уровень без ошибок' },
    { id: 'fast10',   icon: '⚡', name: 'Молния',           desc: '10 молниеносных бросков за игру' },
    { id: 'gold5',    icon: '🏅', name: 'Золотоискатель',   desc: '5 золотых слов за игру' },
    { id: 'words100', icon: '📗', name: 'Сотня',            desc: '100 слов за всё время' },
    { id: 'words500', icon: '📚', name: 'Книжный червь',    desc: '500 слов за всё время' },
    { id: 'words2k',  icon: '🏛', name: 'Библиотека',       desc: '2 000 слов за всё время' },
    { id: 'goal',     icon: '🎯', name: 'Цель дня',         desc: 'Выполни дневную цель' },
    { id: 'streak3',  icon: '📅', name: 'Привычка',         desc: '3 дня подряд' },
    { id: 'streak7',  icon: '🗓', name: 'Неделя',           desc: '7 дней подряд' },
  ];
  const ACH_BY_ID = Object.fromEntries(ACH.map(a => [a.id, a]));

  // ---------- DOM ----------
  const app = $('app'), field = $('field'), basketsEl = $('baskets');
  const fx = $('fx'), fctx = fx.getContext('2d');
  const bg = $('bg'), bctx = bg.getContext('2d');

  // ---------- Состояние ----------
  const G = {
    state: 'menu',      // menu | intro | playing | paused | over
    mode: 'category',   // category — корзины-темы, translate — корзины-переводы
    score: 0, lives: 3, level: 1, combo: 0, bestCombo: 0,
    inLevel: 0, levelMistakes: 0, correct: 0, wrong: 0,
    word: null, baskets: [], recent: [], review: [],
    buffs: { slow: 0, double: 0, shield: 0 },
    ok: [], bad: [], fast: 0, golden: 0, voiceIdx: 0,
    timer: null, xpBefore: 0, dailyBefore: 0, newRecordShown: false,
  };

  // ---------- Утилиты ----------
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  const fmt = n => n.toLocaleString('ru-RU').replace(/\s/g, '\u2009');
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function later(fn, ms) { clearTimeout(G.timer); G.timer = setTimeout(fn, ms); }
  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  // ---------- Размеры ----------
  let W = 0, H = 0, FW = 0, FH = 0, DPR = 1, centers = [];
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = app.clientWidth; H = app.clientHeight;
    for (const c of [fx, bg]) { c.width = W * DPR; c.height = H * DPR; }
    fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    bctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    FW = field.clientWidth; FH = field.clientHeight;
    measureBaskets();
  }
  function measureBaskets() {
    const fr = field.getBoundingClientRect();
    centers = [...basketsEl.children].map(b => { const r = b.getBoundingClientRect(); return r.left - fr.left + r.width / 2; });
  }
  function maxBaskets() { return W < 520 ? 4 : 5; }
  function basketCount(level) {
    if (G.mode === 'translate') return Math.min(maxBaskets(), level <= 1 ? 2 : level <= 3 ? 3 : level <= 6 ? 4 : 5);
    return Math.min(maxBaskets(), level <= 2 ? 3 : level <= 5 ? 4 : 5);
  }
  // Какие уровни сложности слов падают в режиме «Перевод».
  function tierRange(level) {
    if (level <= 2) return [1, 1];
    if (level <= 4) return [1, 2];
    if (level <= 6) return [2, 3];
    if (level <= 8) return [3, 4];
    if (level <= 10) return [4, 5];
    return [4, 5];
  }

  // ---------- Фон: медленный дождь из букв ----------
  const glyphs = [];
  function initBg() {
    glyphs.length = 0;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const n = Math.round(Math.min(60, W * H / 18000));
    for (let i = 0; i < n; i++) glyphs.push({ ch: pick(letters), x: rand(0, W), y: rand(-H, H), z: rand(0.3, 1), r: rand(-0.4, 0.4) });
  }
  function drawBg(dt) {
    bctx.clearRect(0, 0, W, H);
    const fever = G.combo >= 10 && G.state === 'playing';
    for (const g of glyphs) {
      if (!REDUCED) g.y += dt * (14 + 40 * g.z) * (fever ? 2.2 : 1);
      if (g.y > H + 40) { g.y = -40; g.x = rand(0, W); }
      bctx.save();
      bctx.translate(g.x, g.y); bctx.rotate(g.r);
      bctx.font = `700 ${Math.round(14 + 30 * g.z)}px Unbounded, sans-serif`;
      bctx.fillStyle = fever ? `rgba(255,181,71,${0.05 + 0.08 * g.z})` : `rgba(245,236,217,${0.025 + 0.05 * g.z})`;
      bctx.fillText(g.ch, 0, 0);
      bctx.restore();
    }
  }

  // ---------- Частицы ----------
  const parts = [];
  function burst(x, y, color, n = 26, power = 1) {
    if (REDUCED) n = Math.min(n, 8);
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), s = rand(120, 420) * power;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 180 * power, life: rand(0.5, 1.1), t: 0, size: rand(3, 7), color, rot: rand(0, 6), vr: rand(-10, 10), sq: Math.random() < 0.5 });
    }
  }
  function drawFx(dt) {
    fctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.t += dt;
      if (p.t >= p.life) { parts.splice(i, 1); continue; }
      p.vy += 900 * dt; p.vx *= 0.99;
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      fctx.globalAlpha = 1 - p.t / p.life;
      fctx.fillStyle = p.color;
      fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.rot);
      if (p.sq) fctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else { fctx.beginPath(); fctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); fctx.fill(); }
      fctx.restore();
    }
    fctx.globalAlpha = 1;
  }
  // Координаты поля → координаты приложения (для частиц).
  function toApp(x, y) {
    const fr = field.getBoundingClientRect(), ar = app.getBoundingClientRect();
    return [x + fr.left - ar.left, y + fr.top - ar.top];
  }

  // ---------- HUD ----------
  function best() { return D.bests[G.mode] || 0; }
  function mult() { return Math.min(5, 1 + Math.floor(G.combo / 5)); }
  function renderHud() {
    $('score').textContent = fmt(G.score);
    $('hudBest').textContent = fmt(Math.max(best(), G.score));
    $('mult').textContent = '×' + mult() * (G.buffs.double > 0 ? 2 : 1);
    $('comboTxt').textContent = 'комбо ' + G.combo;
    const cb = $('comboBox');
    cb.classList.toggle('hot', G.combo >= 5);
    cb.classList.toggle('fire', G.combo >= 15);
    document.body.classList.toggle('fever', G.combo >= 10);
    $('lvl').textContent = G.level;
    $('lvlFill').style.width = (G.inLevel / WORDS_PER_LEVEL * 100) + '%';
    renderLives();
    renderBuffs();
  }
  function renderLives(lostIndex = -1) {
    const box = $('lives');
    const n = Math.max(3, G.lives);
    let html = '';
    for (let i = 0; i < n; i++) html += `<span class="h${i < G.lives ? '' : ' off'}${i === lostIndex ? ' lost' : ''}">♥</span>`;
    box.innerHTML = html;
  }
  function renderBuffs() {
    const b = G.buffs, out = [];
    if (b.slow > 0) out.push(`<span class="buff slow">❄ замедление · ${b.slow}</span>`);
    if (b.double > 0) out.push(`<span class="buff double">×2 очки · ${Math.ceil(b.double)}с</span>`);
    if (b.shield > 0) out.push(`<span class="buff shield">◈ щит</span>`);
    const html = out.join('');
    if ($('buffs').innerHTML !== html) $('buffs').innerHTML = html;
  }
  function bumpScore() {
    const s = $('score');
    s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');
  }

  // ---------- Корзины ----------
  function chooseCategories(n) {
    const prev = new Set(G.baskets.map(c => c.id));
    // Чуть чаще берём категории, которых не было в прошлом уровне.
    const pool = shuffle(CATS.slice()).sort((a, b) => (prev.has(a.id) ? 1 : 0) - (prev.has(b.id) ? 1 : 0) + rand(-0.6, 0.6));
    return pool.slice(0, n);
  }
  // anim: 'enter' — въезд снизу (новый уровень), 'swap' — быстрая смена надписей.
  function renderBaskets(anim) {
    basketsEl.innerHTML = '';
    basketsEl.classList.toggle('trmode', G.mode === 'translate');
    G.baskets.forEach((c, i) => {
      const b = el('button', 'basket' + (anim ? ' ' + anim : ''));
      b.style.setProperty('--c', c.color);
      if (anim) b.style.animationDelay = (i * (anim === 'enter' ? 0.06 : 0.03)) + 's';
      if (c.en) {
        b.setAttribute('aria-label', `${c.en} — ${c.ru}`);
        b.innerHTML = `<span class="key">${i + 1}</span><span class="ic">${c.icon}</span><span class="en">${esc(c.en)}</span><span class="ru">${esc(c.ru)}</span>`;
      } else {
        b.setAttribute('aria-label', c.ru);
        b.innerHTML = `<span class="key">${i + 1}</span><span class="tr">${esc(c.ru)}</span>`;
      }
      b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); commit(i); });
      basketsEl.appendChild(b);
    });
    measureBaskets();
  }
  function placeholderBaskets(n) {
    return Array.from({ length: n }, (_, i) => ({ id: '', ru: '?', color: TR_COLORS[i % TR_COLORS.length] }));
  }
  // Режим «Перевод»: правильный перевод + похожие по уровню (а позже и по теме) ловушки.
  function translationBaskets(e, n) {
    const [lo, hi] = tierRange(G.level);
    const chosen = [e];
    const clash = x => x.w === e.w || chosen.some(c => c.ru === x.ru || c.w === x.w || (SYN[c.w] && SYN[c.w].has(x.w)));
    const sameCat = TR_WORDS.filter(x => e.cat && x.cat === e.cat && x.tier >= lo - 1 && x.tier <= hi + 1);
    const near = TR_WORDS.filter(x => x.tier >= lo - 1 && x.tier <= hi + 1);
    const share = G.level >= 7 ? 0.6 : G.level >= 4 ? 0.35 : 0.1;
    for (let tries = 0; chosen.length < n && tries < 300; tries++) {
      const src = tries > 200 ? TR_WORDS : (Math.random() < share && sameCat.length > n ? sameCat : near);
      const x = pick(src);
      if (!clash(x)) chosen.push(x);
    }
    return shuffle(chosen).map((x, i) => ({ id: x.w, ru: x.ru, color: TR_COLORS[i % TR_COLORS.length] }));
  }
  function markTarget() {
    const col = G.word ? G.word.col : null;
    [...basketsEl.children].forEach((b, i) => b.classList.toggle('target', i === col && G.word && G.word.state === 'falling'));
  }
  function flashBasket(i, cls) {
    const b = basketsEl.children[i];
    if (!b) return;
    b.classList.remove(cls); void b.offsetWidth; b.classList.add(cls);
    setTimeout(() => b.classList.remove(cls), 900);
  }

  // ---------- Выбор слова ----------
  function nextEntry() {
    G.review.forEach(r => r.due--);
    let pool;
    if (G.mode === 'translate') {
      const ri = G.review.findIndex(r => r.due <= 0);
      if (ri >= 0) return G.review.splice(ri, 1)[0].e;
      const [lo, hi] = tierRange(G.level);
      pool = TR_WORDS.filter(e => e.tier >= lo && e.tier <= hi && !G.recent.includes(e.w));
    } else {
      const ids = new Set(G.baskets.map(c => c.id));
      const ri = G.review.findIndex(r => r.due <= 0 && ids.has(r.e.cat));
      if (ri >= 0) return G.review.splice(ri, 1)[0].e;
      pool = ALL_WORDS.filter(e => ids.has(e.cat) && !G.recent.includes(e.w));
    }
    // Слова, которые знаешь хуже, выпадают чаще.
    let total = 0;
    const weights = pool.map(e => { const w = 1 + (3 - Store.stars(e.w)) * 1.2; total += w; return w; });
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }

  function fallDuration(entry) {
    let d = Math.max(2.3, 7.4 * Math.pow(0.9, G.level - 1)) + entry.w.length * 0.05;
    if (G.buffs.slow > 0) d *= 1.6;
    return d;
  }

  // ---------- Падающее слово ----------
  function spawn() {
    if (G.state !== 'playing') return;
    const e = nextEntry();
    G.recent.push(e.w); if (G.recent.length > 12) G.recent.shift();
    if (G.mode === 'translate') {
      G.baskets = translationBaskets(e, basketCount(G.level));
      renderBaskets('swap');
    }

    let power = null, golden = false;
    if (G.level >= 2 || G.correct >= 5) {
      const r = Math.random();
      if (r < 0.07) golden = true;
      else if (r < 0.17) {
        const opts = ['slow', 'double', 'shield'];
        if (G.lives < MAX_LIVES) opts.push('heart', 'heart');
        power = pick(opts);
      }
    }

    const node = el('div', 'word' + (golden ? ' golden' : ''));
    node.textContent = e.w;
    if (golden) node.appendChild(el('span', 'tag', '✦'));
    if (power) node.appendChild(el('span', 'tag ' + power, POWERS[power].tag));
    field.appendChild(node);
    const ww = node.offsetWidth, wh = node.offsetHeight;

    G.word = {
      e, node, ww, wh, golden, power,
      answer: G.mode === 'translate' ? e.w : e.cat,
      t: 0, dur: fallDuration(e), col: null,
      x: FW / 2, y: -wh, rot: rand(-4, 4),
      state: 'falling',
    };
    place(G.word);
    markTarget();
    Voices.speakLoop(e.w, G.voiceIdx++);
  }

  function place(w) {
    const sway = REDUCED ? 0 : Math.sin(w.t * 9) * 1.5;
    w.node.style.transform = `translate(${w.x - w.ww / 2}px, ${w.y}px) rotate(${w.rot + sway}deg)`;
  }

  function moveCol(dir) {
    const w = G.word;
    if (!w || w.state !== 'falling') return;
    const n = G.baskets.length;
    let c;
    if (w.col == null) {
      // Первое нажатие: ближайшая корзина к центру в нужную сторону.
      const mid = (n - 1) / 2;
      c = dir < 0 ? Math.floor(mid - 0.01) : Math.ceil(mid + 0.01);
      if (n % 2 === 1) c = mid + dir;
    } else c = w.col + dir;
    c = Math.max(0, Math.min(n - 1, c));
    if (c !== w.col) { w.col = c; Sfx.move(); markTarget(); }
  }
  function nearestCol(x) {
    if (!centers.length) return null;
    let best = 0, bd = Infinity;
    centers.forEach((cx, i) => { const d = Math.abs(cx - x); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function setColAt(x) {
    const w = G.word;
    if (!w || w.state !== 'falling' || !centers.length) return;
    let best = 0, bd = Infinity;
    centers.forEach((cx, i) => { const d = Math.abs(cx - x); if (d < bd) { bd = d; best = i; } });
    if (best !== w.col) { w.col = best; Sfx.move(); markTarget(); }
  }

  // Бросить слово в корзину (тап по корзине, цифра, ↓).
  function commit(col) {
    const w = G.word;
    if (G.state !== 'playing' || !w || w.state !== 'falling') return;
    if (col == null) col = w.col;
    if (col == null) col = nearestCol(w.x);
    if (col == null) return;
    w.col = col;
    w.state = 'flying';
    markTarget();
    const bonusFrac = Math.max(0, 1 - w.t);
    const sx = w.x, sy = w.y, tx = centers[col], ty = FH - w.wh * 0.2;
    const t0 = performance.now(), D_MS = 170;
    const step = now => {
      const k = Math.min(1, (now - t0) / D_MS), ease = k * k;
      w.x = sx + (tx - sx) * ease; w.y = sy + (ty - sy) * ease;
      w.node.style.transform = `translate(${w.x - w.ww / 2}px, ${w.y}px) scale(${1 - 0.35 * ease})`;
      if (k < 1) requestAnimationFrame(step); else resolve(col, bonusFrac, true);
    };
    requestAnimationFrame(step);
  }

  function resolve(col, bonusFrac, dropped) {
    const w = G.word;
    if (!w || w.state === 'done') return;
    w.state = 'done';
    Voices.stop();
    const target = G.baskets.findIndex(c => c.id === w.answer);
    const ok = col === target;
    flashBasket(col == null ? target : col, 'hit');
    if (ok) onCorrect(w, col, bonusFrac, dropped); else onWrong(w, col, target);
  }

  function onCorrect(w, col, bonusFrac, dropped) {
    G.combo++; G.correct++; G.inLevel++;
    G.bestCombo = Math.max(G.bestCombo, G.combo);
    // Бонус за сброс: 5 очков за сам бросок и до 15 за то, насколько рано.
    const dropBonus = dropped ? 5 + Math.round(15 * bonusFrac) : 0;
    const lightning = dropped && bonusFrac >= 0.7;
    const base = 10 + G.level * 2;
    const k = mult() * (w.golden ? 3 : 1) * (G.buffs.double > 0 ? 2 : 1);
    const pts = (base + dropBonus) * k;
    G.score += pts;
    if (lightning) G.fast++;
    if (w.golden) { G.golden++; D.golden++; }

    Store.markWord(w.e.w, true);
    if (!G.ok.find(e => e.w === w.e.w)) G.ok.push(w.e);
    D.totalWords++;
    const daily = Store.daily();
    daily.count++;
    if (daily.count === Store.DAILY_GOAL) { toast('🎯', 'Цель дня выполнена!', `${Store.DAILY_GOAL} слов сегодня. Серия продолжается`); tryAch('goal'); }
    if (G.correct === 1) { Store.touchStreak(); tryAch('first'); }

    // Эффекты
    const cx = centers[col], cy = FH - 10;
    const [ax, ay] = toApp(cx, cy);
    const color = G.baskets[col].color;
    burst(ax, ay, color, w.golden ? 60 : 26, w.golden ? 1.3 : 1);
    if (w.golden) burst(ax, ay, '#ffb547', 30, 1.5);
    Sfx.correct(G.combo);
    if (w.golden) Sfx.golden();
    floatText(cx, FH - 50, '+' + fmt(pts), 'pts');
    if (dropBonus) floatText(cx, FH - 88, (lightning ? '⚡ Молния' : '⬇ Сброс') + ' +' + fmt(dropBonus * k), 'small drop');
    showReveal(w.e, true);
    w.node.remove();

    if (w.power) applyPower(w.power, cx);
    if (G.buffs.slow > 0) G.buffs.slow--;

    if (G.combo === 10) bigText('В УДАРЕ!', 'pts');
    else if (G.combo === 20) bigText('НЕУДЕРЖИМ!', 'pts');
    else if (G.combo === 30) bigText('ЛЕГЕНДА!', 'pts');
    else if (G.combo > 30 && G.combo % 10 === 0) bigText(G.combo + ' ПОДРЯД!', 'pts');
    if (G.combo > 0 && G.combo % 5 === 0 && G.combo <= 20 && G.combo !== 10 && G.combo !== 20) floatText(FW / 2, FH * 0.17, '×' + mult(), 'pts big');

    if (!G.newRecordShown && best() > 0 && G.score > best()) {
      G.newRecordShown = true;
      bigText('НОВЫЙ РЕКОРД!', 'mint');
      Sfx.achievement();
    }

    bumpScore();
    checkAch();
    renderHud();
    G.word = null;
    if (G.inLevel >= WORDS_PER_LEVEL) later(levelUp, 1100);
    else later(spawn, 750);
  }

  function onWrong(w, col, target) {
    const shielded = G.buffs.shield > 0;
    Store.markWord(w.e.w, false);
    if (!G.bad.find(e => e.w === w.e.w)) G.bad.push(w.e);
    G.wrong++;
    G.levelMistakes++;
    G.review.push({ e: w.e, due: 3 + Math.floor(Math.random() * 3) });

    w.node.classList.add('bad');
    Sfx.wrong();
    app.classList.remove('shake', 'hurt'); void app.offsetWidth;
    if (!REDUCED) app.classList.add('shake');
    flashBasket(target, 'right');
    showReveal(w.e, false);
    setTimeout(() => w.node.remove(), 450);

    if (shielded) {
      G.buffs.shield = 0;
      floatText(FW / 2, FH * 0.4, 'Щит спас!', 'mint big');
    } else {
      G.combo = 0;
      G.lives--;
      app.classList.add('hurt');
      renderLives(G.lives);
      floatText(col == null ? FW / 2 : centers[col], FH - 60, col == null ? 'Не успел!' : 'Мимо!', 'bad');
    }
    setTimeout(() => app.classList.remove('shake', 'hurt'), 650);
    renderHud();
    if (!shielded) renderLives(G.lives);
    G.word = null;
    if (G.lives <= 0) later(gameOver, 1500);
    else later(spawn, 1500);
  }

  function applyPower(p, x) {
    Sfx.power();
    const P = POWERS[p];
    if (p === 'slow') G.buffs.slow = 6;
    if (p === 'double') G.buffs.double = 15;
    if (p === 'shield') G.buffs.shield = 1;
    if (p === 'heart') { G.lives = Math.min(MAX_LIVES, G.lives + 1); }
    floatText(x, FH - 140, P.tag + ' ' + P.name, 'small mint');
  }

  function floatText(x, y, text, cls) {
    const f = el('div', 'float ' + cls);
    f.textContent = text;
    f.style.top = y + 'px';
    field.appendChild(f);
    const half = f.offsetWidth / 2;
    f.style.left = Math.max(half + 8, Math.min(FW - half - 8, x)) + 'px';
    setTimeout(() => f.remove(), 1500);
  }
  function bigText(text, cls) { floatText(FW / 2, FH * 0.17, text, cls + ' big'); }
  // Крупная карточка «слово — перевод» в центре поля: момент запоминания.
  function showReveal(e, ok) {
    field.querySelectorAll('.reveal').forEach(t => t.remove());
    const cat = e.cat && CAT_BY_ID[e.cat];
    const t = el('div', 'reveal' + (ok ? '' : ' bad'));
    t.innerHTML = `<div class="rv-en">${esc(e.w)}</div><div class="rv-ru">${esc(e.ru)}</div>` +
      (cat ? `<div class="rv-cat">${cat.icon} ${esc(cat.en)} · ${esc(cat.ru)}</div>` : `<div class="rv-cat">${TIER_LABEL[e.tier]}</div>`) +
      (ok ? '' : '<div class="rv-note">запомни</div>');
    field.appendChild(t);
    setTimeout(() => t.remove(), ok ? 1500 : 1800);
  }

  // ---------- Тосты и достижения ----------
  function toast(icon, title, sub) {
    const t = el('div', 'toast', `<div class="ti">${icon}</div><div><b>${esc(title)}</b><span>${esc(sub)}</span></div>`);
    $('toasts').appendChild(t);
    setTimeout(() => t.remove(), 3300);
  }
  function tryAch(id) {
    if (Store.unlock(id)) {
      const a = ACH_BY_ID[id];
      Sfx.achievement();
      toast(a.icon, 'Достижение: ' + a.name, a.desc);
    }
  }
  function checkAch() {
    if (G.combo >= 10) tryAch('combo10');
    if (G.combo >= 25) tryAch('combo25');
    if (G.combo >= 50) tryAch('combo50');
    if (G.score >= 1000) tryAch('score1k');
    if (G.score >= 5000) tryAch('score5k');
    if (G.score >= 15000) tryAch('score15k');
    if (G.fast >= 10) tryAch('fast10');
    if (G.golden >= 5) tryAch('gold5');
    if (D.totalWords >= 100) tryAch('words100');
    if (D.totalWords >= 500) tryAch('words500');
    if (D.totalWords >= 2000) tryAch('words2k');
    const s = Store.streakDays();
    if (s >= 3) tryAch('streak3');
    if (s >= 7) tryAch('streak7');
  }

  // ---------- Уровни ----------
  function levelUp() {
    const perfect = G.levelMistakes === 0;
    G.level++;
    G.inLevel = 0;
    G.levelMistakes = 0;
    const extras = [];
    if (perfect) {
      const bonus = 50 * G.level;
      G.score += bonus;
      extras.push(`Без ошибок! +${fmt(bonus)}`);
      tryAch('perfect');
    }
    if (G.level % 3 === 0 && G.lives < MAX_LIVES) { G.lives++; extras.push('+1 жизнь ♥'); }
    if (G.level >= 5) tryAch('level5');
    if (G.level >= 10) tryAch('level10');
    Sfx.levelUp();
    renderHud();
    showLevelIntro(extras.join(' · ') || 'Слова падают быстрее');
  }

  function showLevelIntro(extra) {
    G.state = 'intro';
    $('lbKicker').textContent = 'Уровень · ' + MODES[G.mode];
    $('lbNum').textContent = G.level;
    $('lbExtra').textContent = extra || '';
    if (G.mode === 'translate') {
      const n = basketCount(G.level), [lo, hi] = tierRange(G.level);
      G.baskets = placeholderBaskets(n);
      const lvl = lo === hi ? TIER_LABEL[lo] : TIER_LABEL[lo] + '–' + TIER_LABEL[hi];
      $('lbCats').innerHTML = `<span class="bcat" style="--c:${TR_COLORS[0]}">${n} ${plural(n, 'корзина', 'корзины', 'корзин')}<small>с переводами</small></span>` +
        `<span class="bcat" style="--c:${TR_COLORS[1]};animation-delay:.1s">Слова ${lvl}</span>`;
    } else {
      G.baskets = chooseCategories(basketCount(G.level));
      $('lbCats').innerHTML = G.baskets.map((c, i) => `<span class="bcat" style="--c:${c.color};animation-delay:${0.15 + i * 0.08}s">${c.icon} ${esc(c.en)}<small>${esc(c.ru)}</small></span>`).join('');
    }
    show('levelBanner');
    renderBaskets('enter');
    renderHud();
    // Озвучиваем названия корзин — тоже английские слова.
    if (G.mode === 'category') Voices.speakOnce(G.baskets.map(c => c.en).join('. ') + '.');
    later(startLevel, 2600);
  }
  function startLevel() {
    if (G.state !== 'intro') return;
    hide('levelBanner');
    G.state = 'playing';
    Voices.stop();
    measureBaskets();
    later(spawn, 250);
  }

  // ---------- Игра ----------
  function newGame() {
    Sfx.unlock(); Voices.warmup();
    blurFocus();
    G.mode = D.settings.mode;
    hideAll();
    clearField();
    Object.assign(G, {
      score: 0, lives: 3, level: 1, combo: 0, bestCombo: 0, inLevel: 0, levelMistakes: 0,
      correct: 0, wrong: 0, word: null, baskets: [], recent: [], review: [],
      buffs: { slow: 0, double: 0, shield: 0 }, ok: [], bad: [], fast: 0, golden: 0,
      xpBefore: D.xp, dailyBefore: Store.daily().count, newRecordShown: false,
    });
    D.games++;
    Store.save();
    showLevelIntro('Разложи слова по корзинам');
  }

  function clearField() {
    field.querySelectorAll('.word, .float, .reveal').forEach(n => n.remove());
    G.word = null;
  }

  function pause() {
    if (G.state !== 'playing' && G.state !== 'intro') return;
    G.prevState = G.state;
    G.state = 'paused';
    clearTimeout(G.timer);
    Voices.stop();
    show('pause');
  }
  function blurFocus() { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }
  function resume() {
    if (G.state !== 'paused') return;
    blurFocus();
    hide('pause'); hide('voicesPanel');
    Sfx.unlock();
    if (G.prevState === 'intro') { G.state = 'intro'; later(startLevel, 600); return; }
    G.state = 'playing';
    if (G.word && G.word.state === 'falling') Voices.speakLoop(G.word.e.w, G.voiceIdx++);
    else if (!G.word) later(spawn, 300);
  }

  function gameOver() {
    G.state = 'over';
    Voices.stop();
    clearTimeout(G.timer);
    clearField();
    Sfx.gameOver();

    const prevBest = best();
    const record = G.score > prevBest;
    D.bests[G.mode] = Math.max(prevBest, G.score);
    D.bestCombo = Math.max(D.bestCombo, G.bestCombo);
    D.bestLevel = Math.max(D.bestLevel, G.level);
    const xpGain = G.correct * 2 + G.golden * 5 + (G.level - 1) * 10 + Math.floor(G.bestCombo / 5) * 3;
    const before = Store.levelInfo(D.xp);
    D.xp += xpGain;
    const after = Store.levelInfo(D.xp);
    Store.save();

    const kick = $('oKicker');
    kick.textContent = (record && G.score > 0 ? 'Новый рекорд' : 'Игра окончена') + ' · ' + MODES[G.mode];
    kick.classList.toggle('record', record && G.score > 0);
    $('oScore').textContent = fmt(G.score);
    const total = G.correct + G.wrong;
    $('oWords').textContent = G.correct;
    $('oAcc').textContent = total ? Math.round(G.correct / total * 100) + '%' : '—';
    $('oCombo').textContent = G.bestCombo;
    $('oLevel').textContent = G.level;

    // «Почти получилось» — главный крючок для ещё одной попытки.
    let near = '';
    if (record && prevBest > 0) near = `Прошлый рекорд ${fmt(prevBest)} побит на ${fmt(G.score - prevBest)}`;
    else if (!record && prevBest > 0) {
      const gap = prevBest - G.score;
      near = gap <= prevBest * 0.25 ? `До рекорда всего ${fmt(gap)} очков!` : `Рекорд: ${fmt(prevBest)}`;
    }
    $('oNear').textContent = near;

    // Опыт: анимируем полоску от старого значения к новому.
    $('oPLvl').textContent = before.lvl;
    $('oPTitle').textContent = before.title;
    $('oXp').textContent = `+${xpGain} XP`;
    const fill = $('oXpFill');
    fill.style.transition = 'none';
    fill.style.width = (before.into / before.need * 100) + '%';
    void fill.offsetWidth;
    fill.style.transition = '';
    setTimeout(() => {
      if (after.lvl > before.lvl) {
        fill.style.width = '100%';
        setTimeout(() => {
          const b = $('oPLvl');
          b.textContent = after.lvl; b.classList.remove('up'); void b.offsetWidth; b.classList.add('up');
          $('oPTitle').textContent = after.title;
          fill.style.transition = 'none'; fill.style.width = '0%'; void fill.offsetWidth; fill.style.transition = '';
          fill.style.width = (after.into / after.need * 100) + '%';
          Sfx.levelUp();
          toast('⬆️', `Уровень игрока ${after.lvl}`, after.title);
        }, 1000);
      } else fill.style.width = (after.into / after.need * 100) + '%';
    }, 350);

    const daily = Store.daily();
    const left = Math.max(0, Store.DAILY_GOAL - daily.count);
    $('oGoal').innerHTML = `<div>${left ? `Цель дня: ещё <b>${left}</b> ${plural(left, 'слово', 'слова', 'слов')}` : `Цель дня выполнена · серия <b>${Store.streakDays()}</b> ${plural(Store.streakDays(), 'день', 'дня', 'дней')} 🔥`}</div><div class="goalbar"><i style="width:${Math.min(100, daily.count / Store.DAILY_GOAL * 100)}%"></i></div>`;

    const rv = $('oReview');
    rv.innerHTML = '';
    if (G.bad.length) {
      rv.appendChild(el('h3', null, 'Повтори эти слова'));
      rv.appendChild(chipList(G.bad, 'miss'));
    }
    const fresh = G.ok.filter(e => !G.bad.find(b => b.w === e.w)).slice(-(W < 520 ? 8 : 12));
    if (fresh.length) {
      rv.appendChild(el('h3', null, 'Пойманные слова'));
      rv.appendChild(chipList(fresh, 'new'));
    }
    show('over');
    setTimeout(() => $('againBtn').focus(), 50);
  }

  function chipList(list, cls) {
    const box = el('div', 'chips');
    list.forEach(e => {
      const c = el('button', 'chip ' + cls, `🔊 <b>${esc(e.w)}</b> <span class="ru">${esc(e.ru)}</span>`);
      c.addEventListener('click', () => { Sfx.unlock(); Voices.speakOnce(e.w); });
      box.appendChild(c);
    });
    return box;
  }

  // ---------- Экраны ----------
  const SCREENS = ['menu', 'help', 'voicesPanel', 'dictPanel', 'levelBanner', 'pause', 'over'];
  function show(id) { $(id).hidden = false; }
  function hide(id) { $(id).hidden = true; }
  function hideAll() { SCREENS.forEach(hide); }
  function openPanel(id) { show(id); }

  function renderMenu() {
    const li = Store.levelInfo();
    $('pLvl').textContent = li.lvl;
    $('pTitle').textContent = li.title;
    $('pXp').textContent = `${li.into} / ${li.need} XP`;
    requestAnimationFrame(() => { $('pXpFill').style.width = (li.into / li.need * 100) + '%'; });
    const daily = Store.daily();
    $('mStreak').textContent = Store.streakDays();
    $('mGoal').textContent = `${Math.min(daily.count, Store.DAILY_GOAL)}/${Store.DAILY_GOAL}`;
    $('mGoalFill').style.width = Math.min(100, daily.count / Store.DAILY_GOAL * 100) + '%';
    G.mode = D.settings.mode;
    $('mBest').textContent = fmt(best());
    $('hudBest').textContent = fmt(best());
    renderModeSwitches();
    renderVoiceLine();
  }
  function toMenu() {
    G.state = 'menu';
    Voices.stop();
    clearTimeout(G.timer);
    clearField();
    hideAll();
    renderMenu();
    show('menu');
  }

  function renderModeSwitches() {
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === D.settings.mode)));
    const hint = D.settings.mode === 'translate'
      ? 'Корзины — переводы слова. Чем выше уровень, тем больше корзин и сложнее слова (A1 → C1).'
      : 'Корзины — темы: животные, еда, профессии… Положи слово в его тему.';
    document.querySelectorAll('.mode-hint').forEach(h => { h.textContent = hint; });
  }
  function setMode(m) {
    if (!MODES[m]) return;
    D.settings.mode = m;
    Store.save();
    renderMenu();
  }

  function renderVoiceLine() {
    const line = $('voiceLine');
    if (!Voices.supported) { line.innerHTML = 'Этот браузер не умеет говорить. Откройте игру в Chrome, Edge или Safari.'; return; }
    const act = Voices.active();
    if (!act.length) {
      line.innerHTML = Voices.ready
        ? 'Английские голоса не найдены: слова будет читать голос по умолчанию. Лучше всего играть в Chrome, Edge или Safari.'
        : 'Ищем голоса…';
      return;
    }
    line.innerHTML = '🔊 Голоса: ' + act.slice(0, 4).map(x => `<b>${esc(x.short)}</b> ${Voices.flag(x)}`).join(', ') + (act.length > 4 ? ` и ещё ${act.length - 4}` : '');
  }

  // ---------- Панель голосов ----------
  function quality(x) {
    if (/natural|neural|premium|enhanced|siri/i.test(x.name)) return '<span class="q top">нейро</span>';
    if (x.q >= 60) return '<span class="q good">чёткий</span>';
    return '';
  }
  function renderVoices() {
    const list = $('voiceList');
    list.innerHTML = '';
    const active = new Set(Voices.active().map(x => x.name));
    $('vCount').textContent = Voices.list.length ? `Английских голосов: ${Voices.list.length}, выбрано: ${active.size}` : '';
    if (!Voices.supported || !Voices.list.length) {
      list.appendChild(el('div', 'empty', Voices.supported
        ? 'Английские голоса не найдены. Установите их в настройках системы (язык и речь) или откройте игру в Chrome / Edge.'
        : 'Браузер не поддерживает синтез речи. Попробуйте Chrome, Edge или Safari.'));
      return;
    }
    Voices.list.forEach(x => {
      const row = el('label', 'vrow');
      const id = 'v_' + x.name.replace(/\W+/g, '_');
      row.innerHTML = `<input type="checkbox" id="${esc(id)}" ${active.has(x.name) ? 'checked' : ''}>
        <span class="vn"><b>${Voices.flag(x)} ${esc(x.short)}${quality(x)}</b><span>${esc(Voices.accent(x))} · ${esc(x.lang)}</span></span>
        <button class="btn small" type="button">▶</button>`;
      row.querySelector('input').addEventListener('change', ev => {
        const cur = new Set(Voices.active().map(v => v.name));
        if (ev.target.checked) cur.add(x.name); else cur.delete(x.name);
        Voices.enabled = cur.size ? [...cur] : null;
        D.settings.voices = Voices.enabled;
        Store.save();
        renderVoices(); renderVoiceLine();
        if (ev.target.checked) Voices.speakOnce(pick(ALL_WORDS).w, x);
      });
      row.querySelector('button').addEventListener('click', ev => {
        ev.preventDefault();
        Sfx.unlock();
        Voices.speakOnce(pick(ALL_WORDS).w, x);
      });
      list.appendChild(row);
    });
  }

  function bindSettings() {
    const s = D.settings;
    Voices.enabled = s.voices; Voices.rate = s.rate; Voices.repeats = s.repeats;
    Sfx.setVolume(s.sfx);
    const rate = $('sRate'), rep = $('sRep'), sfx = $('sSfx');
    rate.value = s.rate; rep.value = s.repeats; sfx.value = s.sfx;
    const out = () => {
      $('sRateOut').textContent = Number(rate.value).toFixed(2) + '×';
      $('sRepOut').textContent = rep.value;
      $('sSfxOut').textContent = Math.round(sfx.value * 100) + '%';
    };
    out();
    rate.addEventListener('input', () => { s.rate = Voices.rate = Number(rate.value); out(); Store.save(); });
    rate.addEventListener('change', () => Voices.speakOnce('pronunciation'));
    rep.addEventListener('input', () => { s.repeats = Voices.repeats = Number(rep.value); out(); Store.save(); });
    sfx.addEventListener('input', () => { s.sfx = Number(sfx.value); Sfx.unlock(); Sfx.setVolume(s.sfx); out(); Store.save(); });
    sfx.addEventListener('change', () => Sfx.correct(3));
    $('vAuto').addEventListener('click', () => { Voices.enabled = null; s.voices = null; Store.save(); renderVoices(); renderVoiceLine(); });
  }

  // ---------- Словарь ----------
  function renderDict() {
    const box = $('dict');
    box.innerHTML = '';
    const learned = Store.learnedCount();
    $('dictSum').textContent = `Изучено ${learned} из ${TR_WORDS.length} слов. Звёзды показывают, насколько уверенно ты раскладываешь слово. Нажми на слово, чтобы услышать его.`;
    CATS.forEach(c => {
      const sec = el('div', 'dcat');
      const got = c.words.filter(([w]) => Store.stars(w) > 0).length;
      sec.appendChild(el('h3', null, `${c.icon} ${esc(c.en)} <span>${got}/${c.words.length}</span>`));
      const chips = el('div', 'chips');
      c.words.forEach(([w, ru]) => {
        const st = Store.stars(w);
        const chip = el('button', 'chip s' + st, `<b>${esc(w)}</b><span class="ru">${esc(ru)}</span>${st ? `<span class="st">${'★'.repeat(st)}</span>` : ''}`);
        chip.addEventListener('click', () => { Sfx.unlock(); Voices.speakOnce(w); });
        chips.appendChild(chip);
      });
      sec.appendChild(chips);
      box.appendChild(sec);
    });
    const sec = el('div', 'dcat');
    const got = EXTRA_WORDS.filter(e => Store.stars(e.w) > 0).length;
    sec.appendChild(el('h3', null, `🎓 Advanced · режим «Перевод» <span>${got}/${EXTRA_WORDS.length}</span>`));
    const chips = el('div', 'chips');
    EXTRA_WORDS.forEach(e => {
      const st = Store.stars(e.w);
      const chip = el('button', 'chip s' + st, `<b>${esc(e.w)}</b><span class="ru">${esc(e.ru)} · ${TIER_LABEL[e.tier]}</span>${st ? `<span class="st">${'★'.repeat(st)}</span>` : ''}`);
      chip.addEventListener('click', () => { Sfx.unlock(); Voices.speakOnce(e.w); });
      chips.appendChild(chip);
    });
    sec.appendChild(chips);
    box.appendChild(sec);
  }

  // ---------- Ввод ----------
  function bindInput() {
    $('playBtn').addEventListener('click', newGame);
    $('againBtn').addEventListener('click', newGame);
    $('menuBtn').addEventListener('click', toMenu);
    $('helpBtn').addEventListener('click', () => openPanel('help'));
    $('voicesBtn').addEventListener('click', () => { Sfx.unlock(); Voices.warmup(); renderVoices(); openPanel('voicesPanel'); });
    $('pVoicesBtn').addEventListener('click', () => { renderVoices(); openPanel('voicesPanel'); });
    $('dictBtn').addEventListener('click', () => { Voices.warmup(); renderDict(); openPanel('dictPanel'); });
    $('pauseBtn').addEventListener('click', () => (G.state === 'paused' ? resume() : pause()));
    $('resumeBtn').addEventListener('click', resume);
    $('quitBtn').addEventListener('click', () => { hide('pause'); gameOver(); });
    document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => {
      const scr = b.closest('.screen');
      scr.hidden = true;
      Voices.stop();
      if (scr.id === 'voicesPanel') renderVoiceLine();
    }));
    $('levelBanner').addEventListener('pointerdown', () => { Sfx.unlock(); startLevel(); });
    document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

    window.addEventListener('keydown', e => {
      const k = e.key;
      if (G.state === 'menu' && k === 'Enter' && !$('menu').hidden && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); newGame(); return; }
      if (G.state === 'over' && k === 'Enter' && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); newGame(); return; }
      if (k === 'Escape' || k === 'p' || k === 'P' || k === 'з' || k === 'З') {
        if (G.state === 'playing' || G.state === 'intro') { e.preventDefault(); pause(); }
        else if (G.state === 'paused') { e.preventDefault(); resume(); }
        else { const open = SCREENS.find(id => !$(id).hidden && id !== 'menu' && id !== 'over'); if (open) { hide(open); Voices.stop(); } }
        return;
      }
      if (G.state === 'intro' && (k === ' ' || k === 'Enter')) { e.preventDefault(); startLevel(); return; }
      if (G.state !== 'playing') return;
      // Пробел на сфокусированной кнопке нажал бы её вместо сброса слова.
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') blurFocus();
      if (k === 'ArrowLeft' || k === 'a' || k === 'A' || k === 'ф') { e.preventDefault(); moveCol(-1); }
      else if (k === 'ArrowRight' || k === 'd' || k === 'D' || k === 'в') { e.preventDefault(); moveCol(1); }
      else if (k === 'ArrowDown' || k === ' ' || k === 's' || k === 'S' || k === 'ы') { e.preventDefault(); commit(); }
      else if (/^[1-5]$/.test(k)) { const i = Number(k) - 1; if (i < G.baskets.length) { e.preventDefault(); commit(i); } }
      else if (k === 'r' || k === 'R' || k === 'к') { if (G.word && G.word.state === 'falling') Voices.speakLoop(G.word.e.w, G.voiceIdx++); }
    });

    // Палец/мышь: ведём слово над корзиной; свайп вниз или тап по самому слову — сброс.
    let down = null;
    field.addEventListener('pointerdown', e => {
      if (G.state !== 'playing') return;
      const onWord = !!(G.word && e.target.closest && e.target.closest('.word'));
      down = { x: e.clientX, y: e.clientY, onWord };
      if (!onWord) setColAt(e.clientX - field.getBoundingClientRect().left);
    });
    window.addEventListener('pointermove', e => {
      if (!down || G.state !== 'playing') return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      // Жест вниз сбрасываем сразу, не дожидаясь отпускания пальца.
      if (dy > 36 && dy > Math.abs(dx) * 1.2) { down = null; commit(); return; }
      if (Math.abs(dx) > 8 || !down.onWord) setColAt(e.clientX - field.getBoundingClientRect().left);
    });
    window.addEventListener('pointerup', e => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (down.onWord && moved < 12 && G.state === 'playing') commit();
      down = null;
    });
    window.addEventListener('pointercancel', () => { down = null; });

    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    window.addEventListener('resize', () => { resize(); initBg(); });
  }

  // ---------- Главный цикл ----------
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    drawBg(dt);
    if (G.state === 'playing') {
      if (G.buffs.double > 0) { G.buffs.double -= dt; if (G.buffs.double <= 0) { G.buffs.double = 0; renderHud(); } else renderBuffs(); }
      const w = G.word;
      if (w && w.state === 'falling') {
        w.t += dt / w.dur;
        const endY = FH - w.wh * 0.2;
        w.y = -w.wh + (endY + w.wh) * w.t;
        const tx = w.col == null ? FW / 2 : centers[w.col];
        w.x += (tx - w.x) * Math.min(1, dt * 16);
        w.node.classList.toggle('danger', w.t > 0.72);
        place(w);
        if (w.t >= 1) {
          w.state = 'landing';
          markTarget();
          resolve(w.col, 0);
        }
      }
    }
    drawFx(dt);
    requestAnimationFrame(frame);
  }

  // ---------- Старт ----------
  function boot() {
    Voices.init();
    Voices.onSpeak = x => {
      const chip = $('speaking');
      if (G.word && G.word.node) G.word.node.classList.toggle('talking', !!x);
      if (!x || G.state !== 'playing') { chip.classList.remove('on'); return; }
      $('spkName').innerHTML = `${Voices.flag(x)} <b>${esc(x.short)}</b> · ${esc(Voices.accent(x))}`;
      chip.classList.add('on');
    };
    Voices.onChange(() => { if (!$('menu').hidden) renderVoiceLine(); if (!$('voicesPanel').hidden) renderVoices(); });
    bindSettings();
    bindInput();
    resize();
    initBg();
    G.mode = D.settings.mode;
    G.baskets = G.mode === 'translate' ? placeholderBaskets(3) : chooseCategories(3);
    renderBaskets(false);
    renderHud();
    renderMenu();
    requestAnimationFrame(frame);
    // На случай, если шрифты догрузились позже и сдвинули корзины.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { resize(); });
  }
  boot();
})();
