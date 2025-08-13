// CakeCategory.jsx
import React from "react";

const CakeCate = () => {
  const items = [
    {
      img: "/image/12.png",
      title: "เค้กช็อกโกแลตกล้วยหอม",
      price: "295 ฿",
      weight: "55 กรัม",
      badge: "สินค้าใหม่",
    },
    {
      img: "/image/13.png",
      title: "โดรายากิไส้โอวัลตินกรุบกรอบ",
      price: "295 ฿",
      weight: "50 กรัม",
      badge: "สินค้าใหม่",
    },
    {
      img: "/image/14.png",
      title: "โมจิเค้กช็อกโกแลตดับเบิ้ล",
      price: "295 ฿",
      weight: "55 กรัม",
      badge: "สินค้าใหม่",
    },
    {
      img: "/image/15.png",
      title: "โมจิเค้กเนยและนมอัลมอนด์",
      price: "295 ฿",
      weight: "55 กรัม",
      badge: "สินค้าใหม่",
    },
    {
      img: "/image/16.png",
      title: "เค้กกล้วยหอม",
      price: "295 ฿",
      weight: "55 กรัม",
      badge: "สินค้าใหม่",
    },
  ];

  return (
    <div data-id="5" className="container mt-3 mb-5">
      <h4
        className="mt-3 mb-3"
        style={{ borderLeft: "5px solid #ed1b2f", paddingLeft: 10, fontWeight: "bold" }}
      >
        🎂 เค้กและขนมญี่ปุ่น
      </h4>
      <p className="text-muted" style={{ marginTop: -10, marginBottom: 20 }}>
        เค้กเนื้อนุ่มละมุน และขนมญี่ปุ่นแท้ ๆ หลากหลายรสชาติ หวานกำลังดี เหมาะสำหรับทุกโอกาส
      </p>

      <div className="row g-3">
        {items.map(({ img, title, price, weight, badge }, idx) => (
          <div key={idx} className="col-md-3 mb-4">
            <div className="card h-100 text-center">
              {badge && <div className="category-badge">{badge}</div>}
              <div
                className="image-box mx-auto"
                style={{ width: 150, height: 150, overflow: "hidden" }}
              >
                <img
                  src={img}
                  alt={title}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="card-title" style={{ fontWeight: 600, fontSize: "1rem" }}>
                  {title}
                </h5>
                <p
                  className="card-price"
                  style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.3rem" }}
                >
                  {price}
                </p>
                <p className="card-text" style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  <i className="fas fa-weight-hanging me-1"></i> {weight}
                </p>
                <button className="btn btn-danger" style={{ borderRadius: 25 }}>
                  <i className="fas fa-shopping-cart me-2"></i> ใส่ตะกร้า
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CakeCate;
