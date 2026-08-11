# CaliTrack — Calisthenics Workout Tracker

WebApp ช่วยเหลือการออกกำลังกายแบบ **Calisthenics** — รวมคลิปแนะนำท่าออกกำลังกาย ระบบจดบันทึกการฝึกตามแผน สถิติพัฒนาการ และเป้าหมายส่วนตัว

ออกแบบ **Mobile First** — หน้าตาเหมือนกันทุกขนาดหน้าจอ (คอลัมน์เดียว + bottom nav + ปุ่มสลับธีมลอย) ธีมหลัก **Dark Navy** พร้อมสลับ Light ได้

![Tech](https://img.shields.io/badge/static-HTML%2FCSS%2FJS-blue) ![Supabase](https://img.shields.io/badge/DB-Supabase-green) ![GitHub](https://img.shields.io/badge/GitHub-Integration-181717)

---

## ✨ ฟีเจอร์

- **20 ท่าออกกำลังกาย** พร้อมคลิปวิดีโอแนะนำจาก YouTube (หมวด: วิดพื้น, ดึงข้อ, หน้าท้อง, ขา)
- **บันทึกการฝึก** — เซ็ต / ครั้ง / ระยะเวลา / น้ำหนักเพิ่ม / โน้ต ตามท่าแต่ละท่า (ท่าประเภทเวลาใช้หน่วยนาที:วินาที)
- **แผนการฝึก 3 ระดับ** — Beginner / Intermediate / Advanced พร้อมระบบทำเครื่องหมายวันครบ
- **เป้าหมาย** — ตั้งเป้ายอดรวมต่อท่า พร้อมกำหนดเส้นตาย ระบบนับความคืบหน้าอัตโนมัติ
- **ประวัติ + กราฟพัฒนาการ** — กราฟแท่งรายสัปดาห์, เส้นพัฒนาการรายท่า, ฟิลเตอร์ท่า, สถิติรวม
- **สตรีค (🔥)** — จำนวนวันติดต่อกันที่บันทึกการฝึก
- **Dark / Light theme** — สลับได้ จำค่าใน localStorage
- **ซิงก์ข้ามอุปกรณ์แบบเรียลไทม์** ผ่าน Supabase Realtime

---

## 🚀 รันบนเครื่อง

ต้องมี [Node.js](https://nodejs.org) (ใช้สำหรับ static server เท่านั้น):

```bash
# 1) รันเซิร์ฟเวอร์
node server.js
# เซิร์ฟเวอร์เริ่มที่ http://localhost:8123

# 2) เปิดเบราว์เซอร์
# http://localhost:8123
```

> ไม่มี dependencies — เป็น static site ล้วน (HTML/CSS/JS) `server.js` เป็นเพียง static file server ง่ายๆ

---

## 🗄️ ฐานข้อมูล — Supabase + GitHub Integration

แอปใช้ **Supabase** เป็นฐานข้อมูลหลัก (localStorage เหลือเป็นแค่ cache/offline) โดยโครงสร้างตารางถูกจัดการผ่าน **GitHub Integration** — repo นี้คือต้นทางของ schema (single source of truth)

### โครงสร้าง supabase/

```
supabase/
├── config.toml              # project config (project_id, API, auth, …)
└── migrations/
    └── 20260812000000_init.sql   # migration แรก: ตาราง + realtime + RLS
```

### ตาราง

| ตาราง | เก็บข้อมูล |
|---|---|
| `workouts` | บันทึกการฝึกแต่ละครั้ง (ท่า, เซ็ต, ครั้ง, น้ำหนัก, วันที่, …) |
| `goals` | เป้าหมาย (ท่า, ยอดรวมเป้า, เส้นตาย, สถานะสำเร็จ) |
| `settings` | ค่าตั้งค่า: `active_plan_id` + `plan_done` (วันที่ทำแผนครบ) |

ทุกตารางเปิด **Realtime** ไว้ให้ซิงก์ข้ามอุปกรณ์อัตโนมัติ และ **ปิด Row Level Security** (โหมดแชร์ข้อมูลร่วมกัน — เหมาะสำหรับทดลอง/ซิงก์ทันที)

### Workflow การแก้โครงสร้างตาราง (ใหม่)

1. **เพิ่ม/แก้ migration** ใน `supabase/migrations/` — ตั้งชื่อแบบ `<YYYYMMDDHHMMSS>_ชื่อ.sql`
2. **commit + push** ขึ้น GitHub (branch `main`)
3. **Supabase Integration apply ให้อัตโนมัติ** — ไม่ต้องเปิด SQL Editor อีกเลย

ตัวอย่างการเพิ่มคอลัมน์:

```sql
-- supabase/migrations/20260813000000_add_column.sql
alter table public.workouts add column if not exists fatigue_level int not null default 0;
```

### ตั้งค่าโปรเจกต์ใหม่ (ครั้งแรก)

1. สร้างโปรเจกต์ใน [Supabase Dashboard](https://supabase.com/dashboard)
2. **Project Settings → Integrations → GitHub Integration** → Authorize → เลือก repo นี้
   - Working directory: `.`
   - เปิด **Deploy to production** (production branch = `main`)
3. คัดลอก **Project URL** และ **anon key** จาก **Project Settings → API**
4. วางลงใน `supabase.config.js`:

```js
window.SUPABASE_CONFIG = {
  enabled: true,
  url: 'https://xxxx.supabase.co',        // ← Project URL
  anonKey: 'eyJ...',                      // ← anon / public key
  useAuth: false,                         // false = ข้อมูลร่วมกันทุกอุปกรณ์
};
```

> หมายเหตุ: `url` ใส่ `/rest/v1/` ต่อท้ายมาด้วยก็ได้ — แอปตัดให้อัตโนมัติ

### เรื่อง RLS (สำคัญ)

โหมดปัจจุบันปิด RLS = **ทุกคนที่ใช้ anon key เห็นข้อมูลชุดเดียวกัน** เหมาะกับทดลอง/ซิงก์ข้ามเครื่องตัวเอง

เมื่อพร้อมเปิดใช้จริง (ให้แต่ละคนมีข้อมูลส่วนตัว) มีสคริปต์ตัวอย่างไว้ท้าย `supabase/migrations/20260812000000_init.sql` — เปิด anonymous sign-in, ตั้ง `useAuth: true`, เพิ่มคอลัมน์ `user_id`, แล้วเปิด RLS + policy ต่อผู้ใช้

---

## 🎨 ดีไซน์

- **ธีมหลัก**: Dark Navy (`#0b0f1a`) + สีเน้นไฟฟ้าบลู (`#4da6ff`) — เขียวสงวนไว้เฉพาะสถานะ (ซิงก์/สตรีค/สำเร็จ)
- **การ์ด**: กระจกขาวเบลอ (frosted glass) เห็นพื้นหลังลอด
- **ฟอนต์**: Space Grotesk (หัวข้อ/ตัวเลข) + IBM Plex Sans Thai
- **Motion**: reveal on scroll, ปุ่มสปริง — เคารพ `prefers-reduced-motion`
- **Mobile First**: sidebar ไม่มี — topbar + bottom nav glass island + FAB ธีม ทุกขนาดจอ

---

## 📁 โครงสร้างไฟล์

```
├── index.html          # หน้าเว็บทั้งหมด (5 หน้า: แดชบอร์ด/บันทึก/แผน/เป้าหมาย/ประวัติ)
├── styles.css          # ธีม + responsive + motion
├── app.js              # ตรรกะทั้งหมด + Supabase layer (โหลด/ซิงก์/realtime/offline)
├── server.js           # static file server (node server.js)
├── supabase.config.js  # ตั้งค่า Supabase (URL + anon key)
├── supabase/           # config + migrations (GitHub Integration)
└── images/             # รูปภาพ (Unsplash, ใช้ฟรี)
```

---

## 🧪 สถานะซิงก์ (มุมขวาบน)

| จุด | สถานะ |
|---|---|
| 🟢 | ซิงก์กับ Supabase แล้ว |
| 🟠 กะพริบ | กำลังเชื่อมต่อ… |
| 🔴 | สิทธิ์ไม่พอ (RLS) — ต้องรัน migration ใน repo |
| ⚪ | โหมดเครื่อง (ออฟไลน์ / ยังไม่ตั้งค่า) |
