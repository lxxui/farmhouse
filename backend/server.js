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

    // ส่งค่า user กลับพร้อม role
    res.json({
      success: true,
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role, // ✅ เพิ่ม role
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
      "SELECT id, username, email, phone,role FROM user WHERE id = ?",
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
  const { contact_name, house_number, village, lane, street, sub_district, district, province, postal_code, phone } = req.body;

  console.log("PUT /user/:id/address hit", id, req.body);

  try {
    await pool.query(
      `INSERT INTO address 
    (user_id, contact_name, house_number, village, lane, street, sub_district, district, province, postal_code, phone) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE 
     contact_name=?, house_number=?, village=?, lane=?, street=?, sub_district=?, district=?, province=?, postal_code=?, phone=?`,
      [
        id, contact_name, house_number, village, lane, street, sub_district, district, province, postal_code, phone,
        contact_name, house_number, village, lane, street, sub_district, district, province, postal_code, phone
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ดึง category ทั้งหมด
app.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT CategoryID, CategoryName, Icon FROM Categories ORDER BY CategoryName');
    res.json({ success: true, categories: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ดึงสินค้าตาม CategoryID
app.get('/products', async (req, res) => {
  const { categoryId } = req.query; // ส่งมาจาก frontend เช่น ?categoryId=1

  if (!categoryId) {
    return res.status(400).json({ success: false, error: "กรุณาส่ง categoryId" });
  }

  try {
    const [products] = await pool.query(
      `SELECT * 
       FROM products 
       WHERE CategoryID = ? 
       ORDER BY CreatedAt DESC`,
      [categoryId]
    );

    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});



// สร้างคำสั่งซื้อใหม่
app.post("/orders", async (req, res) => {
  const { user_id, contact_name, phone, address, payment_method, total_price, items } = req.body;

  // ตรวจสอบข้อมูลครบถ้วน
  if (!user_id || !contact_name || !phone || !address || !payment_method || !items?.length) {
    return res.status(400).json({ success: false, message: "ข้อมูลคำสั่งซื้อไม่ครบถ้วน" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // ดึง AUTO_INCREMENT ของ orders เพื่อสร้าง order_number
    const [[{ AUTO_INCREMENT: nextId }]] = await conn.query(
      "SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = 'orders' AND table_schema = DATABASE()"
    );

    const orderNumber = `FH${String(nextId || 1).padStart(6, '0')}`;

    // Insert order หลัก
    const [orderResult] = await conn.query(
      `INSERT INTO orders 
       (user_id, order_number, contact_name, phone, address, payment_method, total_price, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [user_id, orderNumber, contact_name, phone, address, payment_method, total_price]
    );

    const orderId = orderResult.insertId;

    // เตรียมข้อมูล order_items
    const itemValues = [];
    for (let item of items) {
      if (!item.product_name) {
        const [rows] = await conn.query(
          "SELECT ProductName FROM products WHERE ProductID = ?",
          [item.product_id]
        );
        item.product_name = rows[0]?.ProductName || "Unknown";
      }

      itemValues.push([
        orderId,
        orderNumber, // ใช้ order_number เดียวกัน
        item.product_id,
        item.product_name,
        item.quantity,
        item.price,
        item.discount || 0
      ]);
    }

    // Insert order_items แบบ batch
    if (itemValues.length) {
      await conn.query(
        `INSERT INTO order_items (order_id, order_number, product_id, product_name, quantity, price, discount) VALUES ?`,
        [itemValues]
      );
    }

    await conn.commit();

    res.json({ success: true, orderId, orderNumber, items: itemValues });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});


// ดึงคำสั่งซื้อทั้งหมดของ user
app.get("/orders/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // ดึงข้อมูล orders ของ user
    const [orders] = await pool.query(
      `SELECT o.id, o.order_number, o.contact_name, o.phone, o.address,
              o.payment_method, o.total_price, o.status, o.created_at
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [id]
    );

    if (orders.length === 0) {
      return res.json({ success: true, orders: [] });
    }

    // ดึง order_items ที่เกี่ยวข้องทั้งหมด
    const orderIds = orders.map((o) => o.id);
    const [items] = await pool.query(
      `SELECT oi.order_id, oi.product_id, oi.product_name, oi.quantity, oi.price, oi.discount
       FROM order_items oi
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    // จัด group item ไปใส่ในแต่ละ order
    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: items.filter((it) => it.order_id === order.id),
    }));

    res.json({ success: true, orders: ordersWithItems });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ดึงคำสั่งซื้อทั้งหมด (สำหรับ admin)
app.get("/admin/orders", async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.order_number, o.contact_name, o.phone, o.address,
              o.payment_method, o.total_price, o.status, o.created_at
       FROM orders o
       ORDER BY o.created_at DESC`
    );

    if (orders.length === 0) {
      return res.json({ success: true, orders: [] });
    }

    // ดึง order_items ที่เกี่ยวข้องทั้งหมด
    const orderIds = orders.map(o => o.id);
    const [items] = await pool.query(
      `SELECT oi.order_id, oi.product_id, oi.product_name, oi.quantity, oi.price, oi.discount
       FROM order_items oi
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    // จัด group item ไปใส่ในแต่ละ order
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: items.filter(it => it.order_id === order.id)
    }));

    res.json({ success: true, orders: ordersWithItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// อัปเดตสถานะ order (admin)
app.put("/admin/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ success: false, error: "กรุณาระบุ status" });

  try {
    const [result] = await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: "ไม่พบคำสั่งซื้อ" });

    res.json({ success: true, id, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});



// ยกเลิกคำสั่งซื้อ (เฉพาะ pending)
app.put("/orders/:id/cancel", async (req, res) => {
  const { id } = req.params;

  try {
    // ตรวจสอบสถานะก่อน
    const [rows] = await pool.query("SELECT status FROM orders WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "ไม่พบคำสั่งซื้อ" });

    if (rows[0].status !== "pending") {
      return res.status(400).json({ success: false, message: "คำสั่งซื้อไม่สามารถยกเลิกได้" });
    }

    // อัปเดตสถานะ
    const cancelledAt = new Date();
    await pool.query(
      "UPDATE orders SET status = ?, cancelled_at = ? WHERE id = ?",
      ["cancelled", cancelledAt, id]
    );

    res.json({ success: true, cancelled_at: cancelledAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});






const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
