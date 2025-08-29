// src/pages/CheckoutPage.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "./cartContact";
import { useNavigate } from "react-router-dom";
import LoginPage from "./loginpage";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";

const CheckoutPage = ({ user, setUser }) => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [payment, setPayment] = useState("cod");
  const [address, setAddress] = useState(null);
  const [slipFile, setSlipFile] = useState(null);

  // เช็คว่า user login หรือไม่
  useEffect(() => {
    if (!user) {
      Swal.fire({
        html: `<div id="login-popup"></div>`,
        didOpen: () => {
          const container = document.getElementById("login-popup");
          const root = createRoot(container);
          root.render(
            <LoginPage setUser={setUser} onClose={() => Swal.close()} />
          );
        },
        showConfirmButton: false,
      });
    }
  }, [user]);

  // fetch user address ถ้า user.address ไม่มี
  useEffect(() => {
    const fetchAddress = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`http://localhost:3001/user/${user.id}/address`);
        const data = await res.json();
        if (data.success && data.address) setAddress(data.address);
      } catch (err) {
        console.error("Fetch address error:", err);
      }
    };

    if (!user?.address) fetchAddress();
    else setAddress(user.address);
  }, [user]);

  if (!user) return <div className="text-center mt-5">กำลังโหลดข้อมูลผู้ใช้...</div>;
  if (cartItems.length === 0)
    return (
      <div className="container text-center" style={{ marginTop: "100px" }}>
        <h3 style={{ color: "#ed1b2f" }}>🛒 ไม่มีสินค้าในตะกร้า</h3>
        <button className="btn btn-danger mt-3" onClick={() => navigate("/")}>
          ← กลับไปเลือกสินค้า
        </button>
      </div>
    );

  const totalPrice = cartItems.reduce((sum, item) => sum + item.Price * item.quantity, 0);

  const handleSubmit = async () => {
    if (!address) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกที่อยู่จัดส่ง",
        text: "ไปหน้าโปรไฟล์เพื่อกรอกที่อยู่ก่อน",
      });
      navigate("/profile");
      return;
    }

    const addressString = `${address.house_number} ${address.village} ${address.lane ? ' ซอย' + address.lane : ''} ${address.street}, ${address.sub_district}, ${address.district}, ${address.province} ${address.postal_code}`;

    const orderData = {
      user_id: user.id,
      contact_name: user.username || address.contact_name,
      phone: address.phone,
      address: addressString,
      payment_method: payment,
      total_price: totalPrice >= 100 ? totalPrice : totalPrice + 20,
      items: cartItems.map((item) => ({
        product_id: item.ProductID,
        quantity: item.quantity,
        price: item.Price,
        discount: item.originalPrice ? item.originalPrice - item.Price : 0,
      })),
    };

    try {
      const res = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "สั่งซื้อสำเร็จ",
          html: `<p>ชื่อผู้สั่ง: ${orderData.contact_name}</p>
               <p>เบอร์โทร: ${orderData.phone}</p>
               <p>ที่อยู่: ${orderData.address}</p>
               <p>วิธีชำระ: ${payment === "cod"
              ? "💵 ชำระเงินปลายทาง"
              : payment === "bank"
                ? "🏦 โอนผ่านบัญชีธนาคาร (QR Code)"
                : "💳 บัตรเครดิต / เดบิต"
            }</p>
               <p>ยอดรวม: ${orderData.total_price} ฿</p>`,
          timer: 3000,
          showConfirmButton: true,
        });

        clearCart();
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: data.message || "ไม่สามารถบันทึกคำสั่งซื้อได้",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์",
      });
    }
  };


  return (
        <div className="container" style={{ paddingTop: '80px',paddingBottom: '20px' }}>
      <h3 className="mb-4 text-danger">ชำระเงิน</h3>
      <div className="row">
        {/* ซ้าย: ข้อมูลผู้สั่ง + ที่อยู่ */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white">
              <strong>ข้อมูลผู้สั่งซื้อ</strong>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <label className="form-label">ชื่อผู้สั่ง</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.username || address?.contact_name || ""}
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="form-label">เบอร์โทร</label>
                <input
                  type="text"
                  className="form-control"
                  value={address?.phone || ""}
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="form-label">ที่อยู่จัดส่ง</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={
                    address
                      ? `${address.house_number} ${address.village} ${address.lane ? ' ซอย' + address.lane : ''} ${address.street}, ${address.sub_district}, ${address.district}, ${address.province} ${address.postal_code}`
                      : "ยังไม่ได้กรอกที่อยู่"
                  }
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* วิธีชำระเงิน */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <strong>วิธีการชำระเงิน</strong>
            </div>
            <div className="card-body">
              {/* COD */}
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                />
                <label className="form-check-label">💵 ชำระเงินปลายทาง</label>
              </div>

              {/* Bank Transfer / QR */}
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={payment === "bank"}
                  onChange={() => setPayment("bank")}
                />
                <label className="form-check-label">🏦 โอนผ่านบัญชีธนาคาร (QR Code)</label>
              </div>
              {payment === "bank" && (
                <div className="border p-3 mb-2">
                  <p>ชื่อธนาคาร: ธนาคารกรุงเทพ</p>
                  <p>เลขบัญชี: 123-456-7890</p>
                  <img src="/qrcode-bank.png" alt="QR Code Bank" style={{ width: 120 }} />
                  <div className="mt-2">
                    <label className="form-label">แนบสลิปการชำระเงิน</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => setSlipFile(e.target.files[0])}
                    />
                  </div>
                </div>
              )}

              {/* Credit/Debit Card */}
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={payment === "credit"}
                  onChange={() => setPayment("credit")}
                />
                <label className="form-check-label">💳 บัตรเครดิต / เดบิต</label>
              </div>
              {payment === "credit" && (
                <div className="border p-3 mt-2">
                  <div className="mb-2">
                    <label className="form-label">เลขบัตร</label>
                    <input type="text" className="form-control" placeholder="xxxx-xxxx-xxxx-xxxx" />
                  </div>
                  <div className="mb-2 d-flex gap-2">
                    <div>
                      <label className="form-label">วันหมดอายุ</label>
                      <input type="text" className="form-control" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="form-label">CVV</label>
                      <input type="text" className="form-control" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ขวา: สรุปรายการสินค้า */}
        <div className="col-lg-5">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white">
              <strong>สรุปรายการสินค้า</strong>
              <div style={{ fontSize: 14, color: "#007bff", marginTop: 5 }}>
                🎉 โปรโมชั่น: สั่งครบ 100 บาท ส่งฟรี!
              </div>
            </div>
            <div className="card-body">
              {cartItems.map((item) => {
                const discount =
                  item.originalPrice && item.originalPrice > item.Price
                    ? item.originalPrice - item.Price
                    : 0;
                return (
                  <div
                    key={item.ProductID}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={item.ImageURL}
                        alt={item.ProductName}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "contain",
                          marginRight: 15,
                          borderRadius: 8,
                        }}
                      />
                      <div>
                        <span>
                          {item.ProductName} × {item.quantity}
                        </span>
                        {discount > 0 && (
                          <div style={{ fontSize: 12, color: "green" }}>
                            ลด {discount * item.quantity} ฿
                          </div>
                        )}
                      </div>
                    </div>
                    <strong>{item.Price * item.quantity} ฿</strong>
                  </div>
                );
              })}

              <hr />
              {totalPrice >= 100 ? (
                <div className="d-flex justify-content-between mb-2">
                  <span>ค่าจัดส่ง:</span>
                  <strong className="text-success">ฟรี</strong>
                </div>
              ) : (
                <div className="d-flex justify-content-between mb-2">
                  <span>ค่าจัดส่ง:</span>
                  <strong>20 ฿</strong>
                </div>
              )}

              <div className="d-flex justify-content-between">
                <strong>รวมทั้งหมด:</strong>
                <strong className="text-danger">
                  {totalPrice >= 100 ? totalPrice : totalPrice + 20} ฿
                </strong>
              </div>
            </div>
          </div>

          <button className="btn btn-danger w-100" onClick={handleSubmit}>
            ยืนยันการสั่งซื้อ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
