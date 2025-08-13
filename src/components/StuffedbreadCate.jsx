import React from "react";

const StuffedBreadCate = () => {
  const items = [
    {
      img: "/image/7.png",
      title: "พิซซ่าพ็อกเก็ตไก่โบโลเนส",
      price: "295 ฿",
      weight: "80 กรัม",
      badge: "สินค้าใหม่",
    },
    {
      img: "/image/8.png",
      title: "พิซซ่าพ็อกเก็ตซอสพิ้งค์สไตล์ฮาวาย",
      price: "295 ฿",
      weight: "80 กรัม",
      badge: "สินค้าใหม่",
    },
    {
      img: "/image/9.png",
      title: "ขนมโมจิชาเขียวไส้ถั่วแดง",
      price: "295 ฿",
      weight: "60 กรัม",
      badge: "สินค้าใหม่",
    },
    {
      img: "/image/10.png",
      title: "แซนด์วิชซอสไส้กรอกสีชมพู (ซอสมะเขือเทศและมายองเนส)",
      price: "295 ฿",
      weight: "60 กรัม",
      badge: "สินค้าใหม่",
    },
    {
      img: "/image/11.png",
      title: "ขนมปังไส้คู่ ไส้เผือกและไส้ครีมมะพร้าว",
      price: "295 ฿",
      weight: "60 กรัม",
      badge: "สินค้าใหม่",
    },
  ];

  return (
    <div data-id="4" className="container mt-5 mb-5">
      <h4
        className="mt-5 mb-3"
        style={{ borderLeft: "5px solid #ed1b2f", paddingLeft: 10, fontWeight: "bold" }}
      >
        🥪 ขนมปังสอดไส้
      </h4>
      <p className="text-muted" style={{ marginTop: -10, marginBottom: 20 }}>
        ขนมปังนุ่ม ๆ สอดไส้หลากหลาย รสชาติจัดเต็ม ทุกคำเต็มไปด้วยความอร่อย
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
                <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
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

export default StuffedBreadCate;
