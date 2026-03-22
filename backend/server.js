import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';
import jwt from 'jsonwebtoken';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();


const SECRET_KEY = 'MY_SUPER_SECRET_KEY'; // คีย์สำหรับเข้ารหัส Token (โปรแกรมจริงควรซ่อนไว้ในไฟล์ .env)
const app = express();

// อนุญาตให้ React (ที่รันพอร์ต 3000) ส่งข้อมูลเข้ามาได้
app.use(cors()); 
app.use(express.json());

// ==========================================
// Middleware (ตัวคัดกรองสิทธิ์)
// ==========================================

// 1. เช็คว่า Login หรือยัง (มี Token ส่งมาไหม)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // ปกติจะส่งมาในรูปแบบ "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user; // เอาข้อมูล user (id, role) ไปใช้ต่อใน API
    next();
  });
};

// 2. เช็คว่าเป็น Admin หรือไม่ (ต้องใช้คู่กับ authenticateToken เสมอ)
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }
  next();
};

// ==========================================
// API Routes
// ==========================================

// --- ระบบ Login ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user && user.password === password) {
    // สร้าง Token ใช้งานได้ 24 ชั่วโมง
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ success: true, token, role: user.role });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// --- ดูคลังตั๋วของตัวเอง (ต้อง Login) ---
app.get('/api/users/me/tickets', authenticateToken, async (req, res) => {
  const userId = req.user.id; 

  const tickets = await prisma.ticket.findMany({
    where: { userId: userId },
    include: {
      seat: {
        include: { concert: true } // ดึงข้อมูลที่นั่งและคอนเสิร์ตที่เชื่อมโยงกันมาด้วย
      }
    }
  });

  res.json({
    totalTickets: tickets.length,
    tickets: tickets
  });
});

// --- ซื้อตั๋ว (ต้อง Login) ---
app.post('/api/tickets/buy', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { seatIds } = req.body; // รับเป็น Array เช่น [1, 2]

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. เช็คว่าที่นั่งยังว่างอยู่ไหม
      const seats = await tx.seat.findMany({ where: { id: { in: seatIds } } });
      const unavailable = seats.some(seat => seat.status !== 'AVAILABLE');
      if (unavailable) throw new Error('Some seats are no longer available');

      // 2. เปลี่ยนสถานะที่นั่งเป็น SOLD
      await tx.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: 'SOLD' }
      });

      // 3. สร้างตั๋วเข้าคลัง
      const newTickets = await Promise.all(
        seatIds.map(seatId => 
          tx.ticket.create({
            data: { userId, seatId }
          })
        )
      );

      return newTickets;
    });

    res.json({ success: true, message: 'Tickets purchased successfully', tickets: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- (Admin) สร้างคอนเสิร์ตและที่นั่งแบบ Custom ---
app.post('/api/admin/concerts', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, date, time, venue, customSeats } = req.body;

  try {
    const newConcert = await prisma.concert.create({
      data: {
        name, description, date, time, venue,
        seats: {
          create: customSeats // ex: [{ row: "A", number: 1, tier: "VIP" }]
        }
      },
      include: { seats: true }
    });
    res.json({ success: true, concert: newConcert });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- (Admin) แก้ไขรายละเอียดคอนเสิร์ต ---
app.put('/api/admin/concerts/:id', authenticateToken, isAdmin, async (req, res) => {
  const concertId = parseInt(req.params.id);
  const updateData = req.body;

  try {
    const updatedConcert = await prisma.concert.update({
      where: { id: concertId },
      data: updateData
    });
    res.json({ success: true, concert: updatedConcert });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- (Admin) เพิ่มที่นั่งให้คอนเสิร์ตเดิมทีหลัง ---
app.post('/api/admin/concerts/:id/seats', authenticateToken, isAdmin, async (req, res) => {
  const concertId = parseInt(req.params.id);
  const { seatsToCreate } = req.body; 

  try {
    const newSeats = await prisma.seat.createMany({
      data: seatsToCreate.map(seat => ({ ...seat, concertId }))
    });
    res.json({ success: true, addedCount: newSeats.count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// เริ่มการทำงานของ Server
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});