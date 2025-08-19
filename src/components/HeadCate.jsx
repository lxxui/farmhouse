import { useState } from "react";

const MenuList = ({ category, setCategory }) => {
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (e) => {
    setLoading(true);        // เริ่มแสดง loading
    setCategory(e.target.value);

    // สมมติว่ากรองข้อมูลใช้เวลา 1 วินาที (simulate loading)
    setTimeout(() => {
      setLoading(false);     // ซ่อน loading เมื่อเสร็จ
    }, 4000);
  };

  return (
    <>
      <div className="container mt-2">
        {/* Dropdown */}
        <div className="row">
          <div className="col-md-8">
            <h4>รายการเมนู</h4>
          </div>
          <div className="col-md-4">
            <div className="filter-dropdown d-flex justify-content-end mb-3">
              <select
                id="categoryFilter"
                className="form-select form-control"
                style={{ width: 200 }}
                value={category}
                onChange={handleCategoryChange}
                disabled={loading}  // ถ้าโหลดอยู่ก็ disable dropdown เพื่อกันคลิกซ้ำ
              >
                <option value="">ทุกหมวด</option>
                <option value="1">🍞 ขนมปังแผ่น</option>
                <option value="2">🌭 ฮอทดอก</option>
                <option value="3">🍔 เบอร์เกอร์</option>
                <option value="4">🥪 ขนมปังสอดไส้</option>
                <option value="5">🎂 เค้กและขนมญี่ปุ่น</option>
                <option value="6">🥧 พาย</option>
                <option value="7">🍞 เกล็ดขนมปัง</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div
          id="loading-spinner"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            padding: 20,
            borderRadius: 8,
          }}
        >
          <img
            src="../image/loading_bread.gif"
            alt="loading..."
            width="300"
            height="200"
          />
        </div>
      )}
    </>
  );
};

export default MenuList;
