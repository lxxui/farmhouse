import React from "react";

const BurgerCate = () => {
  return (
    <div data-id="3" className="container mt-5 mb-5">
      <h4
        className="mt-5 mb-3"
        style={{ borderLeft: "5px solid #ed1b2f", paddingLeft: 10, fontWeight: "bold" }}
      >
        🍔 เบอร์เกอร์
      </h4>
      <p className="text-muted" style={{ marginTop: -10, marginBottom: 20 }}>
        เบอร์เกอร์ชิ้นโต เนื้อแน่น รสชาติจัดจ้าน พร้อมให้คุณอร่อยเต็มคำทุกคำกัด
      </p>
      <div className="row g-3">
        <div className="col-md-3 mb-4">
          <div className="card h-100 text-center">
            <div
              className="image-box mx-auto"
              style={{ width: 150, height: 150, overflow: "hidden" }}
            >
              <img
                src="/image/41.png"
                alt="เมนู 1"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title" style={{ fontWeight: 600, fontSize: "1rem" }}>
                ขนมปังฮอทดอท
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
              <button className="btn btn-success" style={{ borderRadius: 25 }}>
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
                src="/image/43.png"
                alt="เมนู 2"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title" style={{ fontWeight: 600, fontSize: "1rem" }}>
                ขนมปังฮอทดอท
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
              <button className="btn btn-success" style={{ borderRadius: 25 }}>
                <i className="fas fa-shopping-cart me-2"></i> ใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerCate;
