import React from "react";

const BreadMenu = () => {
  const items = [
    {
      id: 1,
      img: "/image/1.png",
      title: "อิงลิชเบรด",
      price: 295,
      weight: "280 กรัม | 7 แผ่น",
    },
    {
      id: 2,
      img: "/image/3.png",
      title: "ขนมปังลูกเกด",
      price: 295,
      weight: "250 กรัม",
    },
    {
      id: 3,
      img: "/image/4.png",
      title: "ขนมปังไร้ขอบ",
      price: 295,
      weight: "220 กรัม",
    },
    {
      id: 4,
      img: "/image/5.png",
      title: "ขนมปังรสนมฮอกไกโด",
      price: 295,
      weight: "240 กรัม",
    },
    {
      id: 5,
      img: "/image/2.png",
      title: "ขนมปังทาหน้า มอคค่า",
      price: 295,
      weight: "- กรัม",
    },
  ];

  return (
    <div data-id="1" className="container mt-5 mb-5">
      <h4
        style={{
          borderLeft: "5px solid #ed1b2f",
          paddingLeft: 10,
          fontWeight: "bold",
        }}
      >
        🍞 ขนมปังแผ่น
      </h4>
      <p
        className="text-muted"
        style={{ marginTop: -10, marginBottom: 20 }}
      >
        ขนมปังสดใหม่ หอม นุ่ม เหมาะสำหรับทำแซนด์วิชและของว่างทุกโอกาส
      </p>
      <div className="row g-3">
        {items.map(({ id, img, title, price, weight }) => (
          <div key={id} className="col-md-3 mb-4">
            <div
              className="card h-100 text-center"
              style={{
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="image-box mx-auto"
                style={{
                  width: 150,
                  height: 150,
                  overflow: "hidden",
                }}
              >
                <img
                  src={img}
                  alt={title}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div className="card-body text-center">
                <h5
                  className="card-title"
                  style={{ fontWeight: 600, fontSize: "1rem" }}
                >
                  {title}
                </h5>
                <p
                  className="card-price"
                  style={{
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  {price} ฿
                </p>
                <p
                  className="card-text"
                  style={{ color: "#555", fontSize: "0.9rem", marginBottom: 16 }}
                >
                  <i className="fas fa-weight-hanging me-1"></i> {weight}
                </p>
                <button
                  className="btn btn-success"
                  style={{ borderRadius: 25 }}
                >
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

export default BreadMenu;
