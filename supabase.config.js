/* ============================================================
   CalisTrack — Supabase configuration
   ============================================================
   1) รันสคริปต์ supabase/schema.sql ใน SQL Editor ของโปรเจกต์
   2) ไปที่ Project Settings -> API แล้วคัดลอกค่า 2 ตัวนี้:
      - Project URL   (เช่น https://xxxx.supabase.co)
      - anon / public key
   3) วางลงในตัวแปรด้านล่าง แล้วรีเฟรชหน้าเว็บได้เลย
   ============================================================ */

window.SUPABASE_CONFIG = {
  // true = ใช้ Supabase เป็นฐานข้อมูลหลัก (เมื่อใส่ URL/key ครบ)
  // false = กลับไปใช้ localStorage เหมือนเดิม
  enabled: true,

  // ---- ใส่ค่าจากโปรเจกต์ของคุณที่นี่ ----
  url: 'https://vzkuofbluosaweqxvvfe.supabase.co/rest/v1/',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6a3VvZmJsdW9zYXdlcXh2dmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDcyMTIsImV4cCI6MjEwMjAyMzIxMn0.m7FoJq5ZAhhodDaLYPMSlYnmtV86g78hKqHA2JUXEIw',
  // ----------------------------------------

  // true = ใช้ Auth แบบไม่ระบุตัวตน (ต้องเปิด "Allow anonymous sign-ins"
  // ใน Dashboard: Authentication -> Sign In / Up ก่อนใช้งาน)
  useAuth: false,
};
