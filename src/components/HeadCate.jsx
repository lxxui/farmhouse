import React, { useState } from "react";

const MenuList = () => {
  const [category, setCategory] = useState("");

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    // ถ้าต้องการกรองข้อมูลเพิ่มเติม ให้ทำตรงนี้
  };

  return (
    <div className="container mt-2">
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
  );
};

export default MenuList;
