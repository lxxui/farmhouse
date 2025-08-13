import React from "react";

const HotdogCate = () => {
  return (
    <div data-id="2" className="container mt-3 mb-5">
      <h4
        className="mt-3 mb-3"
        style={{ borderLeft: "5px solid #ed1b2f", paddingLeft: 10, fontWeight: "bold" }}
      >
        🌭 ฮอทดอก
      </h4>
      <p className="text-muted" style={{ marginTop: -10, marginBottom: 20 }}>
        ฮอทดอกรสชาติหลากหลาย ไส้แน่น ๆ พร้อมทาน อิ่มอร่อยง่าย ๆ ทุกมื้อ
      </p>
      <div className="row g-3">
        <div className="col-md-3 mb-4">
          <div className="card h-100 text-center">
            <div className="category-badge">สินค้าใหม่</div>

            <div
              className="image-box mx-auto"
              style={{ width: 150, height: 150, overflow: "hidden" }}
            >
              <img
                src="/image/6.png"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                alt="เมนู 1"
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title" style={{ fontWeight: 600, fontSize: "1rem" }}>
                ขนมปังเบอร์เกอร์
              </h5>
              <p
                className="card-price"
                style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.3rem" }}
              >
                295 ฿
              </p>
              <p className="card-text" style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1rem" }}>
                <i className="fas fa-weight-hanging me-1"></i> 270 กรัม
              </p>
              <button className="btn btn-danger" style={{ borderRadius: 25 }}>
                <i className="fas fa-shopping-cart me-2"></i> ใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card h-100 text-center">
            <div
              className="image-box mx-auto"
              style={{ width: 150, height: 150, overflow: "hidden" }}
            >
              <img
                src="/image/42.png"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                alt="เมนู 2"
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title" style={{ fontWeight: 600, fontSize: "1rem" }}>
                ขนมปังเบอร์เกอร์โรยงา
              </h5>
              <p
                className="card-price"
                style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.3rem" }}
              >
                295 ฿
              </p>
              <p className="card-text" style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1rem" }}>
                <i className="fas fa-weight-hanging me-1"></i> 320 กรัม
              </p>
              <button className="btn btn-danger" style={{ borderRadius: 25 }}>
                <i className="fas fa-shopping-cart me-2"></i> ใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotdogCate;
