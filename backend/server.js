import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';       

const { PrismaClient } = pkg;           
const prisma = new PrismaClient();
const SECRET_KEY = 'MY_SUPER_SECRET_KEY'; 
const app = express();

app.use(cors()); 
app.use(express.json());

// ================== Middleware ==================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user; 
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required.' });
  next();
};

// ================== Public & User API ==================

// สมัครสมาชิกใหม่
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // เช็คว่ามีอีเมลนี้หรือยัง
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    
    // สร้าง User ใหม่ (ให้ Role พื้นฐานเป็น USER)
    const newUser = await prisma.user.create({
      data: { email, password, role: 'USER' }
    });
    
    // สร้าง Token ให้ล็อกอินอัตโนมัติเลย
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ success: true, token, role: newUser.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ล็อกอิน
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.password === password) {
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ success: true, token, role: user.role });
  } else {
    res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
});

// ดึงคอนเสิร์ต (User เห็นแค่ Public)
app.get('/api/concerts', async (req, res) => {
  try {
    const concerts = await prisma.concert.findMany({ where: { isPublished: true } });
    res.json(concerts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ดูรายละเอียดคอนเสิร์ต
app.get('/api/concerts/:id', async (req, res) => {
  try {
    const concert = await prisma.concert.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { seats: true }
    });
    if (!concert) return res.status(404).json({ error: 'Concert not found' });
    res.json(concert);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ดูคลังตั๋ว (Inventory)
app.get('/api/users/me/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      include: { seat: { include: { concert: true } } },
      orderBy: { purchasedAt: 'desc' }
    });
    res.json(tickets);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ซื้อตั๋ว
app.post('/api/tickets/buy', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { seatIds } = req.body; 
  try {
    const result = await prisma.$transaction(async (tx) => {
      const seats = await tx.seat.findMany({ where: { id: { in: seatIds } } });
      if (seats.some(seat => seat.status !== 'AVAILABLE')) throw new Error('บางที่นั่งถูกซื้อไปแล้ว');
      await tx.seat.updateMany({ where: { id: { in: seatIds } }, data: { status: 'SOLD' } });
      return await Promise.all(seatIds.map(seatId => tx.ticket.create({ data: { userId, seatId } })));
    });
    res.json({ success: true, tickets: result });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

// ================== Admin API ==================
app.get('/api/admin/concerts', authenticateToken, isAdmin, async (req, res) => {
  try {
    const concerts = await prisma.concert.findMany();
    res.json(concerts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/admin/concerts', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, date, time, venue, image, isPublished, customSeats } = req.body;
  try {
    const newConcert = await prisma.concert.create({
      data: { name, description, date, time, venue, image, isPublished, seats: { create: customSeats } },
    });
    res.json({ success: true, concert: newConcert });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/admin/concerts/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, date, time, venue, image, isPublished } = req.body;
  try {
    const updatedConcert = await prisma.concert.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, date, time, venue, image, isPublished }
    });
    res.json({ success: true, concert: updatedConcert });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/admin/concerts/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const concertId = parseInt(req.params.id);
    await prisma.$transaction([
      prisma.ticket.deleteMany({ where: { seat: { concertId } } }),
      prisma.seat.deleteMany({ where: { concertId } }),
      prisma.concert.delete({ where: { id: concertId } })
    ]);
    res.json({ success: true });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.listen(5000, () => console.log(`Backend server is running on http://localhost:5000`));