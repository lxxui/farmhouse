const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// สร้าง connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_web_farmhouse',
});

// API ตัวอย่าง
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// ดึงข้อมูล user ทั้งหมด
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user');
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

    const [existing] = await pool.query('SELECT id FROM user WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

// Login API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ส่งค่า user กลับ
    const displayName = email; // ใช้ email เป็นชั่วคราวแทนชื่อ

    res.json({
      success: true,
      name: displayName,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.error('Login error detail:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      detail: error.message,
    });
  }
});

// อัพเดตชื่อและเบอร์โทรใน address table
app.put('/address/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { contact_name, phone } = req.body;

    if (!contact_name || !phone) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const [result] = await pool.query(
      'UPDATE address SET contact_name = ?, phone = ? WHERE user_id = ?',
      [contact_name, phone, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบ address ของผู้ใช้' });
    }

    res.json({ success: true, message: 'อัพเดตข้อมูลสำเร็จ' });
  } catch (error) {
    console.error('Address update error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพเดตข้อมูล' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
