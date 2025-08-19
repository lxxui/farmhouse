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
    console.log("Login user:", user); // ✅ ตอนนี้ user มีค่าแล้ว
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ส่งค่า user กลับ

    res.json({
      success: true,
      id: user.id,
      username: user.username,
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
// อัปเดตข้อมูล user
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, phone } = req.body;

  console.log("PUT /user/:id hit", id, req.body);

  try {
    await pool.query(
      "UPDATE user SET username = ?, email = ?, phone = ? WHERE id = ?",
      [username, email, phone, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ดึงข้อมูล address ของ user
app.get("/user/:id/address", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM address WHERE user_id = ?", [id]);
    if (rows.length === 0) {
      return res.json({ success: true, address: {} });
    }
    res.json({ success: true, address: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ดึงข้อมูล user ตาม id
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, phone FROM user WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "ไม่พบผู้ใช้" });
    }

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// อัปเดต/เพิ่มข้อมูล address
app.put("/user/:id/address", async (req, res) => {
  const { id } = req.params;
  const { contact_name, house_number, village, street, sub_district, district, province, postal_code, phone } = req.body;

  console.log("PUT /user/:id/address hit", id, req.body);

  try {
    await pool.query(
      `INSERT INTO address 
        (user_id, contact_name, house_number, village, street, sub_district, district, province, postal_code, phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         contact_name=?, house_number=?, village=?, street=?, sub_district=?, district=?, province=?, postal_code=?, phone=?`,
      [
        id, contact_name, house_number, village, street, sub_district, district, province, postal_code, phone,
        contact_name, house_number, village, street, sub_district, district, province, postal_code, phone
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
