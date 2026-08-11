-- ============================================================
-- CaliTrack — Supabase Setup
-- ============================================================
-- วิธีใช้:
--   1) เปิดหน้า https://supabase.com/dashboard -> เลือกโปรเจกต์
--   2) เมนู SQL Editor -> New query -> วางสคริปต์นี้ -> Run
--   3) ไปที่ Project Settings -> API -> คัดลอก Project URL และ anon key
--      ไปวางในไฟล์ supabase.config.js
-- ============================================================

-- ---------- ตารางบันทึกการฝึก ----------
create table if not exists public.workouts (
  id          text primary key,
  exercise_id text not null,
  sets        int  not null default 1,
  reps        int  not null default 0,
  duration    int  not null default 0,
  weight      numeric not null default 0,
  notes       text not null default '',
  date        text not null,
  created_at  timestamptz not null default now()
);

-- ---------- ตารางเป้าหมาย ----------
create table if not exists public.goals (
  id           text primary key,
  exercise_id  text not null,
  target       int  not null,
  deadline     text not null,
  completed    boolean not null default false,
  completed_at text,
  created_at   timestamptz not null default now()
);

-- ---------- ตารางค่าตั้งค่า (แผนที่กำลังฝึก + วันที่ทำครบ) ----------
create table if not exists public.settings (
  id             text primary key default 'main',
  active_plan_id text,
  plan_done      jsonb not null default '{}'::jsonb
);

-- ---------- เปิดใช้งาน Realtime (ซิงก์อัตโนมัติหลายอุปกรณ์) ----------
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'workouts') then
    alter publication supabase_realtime add table public.workouts;
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'goals') then
    alter publication supabase_realtime add table public.goals;
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'settings') then
    alter publication supabase_realtime add table public.settings;
  end if;
end $$;

-- ============================================================
-- หมายเหตุ: โหมดทดลองนี้ปิด Row Level Security ไว้
-- (ทุกคนที่ใช้ anon key จะเห็นข้อมูลชุดเดียวกัน — เหมาะสำหรับทดสอบ
-- และทำให้ข้อมูลซิงก์ข้ามอุปกรณ์ได้ทันที)
--
-- ถ้าต้องการให้ผู้ใช้แต่ละคนมีข้อมูลส่วนตัว (แนะนำเมื่อพร้อมเปิดจริง):
--   1) เปิด Dashboard -> Authentication -> Sign In / Up ->
--      เปิด "Allow anonymous sign-ins"
--   2) เปลี่ยน useAuth: true ใน supabase.config.js
--   3) เพิ่มคอลัมน์ user_id (uuid) ใน 3 ตาราง แล้วรันคำสั่งด้านล่าง
--
-- alter table public.workouts add column user_id uuid default auth.uid();
-- alter table public.goals    add column user_id uuid default auth.uid();
-- alter table public.settings add column user_id uuid default auth.uid();
--
-- alter table public.workouts enable row level security;
-- alter table public.goals    enable row level security;
-- alter table public.settings enable row level security;
--
-- create policy "own workouts" on public.workouts
--   for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- create policy "own goals" on public.goals
--   for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- create policy "own settings" on public.settings
--   for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- ============================================================
