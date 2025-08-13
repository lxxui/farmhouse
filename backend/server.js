const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// สร้างการเชื่อมต่อ MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_web_farmhouse'  // ตั้งเป็นชื่อฐานข้อมูลของคุณ
});

// API ตัวอย่าง
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// ดึงข้อมูล user ทั้งหมด
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('select * from user'); // ชื่อตาราง user ตามที่คุณสร้าง
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้1' });
  }
});

// สมัครสมาชิก (register)
app.post('/register', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if (!email || !phone || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือยัง
    const [existing] = await pool.query('SELECT id FROM user WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกข้อมูลผู้ใช้ใหม่
    await pool.query(
      'INSERT INTO user (email, phone, password_hash) VALUES (?, ?, ?)',
      [email, phone, hashedPassword]
    );

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
