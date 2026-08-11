/* ============================================================
   CaliTrack — App logic
   Calisthenics workout logger + goal tracker (localStorage)
   ============================================================ */

/* ---------------- Exercise library ---------------- */

const CATS = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'upper', label: 'ท่อนบน' },
  { id: 'lower', label: 'ท่อนล่าง' },
  { id: 'core', label: 'แกนกลาง' },
  { id: 'skill', label: 'ท่าสกิล' },
];

const CAT_LABEL = { upper: 'ท่อนบน', lower: 'ท่อนล่าง', core: 'แกนกลาง', skill: 'ท่าสกิล' };

const EXERCISES = [
  { id: 'pushup',   name: 'วิดพื้น',         emoji: '💪', cat: 'upper', unit: 'reps', en: 'Push-Up', video: 'IODxDxX7oi4' },
  { id: 'pullup',   name: 'ดึงข้อ',           emoji: '🤸', cat: 'upper', unit: 'reps', en: 'Pull-Up', video: 'Y3ntNsIS2Q8' },
  { id: 'chinup',   name: 'ดึงข้อหันหน้า',     emoji: '🧗', cat: 'upper', unit: 'reps', en: 'Chin-Up', video: 'r4PGhnfiEdU' },
  { id: 'dip',      name: 'ดิป (บาร์คู่)',     emoji: '🏋️', cat: 'upper', unit: 'reps', en: 'Dips', video: 'AGCwEXqW__M' },
  { id: 'pike',     name: 'วิดพื้นท่ายอดเขา',   emoji: '⛰️', cat: 'upper', unit: 'reps', en: 'Pike Push-Up', video: '66x0qQiJ-MA' },
  { id: 'row',      name: 'แถวออสเตรเลีย',    emoji: '🚣', cat: 'upper', unit: 'reps', en: 'Australian Rows', video: 'GdyhjXlxE-U' },
  { id: 'muscleup', name: 'มัสเซิลอัพ',       emoji: '🔥', cat: 'skill', unit: 'reps', en: 'Muscle-Up', video: '6v6IsZcvqCA' },
  { id: 'squat',    name: 'สควอท',           emoji: '🦵', cat: 'lower', unit: 'reps', en: 'Squat', video: 'xqvCmoLULNY' },
  { id: 'lunge',    name: 'ลันจ์',            emoji: '🏃', cat: 'lower', unit: 'reps', en: 'Lunges', video: '3zVrh37QqC8' },
  { id: 'pistol',   name: 'สควอทขาเดียว',     emoji: '🦄', cat: 'lower', unit: 'reps', en: 'Pistol Squat', video: 'vq5-vdgJc0I' },
  { id: 'squatjump', name: 'สควอทจั๊มป์',      emoji: '⚡', cat: 'lower', unit: 'reps', en: 'Jump Squat', video: 'CVaEhXotL7M' },
  { id: 'calf',     name: 'ยกปลายเท้า',       emoji: '🦶', cat: 'lower', unit: 'reps', en: 'Calf Raises', video: 'gwLzBJYoWlI' },
  { id: 'plank',    name: 'แพลงก์',           emoji: '🧱', cat: 'core', unit: 'time', en: 'Plank', video: 'A2b2EmIg0dA' },
  { id: 'situp',    name: 'ซิทอัพ',           emoji: '🫀', cat: 'core', unit: 'reps', en: 'Sit-Up', video: 'pCX65Mtc_Kk' },
  { id: 'legraise', name: 'ยกขา',            emoji: '🦿', cat: 'core', unit: 'reps', en: 'Leg Raises', video: 'Pr1ieGZ5atk' },
  { id: 'lsit',     name: 'L-Sit',           emoji: '📐', cat: 'core', unit: 'time', en: 'L-Sit', video: 'j1FYClx8EOU' },
  { id: 'hollow',   name: 'ฮอลโลว์โฮลด์',      emoji: '🥣', cat: 'core', unit: 'time', en: 'Hollow Hold', video: 'BQCdzRPE9Ao' },
  { id: 'mountain', name: 'เมาน์เทนไคล์มเบอร์', emoji: '🏃', cat: 'core', unit: 'reps', en: 'Mountain Climbers', video: 'cnyTQDSE884' },
  { id: 'handstand', name: 'ยืนมือ',          emoji: '🙃', cat: 'skill', unit: 'time', en: 'Handstand', video: 'Q587Mq8VbrM' },
  { id: 'crow',     name: 'คราวสแตนด์',       emoji: '🐦', cat: 'skill', unit: 'time', en: 'Crow Pose', video: 'ysTXf7DVOf0' },
];

const exById = (id) => EXERCISES.find((e) => e.id === id) || EXERCISES[0];

/* ---------------- Workout plans ---------------- */

const PLANS = [
  {
    id: 'beginner',
    emoji: '🌱',
    name: 'ปูพื้นฐาน',
    level: 'มือใหม่',
    tagline: 'ฝึกท่าพื้นฐาน 3 วันต่อสัปดาห์ สร้างนิสัยและความแข็งแรงเบื้องต้น',
    schedule: '4 สัปดาห์ · 3 วัน/สัปดาห์',
    days: [
      { name: 'วันจันทร์', focus: 'Full Body A', exercises: [
        { ex: 'pushup', sets: 3, reps: 8 },
        { ex: 'squat', sets: 3, reps: 10 },
        { ex: 'plank', sets: 3, dur: 20 },
      ]},
      { name: 'วันพุธ', focus: 'Full Body B', exercises: [
        { ex: 'row', sets: 3, reps: 8 },
        { ex: 'lunge', sets: 3, reps: 10 },
        { ex: 'situp', sets: 3, reps: 12 },
      ]},
      { name: 'วันศุกร์', focus: 'Full Body C', exercises: [
        { ex: 'pike', sets: 3, reps: 8 },
        { ex: 'squat', sets: 3, reps: 12 },
        { ex: 'hollow', sets: 3, dur: 20 },
      ]},
    ],
  },
  {
    id: 'intermediate',
    emoji: '💪',
    name: 'สร้างพลัง',
    level: 'ขั้นกลาง',
    tagline: 'แยกฝึกท่อนบน/ล่าง 4 วันต่อสัปดาห์ เพิ่มวอลุ่มและความหนัก',
    schedule: '4 สัปดาห์ · 4 วัน/สัปดาห์',
    days: [
      { name: 'วันจันทร์', focus: 'ท่อนบน', exercises: [
        { ex: 'pullup', sets: 4, reps: 6 },
        { ex: 'dip', sets: 4, reps: 8 },
        { ex: 'pushup', sets: 4, reps: 10 },
      ]},
      { name: 'วันอังคาร', focus: 'ท่อนล่าง', exercises: [
        { ex: 'squat', sets: 4, reps: 12 },
        { ex: 'lunge', sets: 3, reps: 12 },
        { ex: 'calf', sets: 4, reps: 15 },
      ]},
      { name: 'วันพฤหัสบดี', focus: 'ท่อนบน', exercises: [
        { ex: 'chinup', sets: 4, reps: 6 },
        { ex: 'pike', sets: 3, reps: 10 },
        { ex: 'row', sets: 3, reps: 12 },
      ]},
      { name: 'วันศุกร์', focus: 'ท่อนล่าง', exercises: [
        { ex: 'squatjump', sets: 3, reps: 10 },
        { ex: 'pistol', sets: 3, reps: 5 },
        { ex: 'calf', sets: 4, reps: 15 },
      ]},
    ],
  },
  {
    id: 'advanced',
    emoji: '🔥',
    name: 'สกิลขั้นสูง',
    level: 'ขั้นสูง',
    tagline: 'ฝึกพละกำลังและท่าสกิล 5 วันต่อสัปดาห์ พร้อมโฟกัสแกนกลาง',
    schedule: '4 สัปดาห์ · 5 วัน/สัปดาห์',
    days: [
      { name: 'วันจันทร์', focus: 'พละกำลังท่อนบน', exercises: [
        { ex: 'pullup', sets: 5, reps: 6 },
        { ex: 'dip', sets: 5, reps: 8 },
        { ex: 'muscleup', sets: 5, reps: 3 },
      ]},
      { name: 'วันอังคาร', focus: 'ฝึกสกิล', exercises: [
        { ex: 'handstand', sets: 5, dur: 30 },
        { ex: 'lsit', sets: 5, dur: 15 },
        { ex: 'crow', sets: 5, dur: 20 },
      ]},
      { name: 'วันพุธ', focus: 'ท่อนล่าง', exercises: [
        { ex: 'pistol', sets: 5, reps: 6 },
        { ex: 'squatjump', sets: 4, reps: 10 },
        { ex: 'lunge', sets: 4, reps: 15 },
      ]},
      { name: 'วันศุกร์', focus: 'พละกำลัง', exercises: [
        { ex: 'pullup', sets: 5, reps: 8 },
        { ex: 'pushup', sets: 4, reps: 15 },
        { ex: 'muscleup', sets: 4, reps: 3 },
      ]},
      { name: 'วันเสาร์', focus: 'แกนกลาง', exercises: [
        { ex: 'plank', sets: 5, dur: 45 },
        { ex: 'legraise', sets: 4, reps: 15 },
        { ex: 'hollow', sets: 4, dur: 30 },
      ]},
    ],
  },
];

const planById = (id) => PLANS.find((p) => p.id === id) || null;

/* ---------------- Storage: Supabase (หลัก) + localStorage (cache/offline) ---------------- */

const STORE_KEY = 'calitrack.v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return {
      workouts: Array.isArray(data.workouts) ? data.workouts : [],
      goals: Array.isArray(data.goals) ? data.goals : [],
      activePlanId: typeof data.activePlanId === 'string' ? data.activePlanId : null,
      planDone: data.planDone && typeof data.planDone === 'object' && !Array.isArray(data.planDone) ? data.planDone : {},
    };
  } catch {
    return { workouts: [], goals: [], activePlanId: null, planDone: {} };
  }
}

let state = loadState();

const cacheSave = () => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
};

/* ============ Supabase layer ============ */

const SB_CFG = { enabled: true, url: '', anonKey: '', useAuth: false, ...((typeof window.SUPABASE_CONFIG === 'object' && window.SUPABASE_CONFIG) || {}) };
// ค่าจาก Project Settings -> API บางครั้งติด /rest/v1/ มาด้วย — ตัดออกเพราะ supabase-js ต่อให้เอง
SB_CFG.url = (SB_CFG.url || '').replace(/\/?rest\/v1\/?$/, '');

let sb = null;            // supabase client
let sbOnline = false;     // เชื่อมต่อและโหลดข้อมูลสำเร็จ
let sbPushing = false;    // ป้องกัน push ซ้อน
let sbPendingPush = false;

const sbConfigured = () =>
  SB_CFG.enabled && SB_CFG.url && SB_CFG.anonKey &&
  !SB_CFG.url.includes('YOUR-') && !SB_CFG.anonKey.includes('YOUR-');

// แปลงระหว่าง object ในแอป (camelCase) กับแถวในตาราง (snake_case)
const wToDb = (w) => ({ id: w.id, exercise_id: w.exerciseId, sets: w.sets, reps: w.reps, duration: w.duration, weight: w.weight, notes: w.notes || '', date: w.date, created_at: w.createdAt });
const wFromDb = (r) => ({ id: r.id, exerciseId: r.exercise_id, sets: Number(r.sets) || 1, reps: Number(r.reps) || 0, duration: Number(r.duration) || 0, weight: Number(r.weight) || 0, notes: r.notes || '', date: r.date, createdAt: r.created_at });

const gToDb = (g) => ({ id: g.id, exercise_id: g.exerciseId, target: g.target, deadline: g.deadline, completed: !!g.completed, completed_at: g.completedAt || null, created_at: g.createdAt });
const gFromDb = (r) => ({ id: r.id, exerciseId: r.exercise_id, target: Number(r.target) || 0, deadline: r.deadline, completed: !!r.completed, completedAt: r.completed_at || null, createdAt: r.created_at });

const sToDb = () => ({ id: 'main', active_plan_id: state.activePlanId, plan_done: state.planDone || {} });
const sFromDb = (r) => ({ activePlanId: r.active_plan_id || null, planDone: r.plan_done && typeof r.plan_done === 'object' ? r.plan_done : {} });

function sbStatus(kind) {
  const labels = {
    connecting: 'กำลังเชื่อมต่อ Supabase…',
    online: 'ซิงก์กับ Supabase แล้ว',
    local: 'โหมดเครื่อง (ออฟไลน์)',
  };
  document.querySelectorAll('.sync-status').forEach((chip) => {
    chip.dataset.state = kind;
    const text = chip.querySelector('.sync-text');
    if (text) text.textContent = labels[kind] || '';
  });
  if (kind === 'online') toast('เชื่อมต่อ Supabase แล้ว ☁️', '✅');
  if (kind === 'local') toast('ยังไม่ได้ตั้งค่า Supabase — ใช้โหมดท้องถิ่น', '⚠️');
}

async function sbInit() {
  if (!sbConfigured()) { sbStatus('local'); return; }
  if (typeof window.supabase === 'undefined' || !window.supabase.createClient) { sbStatus('local'); return; }
  try {
    sb = window.supabase.createClient(SB_CFG.url, SB_CFG.anonKey);
    if (SB_CFG.useAuth) {
      const { error } = await sb.auth.signInAnonymously();
      if (error) console.warn('Anonymous sign-in:', error.message);
    }
  } catch (e) {
    console.error('Supabase init failed:', e);
    sb = null;
    sbStatus('local');
    return;
  }

  sbStatus('connecting');
  const ok = await sbLoad();
  if (!ok) { sb = null; sbStatus('local'); return; }
  sbOnline = true;
  sbStatus('online');
  sbSubscribe();
}

async function sbLoad() {
  if (!sb) return false;
  try {
    const [w, g, s] = await Promise.all([
      sb.from('workouts').select('*'),
      sb.from('goals').select('*'),
      sb.from('settings').select('*').eq('id', 'main').maybeSingle(),
    ]);
    if (w.error) throw w.error;
    if (g.error) throw g.error;
    if (s.error) throw s.error;

    const serverWorkouts = (w.data || []).map(wFromDb);
    const serverGoals = (g.data || []).map(gFromDb);
    const serverSettings = s.data ? sFromDb(s.data) : null;

    // โยกย้ายข้อมูลเก่าจาก localStorage ขึ้น Supabase เมื่อเซิร์ฟเวอร์ยังว่าง
    const hadLocal = state.workouts.length > 0 || state.goals.length > 0 || state.activePlanId || Object.keys(state.planDone).length > 0;
    if (hadLocal && serverWorkouts.length === 0 && serverGoals.length === 0 && !serverSettings) {
      await sbPushAll();
      return sbLoad();
    }

    // ใช้ข้อมูลจากเซิร์ฟเวอร์เป็นหลัก
    state.workouts = serverWorkouts;
    state.goals = serverGoals;
    if (serverSettings) {
      state.activePlanId = serverSettings.activePlanId;
      state.planDone = serverSettings.planDone;
    }
    cacheSave();
    renderAll();
    return true;
  } catch (e) {
    console.error('Supabase load failed:', e);
    return false;
  }
}

async function sbPushAll() {
  if (!sb) return;
  if (sbPushing) { sbPendingPush = true; return; }
  sbPushing = true;
  try {
    const workouts = state.workouts.map(wToDb);
    const goals = state.goals.map(gToDb);
    if (workouts.length) await sb.from('workouts').upsert(workouts);
    if (goals.length) await sb.from('goals').upsert(goals);
    await sb.from('settings').upsert(sToDb());
    if (!sbOnline) { sbOnline = true; sbStatus('online'); }
  } catch (e) {
    console.error('Supabase push failed:', e);
    if (sbOnline) { sbOnline = false; sbStatus('local'); }
  } finally {
    sbPushing = false;
    if (sbPendingPush) { sbPendingPush = false; sbPushAll(); }
  }
}

function sbSubscribe() {
  if (!sb) return;
  sb.channel('calitrack-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'workouts' }, (payload) => {
      if (payload.eventType === 'DELETE') {
        const id = payload.old && payload.old.id;
        state.workouts = state.workouts.filter((x) => x.id !== id);
      } else if (payload.new) {
        const w = wFromDb(payload.new);
        const i = state.workouts.findIndex((x) => x.id === w.id);
        if (i >= 0) state.workouts[i] = w; else state.workouts.push(w);
      }
      cacheSave();
      renderAll();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, (payload) => {
      if (payload.eventType === 'DELETE') {
        const id = payload.old && payload.old.id;
        state.goals = state.goals.filter((x) => x.id !== id);
      } else if (payload.new) {
        const g = gFromDb(payload.new);
        const i = state.goals.findIndex((x) => x.id === g.id);
        if (i >= 0) state.goals[i] = g; else state.goals.push(g);
      }
      cacheSave();
      renderAll();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
      if (payload.new) {
        const s = sFromDb(payload.new);
        state.activePlanId = s.activePlanId;
        state.planDone = s.planDone;
        cacheSave();
        renderAll();
      }
    })
    .subscribe((status, err) => {
      if (err) console.error('Supabase realtime error:', err);
      if (status === 'SUBSCRIBED') console.log('Realtime subscribed');
    });
}

// บันทึก: เขียนลง cache (localStorage) ทันที + ซิงก์ขึ้น Supabase แบบไม่บล็อก UI
const save = () => {
  cacheSave();
  if (sb) sbPushAll();
};

window.addEventListener('online', async () => {
  if (sb && !sbOnline) {
    await sbPushAll();
    const ok = await sbLoad();
    if (ok) { sbOnline = true; sbStatus('online'); }
  }
});

window.addEventListener('offline', () => {
  if (sb && sbOnline) { sbOnline = false; sbStatus('local'); }
});

/* ---------------- Utils ---------------- */

const $ = (sel) => document.querySelector(sel);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
const todayStr = () => isoDate(new Date());

const thaiDateLong = (d) =>
  new Intl.DateTimeFormat('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);

const thaiDateShort = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('th-TH', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
};

const weekdayShort = (d) => new Intl.DateTimeFormat('th-TH', { weekday: 'short' }).format(d);

const fmtNum = (n) => Math.round(n).toLocaleString('th-TH');

function volume(w) {
  const ex = exById(w.exerciseId);
  return ex.unit === 'time' ? (Number(w.duration) || 0) * (Number(w.sets) || 1) : (Number(w.reps) || 0) * (Number(w.sets) || 1);
}

function volLabel(w) {
  const ex = exById(w.exerciseId);
  const base = ex.unit === 'time' ? `${w.sets} เซ็ต × ${w.duration} วิ` : `${w.sets} เซ็ต × ${w.reps} ครั้ง`;
  const wgt = Number(w.weight) > 0 ? ` + ${w.weight} กก.` : '';
  return base + wgt;
}

const volumeOn = (dateStr) => state.workouts.filter((w) => w.date === dateStr).reduce((s, w) => s + volume(w), 0);
const totalVolume = (exId) => state.workouts.filter((w) => w.exerciseId === exId).reduce((s, w) => s + volume(w), 0);
const workoutsOn = (dateStr) => state.workouts.filter((w) => w.date === dateStr).length;

function streak() {
  let n = 0;
  const d = new Date();
  if (workoutsOn(isoDate(d)) === 0) d.setDate(d.getDate() - 1);
  while (workoutsOn(isoDate(d)) > 0) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function relDate(dateStr) {
  if (dateStr === todayStr()) return 'วันนี้';
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (dateStr === isoDate(y)) return 'เมื่อวาน';
  return thaiDateShort(dateStr);
}

function compact(n) {
  if (n >= 10000) return (n / 1000).toFixed(1) + 'k';
  if (n >= 1000) return (n / 1000).toFixed(2).replace(/\.?0+$/, '') + 'k';
  return fmtNum(n);
}

/* ---------------- Toast ---------------- */

function toast(msg, ico = '✅') {
  const wrap = $('#toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="t-ico">${ico}</span><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

/* ---------------- Confetti ---------------- */

function confetti() {
  const colors = ['#4da6ff', '#22b8e6', '#4ade80', '#7dd3fc', '#facc15', '#c084fc'];
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('div');
    p.className = 'confetti';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = 2.2 + Math.random() * 2 + 's';
    p.style.animationDelay = Math.random() * 0.6 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 5200);
  }
}

/* ---------------- Video modal (คลิปแนะนำท่า) ---------------- */

let activeVideoId = '';

function openVideoModal(exId) {
  const ex = exById(exId);
  $('#video-title').textContent = `${ex.emoji} คลิปแนะนำ: ${ex.name}`;
  activeVideoId = ex.video;
  $('#video-link').href = `https://www.youtube.com/watch?v=${ex.video}`;
  $('#video-frame').innerHTML =
    `<div class="video-placeholder">
      <span class="video-play-ico">▶</span>
      <span class="video-play-txt">คลิกเพื่อดูคลิปแนะนำท่า ${ex.name}</span>
    </div>`;
  $('#video-modal').hidden = false;
  document.body.style.overflow = 'hidden';
}

function loadVideo() {
  if (!$('#video-frame iframe')) {
    $('#video-frame').innerHTML =
      `<iframe src="https://www.youtube.com/embed/${activeVideoId}" title="คลิปแนะนำท่า" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  }
}

function closeVideoModal() {
  const modal = $('#video-modal');
  if (modal.hidden) return;
  modal.hidden = true;
  $('#video-frame').innerHTML = '';
  document.body.style.overflow = '';
}

/* ---------------- Plans page (แผนการฝึก) ---------------- */

function planDoneDays(planId) {
  const arr = state.planDone[planId];
  return Array.isArray(arr) ? arr.filter((i) => i >= 0 && i < (planById(planId)?.days.length || 0)) : [];
}

function planProgress(planId) {
  const plan = planById(planId);
  if (!plan) return { done: 0, total: 0, pct: 0 };
  const done = planDoneDays(planId).length;
  return { done, total: plan.days.length, pct: Math.round((done / plan.days.length) * 100) };
}

function renderPlanPicker() {
  const el = $('#plan-picker');
  el.innerHTML = PLANS.map((p) => {
    const active = state.activePlanId === p.id;
    const prog = planProgress(p.id);
    return `
      <div class="plan-pick-card ${active ? 'active' : ''}" data-plan="${p.id}">
        <div class="plan-pick-top">
          <span class="plan-pick-emoji">${p.emoji}</span>
          <span class="chip ${active ? 'gradient' : ''}">${active ? 'กำลังฝึก' : p.level}</span>
        </div>
        <h4>${p.name}</h4>
        <p>${p.tagline}</p>
        <div class="plan-pick-meta">${p.schedule}</div>
        ${prog.done > 0 ? `<div class="bar-track"><div class="bar-fill ${prog.done >= prog.total ? 'complete' : ''}" style="width:${prog.pct}%"></div></div><div class="goal-mini-nums"><span>ทำแล้ว <b>${prog.done}/${prog.total}</b> วัน</span><span>${prog.pct}%</span></div>` : ''}
      </div>`;
  }).join('');
}

function renderPlanDetail() {
  const el = $('#plan-detail');
  const plan = planById(state.activePlanId);
  if (!plan) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="es-emoji">🗓️</span>
        <h4>ยังไม่ได้เลือกแผนการฝึก</h4>
        <p>เลือกแผนข้างบนเพื่อเริ่มฝึกตามโปรแกรม หรือใช้หน้า "บันทึกการฝึก" ฝึกแบบอิสระได้เลย</p>
      </div>`;
    return;
  }

  const done = new Set(planDoneDays(plan.id));
  const prog = planProgress(plan.id);
  const allDone = prog.done >= prog.total;

  el.innerHTML = `
    <div class="card plan-hero">
      <div class="plan-hero-top">
        <div>
          <h3>${plan.emoji} ${plan.name} <span class="chip gradient">${plan.level}</span></h3>
          <p class="plan-hero-sub">${plan.tagline}</p>
        </div>
        <div class="plan-hero-prog">
          <span class="plan-hero-pct">${prog.pct}%</span>
          <span class="plan-hero-count">${prog.done}/${prog.total} วัน</span>
        </div>
      </div>
      <div class="bar-track"><div class="bar-fill ${allDone ? 'complete' : ''}" style="width:${prog.pct}%"></div></div>
      ${allDone ? '<div class="plan-hero-done">🎉 ทำครบทั้งแผนแล้ว! ยกเลิกวันใดก็ได้เพื่อฝึกซ้ำ หรือลองแผนที่ยากขึ้น</div>' : ''}
    </div>
    <div class="plan-week">
      ${plan.days.map((day, i) => {
        const isDone = done.has(i);
        return `
        <div class="card plan-day ${isDone ? 'done' : ''}">
          <div class="plan-day-head">
            <div>
              <h4>${day.name}</h4>
              <span class="plan-day-focus">${day.focus}</span>
            </div>
            <div class="plan-day-actions">
              <span class="plan-day-status ${isDone ? 'ok' : ''}">${isDone ? '✅ ทำครบแล้ว' : 'ยังไม่ทำ'}</span>
              <button class="btn-small ${isDone ? 'success' : ''}" data-planday="${plan.id}|${i}">${isDone ? 'ยกเลิก' : 'ทำครบแล้ว'}</button>
            </div>
          </div>
          <div class="plan-ex-list">
            ${day.exercises.map((exr) => {
              const ex = exById(exr.ex);
              const target = exr.dur ? `${exr.sets} เซ็ต × ${exr.dur} วินาที` : `${exr.sets} เซ็ต × ${exr.reps} ครั้ง`;
              return `
              <div class="plan-ex">
                <span class="plan-ex-emoji">${ex.emoji}</span>
                <div class="plan-ex-info">
                  <div class="plan-ex-name">${ex.name}<button class="ex-video-mini" data-video="${ex.id}" title="ดูคลิปแนะนำ">▶</button></div>
                  <div class="plan-ex-target">${target}</div>
                </div>
                <button class="btn-small" data-planlog="${ex.id}|${exr.sets}|${exr.dur || exr.reps}">บันทึก</button>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function activatePlan(planId) {
  state.activePlanId = planId;
  save();
  renderPlanPicker();
  renderPlanDetail();
  renderDashPlan();
  toast(`เริ่มแผน "${planById(planId).name}" แล้ว สู้ๆ นะ! 💪`, '🗓️');
}

function togglePlanDay(planId, idx) {
  const arr = state.planDone[planId] || (state.planDone[planId] = []);
  const pos = arr.indexOf(idx);
  if (pos >= 0) {
    arr.splice(pos, 1);
    toast('ยกเลิกวันนี้แล้ว', '↩️');
  } else {
    arr.push(idx);
    const prog = planProgress(planId);
    if (prog.done >= prog.total) {
      confetti();
      toast('🎉 ทำครบทั้งแผนแล้ว! เยี่ยมมาก', '🏆');
    } else {
      toast('บันทึกว่าทำครบแล้ว!', '✅');
    }
  }
  save();
  renderPlanPicker();
  renderPlanDetail();
  renderDashPlan();
}

function logFromPlan(exId, sets, repsOrDur) {
  openLogForm(exId);
  $('#input-sets').value = sets;
  $('#input-reps').value = repsOrDur;
  const ex = exById(exId);
  toast(`เติมฟอร์มตามแผนแล้ว — ${ex.name} ${sets} เซ็ต × ${repsOrDur} ${ex.unit === 'time' ? 'วิ' : 'ครั้ง'} ลงวันนี้เลย!`, '🗓️');
  navigate('log');
}

function renderDashPlan() {
  const el = $('#dash-plan');
  const plan = planById(state.activePlanId);
  if (!plan) {
    el.innerHTML = `
      <div class="card-head"><h3>แผนการฝึก</h3><button class="text-btn" data-nav="plans">เลือกแผน →</button></div>
      <div class="dash-plan-empty">
        <span>🎯</span>
        <p>ยังไม่ได้เลือกแผน — เริ่มฝึกตามโปรแกรมที่มีคำแนะนำท่าและคลิปวิดีโอ</p>
        <button class="btn-small" data-nav="plans">เลือกแผนการฝึก</button>
      </div>`;
    return;
  }
  const prog = planProgress(plan.id);
  el.innerHTML = `
    <div class="card-head"><h3>แผนการฝึก: ${plan.emoji} ${plan.name}</h3><button class="text-btn" data-nav="plans">ดูแผน →</button></div>
    <div class="dash-plan-row">
      <span class="plan-hero-pct">${prog.pct}%</span>
      <div class="dash-plan-bar">
        <div class="bar-track"><div class="bar-fill ${prog.done >= prog.total ? 'complete' : ''}" style="width:${prog.pct}%"></div></div>
        <div class="goal-mini-nums"><span>ทำแล้ว <b>${prog.done}/${prog.total}</b> วัน</span><span>${prog.done >= prog.total ? '🎉 ครบแล้ว!' : 'รักษาความสม่ำเสมอนะ'}</span></div>
      </div>
    </div>`;
}

/* ---------------- Charts (SVG) ---------------- */

function last7Days() {
  const out = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = isoDate(d);
    out.push({ key, label: weekdayShort(d), vol: volumeOn(key), today: i === 0 });
  }
  return out;
}

function renderWeeklyChart() {
  const el = $('#weekly-chart');
  const days = last7Days();
  const total = days.reduce((s, d) => s + d.vol, 0);
  $('#weekly-total').textContent = total > 0 ? `รวม ${fmtNum(total)} ครั้ง` : 'ยังไม่มีข้อมูล';
  if (total === 0) {
    el.innerHTML = `<div class="chart-empty">ยังไม่มีข้อมูลการฝึกใน 7 วันนี้<br>เริ่มบันทึกการออกกำลังกายกันเลย 💪</div>`;
    return;
  }

  const W = 640, H = 215, padT = 28, padB = 26, padL = 12, padR = 12;
  const max = Math.max(...days.map((d) => d.vol));
  const bw = (W - padL - padR) / 7;
  const barW = bw * 0.52;
  const innerH = H - padT - padB;

  let bars = '';
  days.forEach((d, i) => {
    const h = (d.vol / max) * innerH;
    const x = padL + i * bw + (bw - barW) / 2;
    const y = padT + innerH - h;
    const cls = d.today ? 'chart-bar today' : 'chart-bar';
    bars += `
      <rect class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(h, 3).toFixed(1)}">
        <title>${d.label} — ${fmtNum(d.vol)} ครั้ง</title>
      </rect>
      ${d.vol > 0 ? `<text class="chart-val ${d.today ? 'today' : ''}" x="${(x + barW / 2).toFixed(1)}" y="${(y - 7).toFixed(1)}">${compact(d.vol)}</text>` : ''}
      <text class="chart-label ${d.today ? 'today' : ''}" x="${(x + barW / 2).toFixed(1)}" y="${H - 8}">${d.today ? 'วันนี้' : d.label}</text>`;
  });

  el.innerHTML = `
    <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4da6ff"/>
          <stop offset="100%" stop-color="#22b8e6"/>
        </linearGradient>
      </defs>
      <line class="chart-gridline" x1="${padL}" y1="${padT}" x2="${W - padR}" y2="${padT}"/>
      ${bars}
    </svg>`;
}

function progressData(exId) {
  const rows = {};
  state.workouts
    .filter((w) => w.exerciseId === exId)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .forEach((w) => { rows[w.date] = (rows[w.date] || 0) + volume(w); });

  const dates = Object.keys(rows).sort();
  let cum = 0;
  return dates.map((date) => { cum += rows[date]; return { date, vol: rows[date], cum }; });
}

function renderProgressChart() {
  const el = $('#progress-chart');
  const exId = $('#hist-exercise-filter').value;
  const ex = exId === 'all' ? null : exById(exId);

  if (state.workouts.length === 0) {
    el.innerHTML = `<div class="chart-empty">ยังไม่มีข้อมูลการฝึก<br>บันทึกการออกกำลังกายก่อน แล้วกราฟพัฒนาการจะปรากฏที่นี่ 📈</div>`;
    return;
  }

  const data = progressData(exId);
  if (data.length < 1) {
    el.innerHTML = `<div class="chart-empty">ยังไม่มีข้อมูลการฝึก${ex ? `ท่า ${ex.name}` : ''}<br>ลองเลือกท่าอื่น หรือบันทึกการฝึกก่อน 📈</div>`;
    return;
  }

  const W = 720, H = 260, padL = 48, padR = 18, padT = 18, padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.max(...data.map((d) => d.cum), 1);

  const niceMax = Math.ceil(maxVal / 5) * 5 || 5;
  const xOf = (i) => padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yOf = (v) => padT + innerH - (v / niceMax) * innerH;

  const pts = data.map((d, i) => [xOf(i), yOf(d.cum)]);

  // Grid + y labels
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const val = (niceMax / 4) * g;
    const y = yOf(val);
    grid += `<line class="chart-gridline" x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}"/>`;
    grid += `<text class="chart-label" x="${padL - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end">${compact(val)}</text>`;
  }

  // x labels (first, middle, last)
  const xIdx = [...new Set([0, Math.floor((data.length - 1) / 2), data.length - 1])];
  let xLabels = '';
  xIdx.forEach((i) => {
    xLabels += `<text class="chart-label" x="${xOf(i).toFixed(1)}" y="${H - 8}">${thaiDateShort(data[i].date)}</text>`;
  });

  const line = pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
  const area = `M ${padL} ${(padT + innerH).toFixed(1)} L ${line.replace(/ /g, ' L ')} L ${pts[pts.length - 1][0].toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;

  const dots = pts
    .map((p, i) => `<circle class="chart-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5"><title>${thaiDateShort(data[i].date)} — รวม ${fmtNum(data[i].cum)}</title></circle>`)
    .join('');

  el.innerHTML = `
    <svg class="chart" viewBox="0 0 ${W} ${H}">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(77,166,255,0.3)"/>
          <stop offset="100%" stop-color="rgba(77,166,255,0)"/>
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#4da6ff"/>
          <stop offset="100%" stop-color="#22b8e6"/>
        </linearGradient>
      </defs>
      ${grid}
      <path class="chart-area" d="${area}"/>
      <polyline class="chart-line" points="${line}"/>
      ${dots}
      ${xLabels}
    </svg>`;
}

/* ---------------- Dashboard ---------------- */

function renderDashboard() {
  $('#dash-date').textContent = thaiDateLong(new Date());

  const todayCount = workoutsOn(todayStr());
  const todayVol = volumeOn(todayStr());
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yestVol = volumeOn(isoDate(yest));

  const trendPct = yestVol > 0 ? Math.round(((todayVol - yestVol) / yestVol) * 100) : (todayVol > 0 ? 100 : 0);
  const trendTxt = todayVol === 0 ? 'เริ่มเลยวันนี้!' : trendPct >= 0 ? `เพิ่มขึ้น ${trendPct}% จากเมื่อวาน` : `ลดลง ${Math.abs(trendPct)}% จากเมื่อวาน`;

  const week7 = last7Days().reduce((s, d) => s + d.vol, 0);
  const totalSessions = state.workouts.length;
  const totalVol = state.workouts.reduce((s, w) => s + volume(w), 0);
  const activeDays = new Set(state.workouts.map((w) => w.date)).size;
  const st = streak();

  $('#dash-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">🏋️</div>
      <div class="stat-value">${fmtNum(todayVol)} <em>ครั้ง</em></div>
      <div class="stat-label">วอลุ่มวันนี้ (${todayCount} รายการ)</div>
      <span class="stat-trend ${todayVol === 0 ? 'flat' : 'up'}">${todayVol === 0 ? '◌ ' : '▲ '}${trendTxt}</span>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📅</div>
      <div class="stat-value">${fmtNum(week7)} <em>ครั้ง</em></div>
      <div class="stat-label">วอลุ่ม 7 วันล่าสุด</div>
      <span class="stat-trend ${week7 > 0 ? 'up' : 'flat'}">${week7 > 0 ? '▲ กำลังไปได้สวย' : '◌ เริ่มฝึกกันเลย'}</span>
    </div>
    <div class="stat-card">
      <div class="stat-icon">💪</div>
      <div class="stat-value">${fmtNum(totalVol)} <em>ครั้ง</em></div>
      <div class="stat-label">วอลุ่มรวมทั้งหมด (${fmtNum(totalSessions)} ครั้งฝึก)</div>
      <span class="stat-trend ${activeDays > 0 ? 'up' : 'flat'}">${activeDays > 0 ? `▲ ${fmtNum(activeDays)} วันที่มีการฝึก` : '◌ ยังไม่มีข้อมูล'}</span>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🔥</div>
      <div class="stat-value">${st} <em>วัน</em></div>
      <div class="stat-label">สตรีคต่อเนื่อง</div>
      <span class="stat-trend ${st > 0 ? 'up' : 'flat'}">${st > 0 ? '▲ รักษาไว้!' : '◌ เริ่มสตรีควันนี้'}</span>
    </div>`;

  renderWeeklyChart();
  renderDashGoals();
  renderDashRecent();
  renderDashPlan();
}

function renderDashGoals() {
  const el = $('#dash-goals');
  const open = state.goals.filter((g) => !g.completed);
  if (open.length === 0) {
    el.innerHTML = `
      <div class="empty-state" style="padding:26px 10px">
        <span class="es-emoji">🎯</span>
        <h4>ยังไม่มีเป้าหมาย</h4>
        <p>ตั้งเป้าหมายแรกเพื่อฝึกอย่างมีทิศทาง</p>
      </div>`;
    return;
  }
  const top = open.slice(0, 3);
  el.innerHTML = top.map((g, i) => {
    const ex = exById(g.exerciseId);
    const cur = Math.min(totalVolume(g.exerciseId), g.target);
    const pct = Math.round((cur / g.target) * 100);
    return `
      <div class="goal-mini" style="animation-delay:${i * 0.06}s">
        <div class="goal-mini-top">
          <span class="goal-mini-name"><span class="g-emoji">${ex.emoji}</span> ${ex.name} × ${fmtNum(g.target)}</span>
          <span class="goal-mini-status ${pct >= 100 ? 'done' : 'wait'}">${pct >= 100 ? '🎉 ถึงเป้า!' : pct + '%'}</span>
        </div>
        <div class="bar-track"><div class="bar-fill ${pct >= 100 ? 'complete' : ''}" style="width:${pct}%"></div></div>
        <div class="goal-mini-nums"><span>ความคืบหน้า <b>${fmtNum(cur)}</b></span><span>เหลือ <b>${fmtNum(Math.max(g.target - cur, 0))}</b></span></div>
      </div>`;
  }).join('');
}

function renderDashRecent() {
  const el = $('#dash-recent');
  const recent = [...state.workouts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);
  if (recent.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="es-emoji">🏃</span>
        <h4>ยังไม่มีกิจกรรม</h4>
        <p>กดปุ่ม "บันทึกการฝึก" เพื่อเริ่มต้นวันนี้</p>
      </div>`;
    return;
  }
  el.innerHTML = recent.map((w, i) => {
    const ex = exById(w.exerciseId);
    return `
      <div class="w-item" style="animation-delay:${i * 0.05}s">
        <div class="w-emoji">${ex.emoji}</div>
        <div class="w-info">
          <div class="w-name">${ex.name}</div>
          <div class="w-detail">${volLabel(w)} · ${relDate(w.date)}</div>
        </div>
        <div class="w-volume ${ex.unit}">${fmtNum(volume(w))} ${ex.unit === 'time' ? 'วิ' : 'ครั้ง'}</div>
      </div>`;
  }).join('');
}

/* ---------------- Log page ---------------- */

let logCat = 'all';
let selectedEx = null;

function renderLogCats() {
  $('#log-cats').innerHTML = CATS.map(
    (c) => `<button class="filter-chip ${logCat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>`
  ).join('');
}

function renderExerciseGrid() {
  const list = EXERCISES.filter((e) => logCat === 'all' || e.cat === logCat);
  $('#exercise-grid').innerHTML = list
    .map((e) => {
      const vol = totalVolume(e.id);
      return `
        <div class="exercise-card ${selectedEx === e.id ? 'selected' : ''}" data-ex="${e.id}">
          ${vol > 0 ? `<span class="ex-vol">${compact(vol)} ${e.unit === 'time' ? 'วิ' : ''}</span>` : ''}
          <button class="ex-video-btn" data-video="${e.id}" title="ดูคลิปแนะนำท่า">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5z"/></svg>
          </button>
          <span class="ex-emoji">${e.emoji}</span>
          <span class="ex-name">${e.name}</span>
          <span class="ex-cat">${CAT_LABEL[e.cat]}</span>
        </div>`;
    })
    .join('');
}

function openLogForm(exId) {
  selectedEx = exId;
  const ex = exById(exId);
  $('#form-exercise-pill').innerHTML = `<span class="ex-emoji">${ex.emoji}</span> ${ex.name} — ${CAT_LABEL[ex.cat]}<button class="ex-video-mini" data-video="${ex.id}" title="ดูคลิปแนะนำท่า">▶</button>`;
  const isTime = ex.unit === 'time';
  $('#reps-label').textContent = isTime ? 'วินาที / เซ็ต' : 'ครั้ง / เซ็ต';
  $('#field-reps').hidden = false;
  if (isTime) $('#input-reps').value = 30;
  else $('#input-reps').value = 10;
  $('#input-sets').value = 3;
  $('#input-weight').value = '';
  $('#input-notes').value = '';
  $('#log-form-card').hidden = false;
  renderExerciseGrid();
  $('#log-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeLogForm() {
  selectedEx = null;
  $('#log-form-card').hidden = true;
  renderExerciseGrid();
}

function renderToday() {
  const el = $('#today-list');
  const t = new Date();
  $('#today-title').textContent = `วันนี้ (${thaiDateShort(todayStr())})`;
  const todays = state.workouts
    .filter((w) => w.date === todayStr())
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const count = todays.length;
  const vol = todays.reduce((s, w) => s + volume(w), 0);
  $('#today-total').textContent = count > 0 ? `${count} รายการ · ${fmtNum(vol)} ครั้ง` : '—';

  if (count === 0) {
    el.innerHTML = `
      <div class="empty-state" style="padding:28px 10px">
        <span class="es-emoji">🌅</span>
        <h4>ยังไม่ได้ฝึกวันนี้</h4>
        <p>เลือกท่าข้างบนแล้วกดบันทึกได้เลย</p>
      </div>`;
    return;
  }

  el.innerHTML = todays.map((w, i) => {
    const ex = exById(w.exerciseId);
    return `
      <div class="w-item" style="animation-delay:${i * 0.05}s">
        <div class="w-emoji">${ex.emoji}</div>
        <div class="w-info">
          <div class="w-name">${ex.name}</div>
          <div class="w-detail">${volLabel(w)}</div>
          ${w.notes ? `<div class="w-notes">“${escapeHtml(w.notes)}”</div>` : ''}
        </div>
        <div class="w-volume ${ex.unit}">${fmtNum(volume(w))} ${ex.unit === 'time' ? 'วิ' : 'ครั้ง'}</div>
        <button class="w-del" data-del="${w.id}" title="ลบ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
        </button>
      </div>`;
  }).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function addWorkout() {
  if (!selectedEx) { toast('กรุณาเลือกท่าออกกำลังกายก่อน', '⚠️'); return; }
  const ex = exById(selectedEx);
  const sets = Math.max(1, Math.min(99, parseInt($('#input-sets').value, 10) || 1));
  const reps = Math.max(1, Math.min(999, parseInt($('#input-reps').value, 10) || 1));
  const weight = Math.max(0, parseFloat($('#input-weight').value) || 0);
  const notes = $('#input-notes').value.trim();

  const w = {
    id: uid(),
    exerciseId: ex.id,
    sets,
    reps: ex.unit === 'time' ? reps : reps,
    duration: ex.unit === 'time' ? reps : 0,
    weight,
    notes,
    date: todayStr(),
    createdAt: new Date().toISOString(),
  };
  state.workouts.push(w);
  save();

  const total = volume(w);
  toast(`บันทึกแล้ว! ${ex.name} ${fmtNum(total)} ${ex.unit === 'time' ? 'วิ' : 'ครั้ง'} 💪`, '🎉');

  $('#input-notes').value = '';
  $('#input-weight').value = '';
  renderAll();
  checkGoalCrossings();
}

/* ---------------- Goals page ---------------- */

function goalProgress(g) {
  return Math.min(totalVolume(g.exerciseId), g.target);
}

function renderGoalFormOptions() {
  $('#goal-exercise').innerHTML = EXERCISES.map((e) => `<option value="${e.id}">${e.emoji} ${e.name}</option>`).join('');
  const d = new Date();
  d.setDate(d.getDate() + 30);
  $('#goal-deadline').value = isoDate(d);
  updateGoalHint();
}

function updateGoalHint() {
  const ex = exById($('#goal-exercise').value);
  $('#goal-hint').textContent =
    ex.unit === 'time'
      ? `นับจากวินาทีรวมของท่า ${ex.name} เช่น ตั้งเป้าแพลงก์รวม 600 วินาที (10 นาที)`
      : `นับจากยอดรวมของท่า ${ex.name} เช่น ตั้งเป้าดึงข้อรวม 100 ครั้งต่อเดือน`;
}

function renderGoals() {
  const el = $('#goal-list');
  const open = state.goals.filter((g) => !g.completed).sort((a, b) => (a.deadline < b.deadline ? -1 : 1));
  const done = state.goals.filter((g) => g.completed).sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1));

  if (state.goals.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="es-emoji">🎯</span>
        <h4>ยังไม่มีเป้าหมาย</h4>
        <p>กดปุ่ม "ตั้งเป้าหมายใหม่" เพื่อตั้งเป้าหมายแรก เช่น วิดพื้นรวม 500 ครั้งใน 30 วัน</p>
      </div>`;
    return;
  }

  const goalCard = (g, i) => {
    const ex = exById(g.exerciseId);
    const cur = totalVolume(g.exerciseId);
    const reached = cur >= g.target && !g.completed;
    const pct = Math.min(Math.round((cur / g.target) * 100), 100);
    const unitTxt = ex.unit === 'time' ? 'วิ' : 'ครั้ง';

    const dl = new Date(g.deadline + 'T23:59:59');
    const daysLeft = Math.ceil((dl - new Date()) / 86400000);
    const urgent = !g.completed && daysLeft <= 3 && daysLeft >= 0;
    const overdue = !g.completed && daysLeft < 0;
    const dlTxt = overdue
      ? `เลยกำหนด ${Math.abs(daysLeft)} วัน`
      : g.completed
        ? `สำเร็จวันที่ ${thaiDateShort(g.completedAt ? g.completedAt.slice(0, 10) : todayStr())}`
        : daysLeft <= 0 ? 'ครบกำหนดวันนี้' : `เหลืออีก ${daysLeft} วัน`;

    return `
      <div class="goal-card ${g.completed ? 'completed' : ''}" style="animation-delay:${i * 0.05}s">
        <div class="goal-emoji">${ex.emoji}</div>
        <div class="goal-main">
          <div class="goal-title">
            ${ex.name}
            ${g.completed ? '<span class="chip" style="color:var(--success);background:var(--success-bg)">✅ สำเร็จแล้ว</span>'
              : reached ? '<span class="chip gradient">🎉 ถึงเป้าแล้ว! กดรับรางวัล</span>'
              : `<span class="chip">${pct}%</span>`}
          </div>
          <div class="goal-deadline ${urgent || overdue ? 'urgent' : ''}">
            เป้าหมาย ${fmtNum(g.target)} ${unitTxt} · ${dlTxt} ${urgent ? '· ⏰ ใกล้ถึงกำหนด!' : ''}
          </div>
          <div class="bar-track"><div class="bar-fill ${g.completed ? 'complete' : ''}" style="width:${g.completed ? 100 : pct}%"></div></div>
          <div class="goal-mini-nums"><span>ทำได้แล้ว <b>${fmtNum(cur)}</b> / ${fmtNum(g.target)} ${unitTxt}</span><span>${g.completed ? 'สมบูรณ์แบบ!' : `เหลือ ${fmtNum(Math.max(g.target - cur, 0))} ${unitTxt}`}</span></div>
        </div>
        <div class="goal-actions">
          ${reached ? `<button class="btn-small success" data-complete="${g.id}">รับรางวัล 🏆</button>` : ''}
          <button class="btn-small danger" data-delgoal="${g.id}">ลบ</button>
        </div>
      </div>`;
  };

  el.innerHTML = [...open.map(goalCard), ...done.map(goalCard)].map((s, i) => s).join('')
    + (open.length === 0 && done.length > 0 ? '' : '');
  if (open.length === 0 && done.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="es-emoji">🎯</span>
        <h4>ยังไม่มีเป้าหมาย</h4>
        <p>กดปุ่ม "ตั้งเป้าหมายใหม่" เพื่อตั้งเป้าหมายแรก เช่น วิดพื้นรวม 500 ครั้งใน 30 วัน</p>
      </div>`;
  }
}

function saveGoal() {
  const exId = $('#goal-exercise').value;
  const target = Math.max(1, parseInt($('#goal-target').value, 10) || 1);
  const deadline = $('#goal-deadline').value || isoDate(new Date(Date.now() + 30 * 86400000));
  state.goals.push({ id: uid(), exerciseId: exId, target, deadline, completed: false, createdAt: new Date().toISOString() });
  save();
  $('#goal-form-card').hidden = true;
  toast('ตั้งเป้าหมายแล้ว! สู้ๆ นะ 💪', '🎯');
  renderAll();
}

function checkGoalCrossings() {
  const reached = state.goals.find((g) => !g.completed && totalVolume(g.exerciseId) >= g.target);
  if (reached) {
    const ex = exById(reached.exerciseId);
    toast(`ถึงเป้าแล้ว! ${ex.name} ${fmtNum(reached.target)} — ไปกดรับรางวัลในหน้าเป้าหมาย 🏆`, '🎊');
  }
}

/* ---------------- History page ---------------- */

function renderHistStats() {
  const totalSessions = state.workouts.length;
  const totalVol = state.workouts.reduce((s, w) => s + volume(w), 0);
  const activeDays = new Set(state.workouts.map((w) => w.date)).size;
  const st = streak();
  const bestDay = [...state.workouts.reduce((m, w) => m.set(w.date, (m.get(w.date) || 0) + volume(w)), new Map()).entries()]
    .sort((a, b) => b[1] - a[1])[0];

  $('#hist-stats').innerHTML = `
    <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-value">${fmtNum(totalSessions)} <em>ครั้ง</em></div><div class="stat-label">บันทึกการฝึกทั้งหมด</div></div>
    <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">${fmtNum(totalVol)} <em>ครั้ง</em></div><div class="stat-label">วอลุ่มรวมทั้งหมด</div></div>
    <div class="stat-card"><div class="stat-icon">🗓️</div><div class="stat-value">${fmtNum(activeDays)} <em>วัน</em></div><div class="stat-label">จำนวนวันที่มีการฝึก</div></div>
    <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-value">${bestDay ? fmtNum(bestDay[1]) : 0} <em>ครั้ง</em></div><div class="stat-label">วันที่ดีที่สุด${bestDay ? ` (${thaiDateShort(bestDay[0])})` : ''}</div></div>`;
}

function renderHistFilter() {
  $('#hist-exercise-filter').innerHTML =
    `<option value="all">ทั้งหมด (ทุกท่า)</option>` +
    EXERCISES.map((e) => `<option value="${e.id}">${e.emoji} ${e.name}</option>`).join('');
}

function renderHistory() {
  $('#hist-count').textContent = `${fmtNum(state.workouts.length)} รายการ`;
  const el = $('#history-list');
  if (state.workouts.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="es-emoji">🗂️</span>
        <h4>ยังไม่มีประวัติการฝึก</h4>
        <p>เมื่อบันทึกการออกกำลังกาย ประวัติจะแสดงที่นี่</p>
      </div>`;
    return;
  }

  const sorted = [...state.workouts].sort((a, b) => (a.date === b.date ? (a.createdAt < b.createdAt ? 1 : -1) : a.date < b.date ? 1 : -1));

  const groups = {};
  sorted.forEach((w) => { (groups[w.date] = groups[w.date] || []).push(w); });

  el.innerHTML = Object.entries(groups).map(([date, items]) => {
    const dayVol = items.reduce((s, w) => s + volume(w), 0);
    return `
      <div class="h-group">
        <div class="h-group-date">
          <span>${relDate(date)}</span>
          <span class="h-count">${items.length} รายการ · ${fmtNum(dayVol)} ครั้ง</span>
        </div>
        ${items.map((w, i) => {
          const ex = exById(w.exerciseId);
          return `
            <div class="w-item" style="animation-delay:${i * 0.04}s">
              <div class="w-emoji">${ex.emoji}</div>
              <div class="w-info">
                <div class="w-name">${ex.name}</div>
                <div class="w-detail">${volLabel(w)}</div>
                ${w.notes ? `<div class="w-notes">“${escapeHtml(w.notes)}”</div>` : ''}
              </div>
              <div class="w-volume ${ex.unit}">${fmtNum(volume(w))} ${ex.unit === 'time' ? 'วิ' : 'ครั้ง'}</div>
              <button class="w-del" data-del="${w.id}" title="ลบ">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
              </button>
            </div>`;
        }).join('')}
      </div>`;
  }).join('');
}

/* ---------------- Navigation ---------------- */

function navigate(page) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const target = $('#page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item, .m-nav-item').forEach((n) => n.classList.toggle('active', n.dataset.nav === page));

  if (page === 'dashboard') renderDashboard();
  if (page === 'log') { renderLogCats(); renderExerciseGrid(); renderToday(); }
  if (page === 'plans') { renderPlanPicker(); renderPlanDetail(); }
  if (page === 'goals') { renderGoals(); }
  if (page === 'history') { renderHistStats(); renderHistFilter(); renderProgressChart(); renderHistory(); }

  revealCurrentPage();
  window.scrollTo({ top: 0 });
}

function renderAll() {
  renderDashboard();
  renderLogCats();
  renderExerciseGrid();
  renderToday();
  renderPlanPicker();
  renderPlanDetail();
  renderGoals();
  renderDashPlan();
  renderHistStats();
  renderHistFilter();
  renderProgressChart();
  renderHistory();
}

/* ---------------- Export / Reset ---------------- */

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `calitrack-backup-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('ส่งออกข้อมูลสำเร็จ 📦', '💾');
}

function resetData() {
  if (!confirm('ต้องการล้างข้อมูลทั้งหมดจริงหรือ? (บันทึกการฝึกและเป้าหมายทั้งหมดจะหายไป)')) return;
  state = { workouts: [], goals: [], activePlanId: null, planDone: {} };
  cacheSave();
  if (sb) {
    Promise.all([
      sb.from('workouts').delete().neq('id', ''),
      sb.from('goals').delete().neq('id', ''),
    ]).then(() => sb.from('settings').upsert(sToDb())).catch((e) => console.error('Supabase reset failed:', e));
  }
  renderAll();
  toast('ล้างข้อมูลเรียบร้อย', '🧹');
}

/* ---------------- Events ---------------- */

document.addEventListener('click', (e) => {
  const navBtn = e.target.closest('[data-nav]');
  if (navBtn) { navigate(navBtn.dataset.nav); return; }

  const videoBtn = e.target.closest('[data-video]');
  if (videoBtn) { openVideoModal(videoBtn.dataset.video); return; }

  const planBtn = e.target.closest('[data-plan]');
  if (planBtn) { activatePlan(planBtn.dataset.plan); return; }

  const planDayBtn = e.target.closest('[data-planday]');
  if (planDayBtn) {
    const [planId, idx] = planDayBtn.dataset.planday.split('|');
    togglePlanDay(planId, parseInt(idx, 10));
    return;
  }

  const planLogBtn = e.target.closest('[data-planlog]');
  if (planLogBtn) {
    const [exId, sets, reps] = planLogBtn.dataset.planlog.split('|');
    logFromPlan(exId, parseInt(sets, 10), parseInt(reps, 10));
    return;
  }

  const catBtn = e.target.closest('[data-cat]');
  if (catBtn) {
    logCat = catBtn.dataset.cat;
    renderLogCats();
    renderExerciseGrid();
    return;
  }

  const exCard = e.target.closest('[data-ex]');
  if (exCard) { openLogForm(exCard.dataset.ex); return; }

  const delBtn = e.target.closest('[data-del]');
  if (delBtn) {
    const id = delBtn.dataset.del;
    if (!confirm('ลบรายการนี้? ')) return;
    state.workouts = state.workouts.filter((w) => w.id !== id);
    save();
    renderAll();
    toast('ลบรายการแล้ว', '🗑️');
    return;
  }

  const delGoal = e.target.closest('[data-delgoal]');
  if (delGoal) {
    if (!confirm('ลบเป้าหมายนี้?')) return;
    state.goals = state.goals.filter((g) => g.id !== delGoal.dataset.delgoal);
    save();
    renderAll();
    toast('ลบเป้าหมายแล้ว', '🗑️');
    return;
  }

  const completeGoal = e.target.closest('[data-complete]');
  if (completeGoal) {
    const g = state.goals.find((x) => x.id === completeGoal.dataset.complete);
    if (g) {
      g.completed = true;
      g.completedAt = new Date().toISOString();
      save();
      confetti();
      toast('สุดยอด! บรรลุเป้าหมายแล้ว 🏆', '🎊');
      renderAll();
    }
    return;
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'goal-exercise') updateGoalHint();
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'hist-exercise-filter') renderProgressChart();
});

// Steppers
document.querySelectorAll('.stepper button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.stepper').querySelector('input');
    const step = parseInt(btn.dataset.step, 10);
    const val = (parseInt(input.value, 10) || 0) + step;
    const max = input.max ? parseInt(input.max, 10) : 999;
    const min = input.min ? parseInt(input.min, 10) : 0;
    input.value = Math.max(min, Math.min(max, val));
  });
});

// Top-level buttons
$('#btn-quick-log').addEventListener('click', () => navigate('log'));
$('#btn-cancel-log').addEventListener('click', closeLogForm);
$('#btn-add-log').addEventListener('click', addWorkout);
$('#btn-close-video').addEventListener('click', closeVideoModal);
$('#video-modal').addEventListener('click', (e) => {
  if (e.target === $('#video-modal')) closeVideoModal();
  if (e.target.closest('.video-placeholder')) loadVideo();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideoModal(); });
$('#btn-export').addEventListener('click', exportData);
$('#btn-reset').addEventListener('click', resetData);
$('#btn-open-goal-form').addEventListener('click', () => {
  const card = $('#goal-form-card');
  card.hidden = !card.hidden;
  if (!card.hidden) {
    renderGoalFormOptions();
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
$('#btn-cancel-goal').addEventListener('click', () => { $('#goal-form-card').hidden = true; });
$('#btn-save-goal').addEventListener('click', saveGoal);

/* ---------------- Theme ---------------- */

const THEME_KEY = 'calitrack.theme';

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  const dark = theme === 'dark';
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.setAttribute('aria-label', dark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด');
    const label = btn.querySelector('.theme-label');
    if (label) label.textContent = dark ? 'โหมดสว่าง' : 'โหมดมืด';
  });
}

function initTheme() {
  let saved = 'dark';
  try { saved = localStorage.getItem(THEME_KEY) || 'dark'; } catch { /* ignore */ }
  applyTheme(saved === 'light' ? 'light' : 'dark');
}

document.querySelectorAll('.theme-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    toast(next === 'dark' ? 'สลับเป็นโหมดมืดแล้ว 🌙' : 'สลับเป็นโหมดสว่างแล้ว ☀️', '🎨');
  });
});

/* ---------------- Motion & 3D ---------------- */

let revealObserver = null;

function initRevealObserver() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
}

// เตรียมการ์ด/คอนเทนต์ในหน้าปัจจุบันให้แสดงแบบค่อยๆ โผล่ (stagger)
function revealCurrentPage() {
  if (!revealObserver) return;
  const scope = document.querySelector('.page.active');
  if (!scope) return;
  const targets = scope.querySelectorAll(
    '.card, .stat-card, .dash-hero, .banner-head, .plan-pick-card, .plan-day, .plan-hero, ' +
    '.exercise-card, .goal-card, .filter-chips, .empty-state, .log-form-card, .goal-form-card, .dash-grid'
  );
  targets.forEach((el, i) => {
    if (el.classList.contains('in-view')) return;
    let delay = Math.min((i % 8) * 0.06, 0.4);
    const ad = el.style && el.style.animationDelay;
    if (ad) {
      const sec = parseFloat(ad);
      if (!isNaN(sec)) delay = Math.min(sec, 0.5);
    }
    el.style.setProperty('--rd', delay + 's');
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

function initMotion() {
  initRevealObserver();
}

/* ---------------- Init ---------------- */

initTheme();
initMotion();
renderAll();
revealCurrentPage();
sbInit();
