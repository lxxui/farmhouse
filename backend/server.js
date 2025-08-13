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
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
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

// login API
// login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ดึงผู้ใช้จากฐานข้อมูล
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = rows[0];

    // ตรวจสอบรหัสผ่าน
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // ส่งข้อมูลกลับ ฟรอนต์เอนด์
    const name = email.slice(0, 2); // ตัวอย่างใช้ 2 ตัวแรกของ email
    res.json({ success: true, name });
  } catch (error) {
    console.error("Login error detail:", error);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      detail: error.message
    });
  }

});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
