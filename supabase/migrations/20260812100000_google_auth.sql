-- ============================================================
-- CaliTrack — Google Auth: per-user data isolation
-- ============================================================
-- เปลี่ยนจาก "ทุกคนใช้ข้อมูลชุดเดียวกัน" เป็น "ผู้ใช้แต่ละคนมีข้อมูล
-- ส่วนตัวของตัวเอง" (ผูกกับบัญชี Google ผ่าน auth.uid())
--
-- 🔐 ความปลอดภัย:
--   - ไม่มี secret/PII ในไฟล์นี้ — แค่ schema + RLS policy
--   - ข้อมูลจะถูกมองเห็นได้เฉพาะเจ้าของ (auth.uid()) เท่านั้น
--   - Guest Mode (ไม่ล็อกอิน) จะเก็บข้อมูลใน localStorage ของเครื่อง
--     และไม่สามารถอ่าน/เขียนตารางเหล่านี้ได้อีกต่อไป
--
-- ⚠️ ข้อมูลเก่าที่ไม่มีเจ้าของ (user_id = null) จะถูก "กักกัน":
--   - แถว workouts/goals เก่าจะมองไม่เห็น (ไม่ถูกลบ) — เก็บไว้
--     กันพลาด ต้องการลบ ใช้คำสั่งท้ายไฟล์
--   - แถว settings เก่า (id='main' ที่ใช้ร่วมกัน) จะถูกลบ — เป็น
--     แค่ค่าตั้งค่า (แผน/plan_done) ไม่ใช่ประวัติการฝึก
-- ============================================================

-- ---------- เพิ่มคอลัมน์ user_id ----------
-- default auth.uid(): แถวใหม่ทุกแถวถูกผูกกับผู้ใช้ที่ล็อกอินอัตโนมัติ
alter table public.workouts add column if not exists user_id uuid default auth.uid();
alter table public.goals    add column if not exists user_id uuid default auth.uid();
alter table public.settings add column if not exists user_id uuid default auth.uid();

-- ---------- settings: เปลี่ยนเป็น 1 แถวต่อ 1 ผู้ใช้ (PK = user_id) ----------
-- ลบแถวเก่าที่ใช้ร่วมกัน (ไม่มีเจ้าของ) — เป็นแค่ค่าตั้งค่าทั่วไป
delete from public.settings where user_id is null;
alter table public.settings drop constraint if exists settings_pkey;
alter table public.settings drop column if exists id;
alter table public.settings alter column user_id set not null;
-- สร้าง PK แบบ idempotent
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'settings_pkey') then
    alter table public.settings add primary key (user_id);
  end if;
end $$;

-- ---------- เปิด Row Level Security + policy ต่อผู้ใช้ ----------
alter table public.workouts enable row level security;
alter table public.goals    enable row level security;
alter table public.settings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'workouts' and policyname = 'own workouts') then
    create policy "own workouts" on public.workouts
      for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'goals' and policyname = 'own goals') then
    create policy "own goals" on public.goals
      for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'settings' and policyname = 'own settings') then
    create policy "own settings" on public.settings
      for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;

-- ---------- Realtime: ยังเปิดเหมือนเดิม (ซิงก์ข้ามอุปกรณ์ของเจ้าของข้อมูล) ----------
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
-- หมายเหตุ
-- ============================================================
-- 1) แถวข้อมูลเก่า (user_id = null) ถูกกักกันไว้ ไม่ถูกลบ:
--      select count(*) from public.workouts where user_id is null;
--    ถ้าต้องการลบทิ้งจริง (ทำแล้วย้อนไม่ได้):
--      delete from public.workouts where user_id is null;
--      delete from public.goals    where user_id is null;
-- 2) ขั้นตอนตั้งค่า Google OAuth อยู่ใน README / คำแนะนำของแอป —
--    Client ID/Secret ใส่ใน Supabase Dashboard เท่านั้น ไม่เคยลงโค้ด
-- 3) anon key ใน supabase.config.js ไม่ใช่ความลับ (Supabase ออกแบบ
--    ให้อยู่ฝั่ง client ได้) — ความปลอดภัยอยู่ที่ RLS ด้านบน
-- ============================================================
