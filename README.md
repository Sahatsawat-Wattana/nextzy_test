# Nextzy Rewards

เว็บแอปเกมสะสมคะแนนสำหรับสุ่มรับคะแนน ปลดล็อกรางวัลตาม checkpoint และตรวจสอบประวัติการเล่น พัฒนาด้วย Next.js, NestJS และ PostgreSQL โดยออกแบบแบบ mobile-first ตามหน้าจออ้างอิงใน `image-1.png` และ `image-2.png`

คู่มือ deploy แบบ managed hosting: [deployment.md](deployment.md)

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- Backend: NestJS 11, Fastify, Prisma ORM, Swagger
- Database: PostgreSQL 16
- Tooling: npm workspaces, Jest, Docker Compose

## Project Structure

```text
.
├── frontend/              # Next.js application
│   ├── app/               # Home, Game, layout และ global styles
│   ├── components/        # Modal, ScoreCard และ History
│   └── lib/               # API client และ shared types
├── backend/               # NestJS REST API
│   ├── src/               # Controllers, services และ business rules
│   └── prisma/            # Database schema และ migrations
├── docker-compose.yml     # PostgreSQL สำหรับ local development
└── instruction.md         # รายละเอียดโจทย์
```

## Architecture

```mermaid
flowchart LR
    U[ผู้ใช้งาน] --> W[Next.js Frontend :3000]
    W -->|REST/JSON| A[NestJS API :4000]
    A --> S[Game Service]
    S --> P[Prisma ORM]
    P --> D[(PostgreSQL :5432)]
    A --> X[Swagger /docs]
```

Frontend ทำหน้าที่แสดงผลและจัดการ interaction เท่านั้น ส่วน backend เป็นเจ้าของ business logic ทั้งหมด เช่น การสุ่มคะแนน การจำกัดคะแนนสูงสุด และการตรวจสอบสิทธิ์รับรางวัล ผู้ใช้จึงไม่สามารถส่งค่าคะแนนที่ต้องการจาก browser ได้โดยตรง ข้อมูลคะแนนและประวัติถูกจัดเก็บใน PostgreSQL ผ่าน Prisma

## Features

### Frontend

- หน้า Home แสดงคะแนนสะสมสูงสุด 10,000 คะแนน พร้อม progress bar
- checkpoint รางวัลที่ 5,000, 7,500 และ 10,000 คะแนน
- ปุ่มรับรางวัลเปิด success modal และปิดการรับรางวัลเดิมซ้ำ
- แยกประวัติการเล่นและประวัติรางวัลเป็นสองแท็บ
- ปุ่ม Reset สำหรับล้างคะแนนและประวัติทั้งหมด
- หน้า Game แสดงตัวเลือก 300, 500, 1,000 และ 3,000 คะแนน
- animation คัดคะแนนออกทีละค่า ก่อนแสดงผลลัพธ์ใน modal
- เล่นซ้ำได้โดยไม่ต้องกลับหน้า Home
- รองรับ mobile และ tablet ด้วย responsive layout

### Backend

- สุ่มคะแนนจากค่าที่ระบบกำหนดและบันทึก play history
- จำกัดคะแนนสะสมไม่ให้เกิน 10,000 คะแนน
- ตรวจสอบ checkpoint และป้องกันการรับรางวัลซ้ำ
- บันทึก reward history พร้อมเวลาได้รับรางวัล
- Reset คะแนน ประวัติการเล่น และประวัติรางวัลใน transaction เดียว
- ใช้ Prisma migration จัดการโครงสร้างฐานข้อมูล
- เปิด interactive API documentation ผ่าน Swagger
- เปิด CORS เฉพาะ frontend origin ที่กำหนด

## Installation

### Prerequisites

- Node.js 20 ขึ้นไป
- npm 10 ขึ้นไป
- Docker Desktop หรือ PostgreSQL 16 ที่รันอยู่แล้ว

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment

สร้าง environment file สำหรับ backend:

```bash
cp backend/.env.example backend/.env
```

สำหรับ PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

ค่าตั้งต้นใช้ PostgreSQL จาก `docker-compose.yml`:

```env
DATABASE_URL="postgresql://nextzy:nextzy@localhost:5432/nextzy?schema=public"
API_PORT=4000
WEB_ORIGIN=http://localhost:3000
```

Frontend ใช้ `http://localhost:4000` เป็นค่าเริ่มต้น หากต้องการเปลี่ยน API URL ให้สร้างไฟล์ `frontend/.env.local`:

```bash
cp frontend/.env.local.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. เริ่ม PostgreSQL

```bash
docker compose up -d postgres
```

หากใช้ PostgreSQL ภายนอก ให้แก้ `DATABASE_URL` ให้ตรงกับระบบนั้นแทน

### 4. เตรียมฐานข้อมูล

```bash
npm run db:generate
npm run db:migrate
```

### 5. เริ่มระบบ

```bash
npm run dev
```

- Web application: <http://localhost:3000>
- REST API: <http://localhost:4000>
- Swagger UI: <http://localhost:4000/docs>

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/player` | อ่านคะแนนและประวัติทั้งหมด |
| `POST` | `/game/play` | สุ่มคะแนนและเพิ่มคะแนนสะสม |
| `POST` | `/rewards/:checkpoint/claim` | รับรางวัลของ checkpoint |
| `POST` | `/reset` | รีเซตข้อมูลผู้เล่นทั้งหมด |
| `GET` | `/health` | ตรวจสอบสถานะ API สำหรับ deployment health check |

## Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | รัน frontend และ backend แบบ watch mode |
| `npm run build` | สร้าง production build ทั้งสองส่วน |
| `npm test` | รัน Jest tests ในทุก workspace |
| `npm run lint` | ตรวจสอบ TypeScript แบบ strict |
| `npm run db:generate` | สร้าง Prisma Client |
| `npm run db:migrate` | apply/create Prisma development migration |

ก่อนส่ง Pull Request ควรรัน `npm run lint`, `npm test` และ `npm run build` ให้ผ่านทั้งหมด

## Production Deployment

Production architecture ที่ใช้งานจริงแยกเป็นสาม services:

- **Frontend:** Next.js บน Vercel
- **Backend:** NestJS Web Service บน Render
- **Database:** Render Postgres

ดูขั้นตอนโดยละเอียด รวม troubleshooting และ custom domains ได้ที่ [deployment.md](deployment.md)

### Render Postgres

สร้าง PostgreSQL instance ใน region เดียวกับ backend และใช้ **Internal Database URL** เป็น `DATABASE_URL`

### Render Backend

สร้าง Node Web Service จาก repository โดยปล่อย Root Directory ว่างเพื่อใช้ root npm workspace และ lockfile

```text
Build Command:
npm ci --include=dev && npm run db:generate && npm run build -w @nextzy/api

Start Command:
npx prisma migrate deploy --schema backend/prisma/schema.prisma && npm run start -w @nextzy/api

Health Check Path:
/health
```

Environment variables:

- `DATABASE_URL`: Render Postgres Internal Database URL
- `WEB_ORIGIN`: Vercel production URL โดยไม่เติม `/` ท้าย URL
- `NODE_ENV=production`

Render กำหนด `PORT` ให้อัตโนมัติ ห้ามแทนค่าด้วย port แบบ hard-code การใช้ `--include=dev` ใน Build Command จำเป็นสำหรับ `@nestjs/cli` และ TypeScript

หลัง deploy ให้ตรวจ:

- `https://<render-service>.onrender.com/health`
- `https://<render-service>.onrender.com/docs`

### Vercel Frontend

Import repository แล้วตั้ง **Root Directory** เป็น `frontend` และใช้ Next.js defaults:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

เพิ่ม environment variable:

```env
NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com
```

ค่า `NEXT_PUBLIC_API_URL` ถูกฝังใน client bundle ตอน build เมื่อแก้ค่าต้อง redeploy Vercel หลังจากได้ Vercel production URL แล้ว ให้กลับไปตั้ง `WEB_ORIGIN` บน Render ให้ตรงกันและ redeploy backend

### Deployment Verification

1. Render `/health` ตอบ `{"status":"ok"}` และ `/docs` เปิด Swagger ได้
2. หน้า Home บน Vercel โหลดข้อมูลโดยไม่มี CORS error
3. สุ่มคะแนนแล้วคะแนนและ play history ถูกบันทึก
4. รับรางวัลเดิมซ้ำไม่ได้
5. Reset ล้างคะแนนและประวัติทั้งหมด

## Optional Docker Deployment

สำหรับ self-hosted environment ยังสามารถใช้ multi-stage Docker images และ `docker-compose.prod.yml` ได้:

```bash
cp .env.production.example .env.production
npm run deploy:build
npm run deploy:up
```

เส้นทางนี้เป็นทางเลือกสำหรับ self-hosting ไม่ใช่ deployment หลักบน Vercel/Render
