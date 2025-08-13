// BreadcrumbsCategory.jsx
import React from "react";

const BreadcrumbsCate = () => {
  const items = [
    {
      img: "/image/23.png",
      title: 'เกล็ดขนมปัง “กรอบพิเศษ”',
      price: "295 ฿",
      weight: "1000 กรัม",
    },
    {
      img: "/image/24.png",
      title: 'เกล็ดขนมปัง “กรอบพิเศษ”',
      price: "295 ฿",
      weight: "1000 กรัม",
    },
    {
      img: "/image/25.png",
      title: 'เกล็ดขนมปัง “กรอบพิเศษ”',
      price: "295 ฿",
      weight: "1000 กรัม",
    },
    {
      img: "/image/44.png",
      title: 'เกล็ดขนมปัง “กรอบพิเศษ”',
      price: "295 ฿",
      weight: "200 กรัม",
    },
  ];

  return (
    <div data-id="7" className="container mt-4">
      <h4
        className="mt-4"
        style={{ borderLeft: "5px solid #ed1b2f", paddingLeft: 10, fontWeight: "bold" }}
      >
        🍞 เกล็ดขนมปัง
      </h4>
      <p className="text-muted">
        สินค้าและวัตถุดิบเกล็ดขนมปังสำหรับทำอาหารและเบเกอรี่
      </p>
      <div className="row g-3">
        {items.map(({ img, title, price, weight }, idx) => (
          <div key={idx} className="col-md-3 mb-4">
            <div className="card h-100 text-center">
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

export default BreadcrumbsCate;
