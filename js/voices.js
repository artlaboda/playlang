// Синтез речи: выбираем самые качественные голоса изучаемого языка на устройстве
// и произносим падающее слово по кругу разными голосами.
(function () {
  const synth = window.speechSynthesis || null;

  // Новелти-голоса macOS и старые «роботы» — никогда не берём.
  const JUNK = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph|princess|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley|espeak|pico/i;
  // Хорошо звучащие системные голоса Apple / Windows / Android.
  const GOOD_NAMES = /samantha|daniel|karen|moira|tessa|serena|ava|allison|tom|evan|zoe|nathan|susan|aria|jenny|guy|ryan|sonia|libby|natasha|william|clara|emma|brian|andrew|christopher|eric|michelle|steffan|ana|olivia|noah|joelle|isha|neerja|rishi|fiona|lee|kate|oliver|stephanie|catherine|gordon|arthur|martha|m[oó]nica|paulina|jorge|juan|diego|marisol|ang[eé]lica|helena|laura|pablo|elvira|[aá]lvaro|dalia|luc[ií]a|marta|carlos|isabela|ximena|elena|gonzalo|camila|triana|irene|alonso|valentina|abril|arnau|elias|estrella|ximena|tom[aá]s|lorenzo|salom[eé]|renata/i;

  const FLAGS = {
    US: '🇺🇸', GB: '🇬🇧', UK: '🇬🇧', AU: '🇦🇺', CA: '🇨🇦', IE: '🇮🇪', IN: '🇮🇳', NZ: '🇳🇿', ZA: '🇿🇦', SG: '🇸🇬', HK: '🇭🇰', PH: '🇵🇭', NG: '🇳🇬', KE: '🇰🇪', TZ: '🇹🇿',
    ES: '🇪🇸', MX: '🇲🇽', AR: '🇦🇷', CO: '🇨🇴', CL: '🇨🇱', PE: '🇵🇪', VE: '🇻🇪', UY: '🇺🇾', CR: '🇨🇷', CU: '🇨🇺', DO: '🇩🇴', EC: '🇪🇨',
    GT: '🇬🇹', HN: '🇭🇳', NI: '🇳🇮', PA: '🇵🇦', PR: '🇵🇷', PY: '🇵🇾', SV: '🇸🇻', BO: '🇧🇴', GQ: '🇬🇶',
  };
  // Акценты зависят от языка: es-US — это американский испанский, а не английский.
  const ACCENTS = {
    en: { US: 'американский', GB: 'британский', UK: 'британский', AU: 'австралийский', CA: 'канадский', IE: 'ирландский', IN: 'индийский', NZ: 'новозеландский', ZA: 'южноафриканский', SG: 'сингапурский', _: 'английский' },
    es: { ES: 'кастильский (Испания)', MX: 'мексиканский', US: 'американский испанский', AR: 'аргентинский', CO: 'колумбийский', CL: 'чилийский', PE: 'перуанский', VE: 'венесуэльский', CU: 'кубинский', UY: 'уругвайский', _: 'латиноамериканский' },
  };
  // Основные варианты языка получают небольшой приоритет.
  const PREFERRED = { en: ['US', 'GB'], es: ['ES', 'MX'] };

  function region(v) {
    const m = (v.lang || '').replace('_', '-').split('-');
    return (m[1] || '').toUpperCase();
  }

  function score(v) {
    const n = v.name;
    if (JUNK.test(n)) return -1000;
    let s = 0;
    if (/natural|neural/i.test(n)) s += 120;          // Edge / Azure neural
    if (/premium|enhanced|siri/i.test(n)) s += 100;   // Apple premium
    if (/online/i.test(n)) s += 30;
    if (/^google/i.test(n)) s += 70;                  // Chrome сетевые голоса
    if (GOOD_NAMES.test(n)) s += 35;
    if (/compact/i.test(n)) s -= 40;
    if ((PREFERRED[Voices.lang] || []).includes(region(v))) s += 10;
    return s;
  }

  function shortName(v) {
    let n = v.name
      .replace(/^Microsoft\s+/i, '')
      .replace(/\s+Online.*$/i, '')
      .replace(/\s*\((Natural|Enhanced|Premium)\)/ig, '')
      .replace(/\s*-\s*(English|Spanish|Español|Espanol).*$/i, '')
      .replace(/\s*\(.*\)$/, '')
      .trim();
    if (/^google/i.test(v.name)) {
      const r = region(v);
      const g = /female/i.test(v.name) ? '♀' : /male/i.test(v.name) ? '♂' : '';
      n = 'Google ' + (r || Voices.lang.toUpperCase()) + (g ? ' ' + g : '');
    }
    return n || v.name;
  }

  const Voices = {
    supported: !!synth && typeof window.SpeechSynthesisUtterance === 'function',
    lang: 'en',        // изучаемый язык: какие голоса берём
    list: [],          // все голоса этого языка, отсортированы по качеству
    ready: false,      // true, когда браузер точно успел отдать список голосов
    enabled: null,     // имена выбранных голосов (null = автоподбор)
    rate: 0.95,
    repeats: 4,        // сколько раз максимум произносить слово
    onSpeak: null,     // колбэк(voiceInfo | null)
    _token: 0,
    _keep: [],         // держим ссылки на utterance (баг GC в Chrome)
    _listeners: [],

    init() {
      if (!this.supported) return;
      const load = () => {
        const all = synth.getVoices() || [];
        const re = new RegExp('^' + this.lang + '([-_]|$)', 'i');
        this.list = all
          .filter(v => re.test(v.lang))
          .map(v => ({ v, name: v.name, lang: v.lang, region: region(v), short: shortName(v), q: score(v) }))
          .filter(x => x.q > -1000)
          .sort((a, b) => b.q - a.q);
        this._listeners.forEach(fn => fn(this.list));
      };
      this._load = load;
      load();
      if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', load);
      else synth.onvoiceschanged = load;
      // Некоторые браузеры отдают голоса с задержкой.
      setTimeout(load, 400);
      setTimeout(() => { this.ready = true; load(); }, 1500);
    },

    onChange(fn) { this._listeners.push(fn); },

    setLang(code) {
      if (code === this.lang) return;
      this.lang = code;
      this.enabled = null;
      if (this._load) this._load();
    },

    // Автоподбор: лучшие голоса, но с разными акцентами и «семьями».
    autoPick(max = 5) {
      const picked = [];
      const regions = {}, families = {};
      const pool = this.list.slice();
      while (picked.length < max && pool.length) {
        let best = null, bestS = -Infinity;
        for (const x of pool) {
          const fam = x.name.split(/\s+/)[0].toLowerCase();
          const s = x.q - (regions[x.region] || 0) * 25 - (families[fam] || 0) * 12;
          if (s > bestS) { bestS = s; best = x; }
        }
        pool.splice(pool.indexOf(best), 1);
        if (picked.length >= 2 && best.q < picked[0].q - 150) break; // не тащим откровенно плохие
        picked.push(best);
        regions[best.region] = (regions[best.region] || 0) + 1;
        const fam = best.name.split(/\s+/)[0].toLowerCase();
        families[fam] = (families[fam] || 0) + 1;
      }
      return picked;
    },

    active() {
      if (this.enabled && this.enabled.length) {
        const set = this.list.filter(x => this.enabled.includes(x.name));
        if (set.length) return set;
      }
      return this.autoPick();
    },

    flag(x) { return FLAGS[x.region] || '🌐'; },
    accent(x) { const a = ACCENTS[this.lang] || ACCENTS.en; return a[x.region] || a._; },

    stop() {
      this._token++;
      if (this.supported) { try { synth.cancel(); } catch (e) {} }
      if (this.onSpeak) this.onSpeak(null);
    },

    _say(text, x, rate, token, done) {
      if (token !== this._token) return;
      const u = new SpeechSynthesisUtterance(text);
      if (x) { u.voice = x.v; u.lang = x.lang; } else u.lang = this.lang === 'es' ? 'es-ES' : 'en-US';
      u.rate = rate; u.pitch = 1; u.volume = 1;
      let finished = false;
      const finish = () => {
        if (finished) return; finished = true;
        clearTimeout(guard);
        this._keep = this._keep.filter(k => k !== u);
        done();
      };
      // Если onend не придёт (бывает в Chrome/Safari) — продолжаем сами.
      const guard = setTimeout(finish, 900 + text.length * 160 / rate);
      u.onstart = () => { if (token === this._token && this.onSpeak) this.onSpeak(x); };
      u.onend = finish;
      u.onerror = finish;
      this._keep.push(u);
      try { synth.resume(); synth.speak(u); } catch (e) { finish(); }
    },

    // Произнести слово по кругу разными голосами, пока не вызовут stop().
    speakLoop(text, startIndex = 0) {
      this.stop();
      if (!this.supported) return;
      const token = this._token;
      const voices = this.active();
      const rates = [1, 0.8, 1.05, 0.9];
      let i = 0;
      const next = () => {
        if (token !== this._token || i >= this.repeats) { if (token === this._token && this.onSpeak) this.onSpeak(null); return; }
        const x = voices.length ? voices[(startIndex + i) % voices.length] : null;
        const r = this.rate * rates[i % rates.length];
        i++;
        this._say(text, x, r, token, () => setTimeout(next, 280));
      };
      // После cancel() Chrome иногда «съедает» сразу следующий speak.
      setTimeout(next, 70);
    },

    // iOS разрешает речь только после жеста: вызывать синхронно из обработчика клика.
    warmup() {
      if (!this.supported || this._warm) return;
      this._warm = true;
      try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {}
    },

    speakOnce(text, x, rate) {
      this.stop();
      if (!this.supported) return;
      const token = this._token;
      setTimeout(() => this._say(text, x || this.active()[0], rate || this.rate, token, () => { if (this.onSpeak) this.onSpeak(null); }), 70);
    },
  };

  window.Voices = Voices;
})();
