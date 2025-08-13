import React from "react";

const BurgerCate1 = () => {
  const items = [
    {
      img: "/image/26.png",
      title: "ขนมปังเบอร์เกอร์",
      price: "฿59",
      sizes: [
        { size: "3.5 นิ้ว", weight: "45 กรัม" },
        { size: "4 นิ้ว", weight: "53 กรัม" },
        { size: "5 นิ้ว", weight: "86 กรัม" },
      ],
    },
    {
      img: "/image/27.png",
      title: "ขนมปังเบอร์เกอร์โรยงา",
      price: "฿59",
      sizes: [
        { size: "3.5 นิ้ว", weight: "45 กรัม" },
        { size: "4 นิ้ว", weight: "54 กรัม" },
        { size: "5 นิ้ว", weight: "87.5 กรัม" },
      ],
    },
    {
      img: "/image/28.png",
      title: "ขนมปังเบอร์เกอร์บิ๊กแมค",
      price: "฿59",
      sizes: null,
      weight: "73 กรัม",
    },
    {
      img: "/image/29.png",
      title: "ขนมปังเบอร์เกอร์โรยงาขาวและงาดำ",
      price: "฿59",
      sizes: [{ size: "4 นิ้ว", weight: "57 กรัม" }],
    },
    {
      img: "/image/30.png",
      title: "ขนมปังเบอร์เกอร์บิ๊กแมค",
      price: "฿59",
      sizes: null,
      weight: "51 กรัม",
    },
  ];

  return (
    <div data-id="8" className="container mt-4">
      <h4
        className="mt-4"
        style={{ borderLeft: "5px solid #ed1b2f", paddingLeft: 10, fontWeight: "bold" }}
      >
        🍔 เบอร์เกอร์
      </h4>
      <p className="text-muted" style={{ marginTop: -10, marginBottom: 20 }}>
        เบอร์เกอร์ชิ้นโต เนื้อแน่น รสชาติจัดเต็ม พร้อมให้คุณอร่อยเต็มคำทุกคำกัด
      </p>
      <div className="row g-3">
        {items.map(({ img, title, price, sizes, weight }, idx) => (
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
                <h5
                  className="card-title"
                  style={{ fontWeight: 600, fontSize: "1rem", minHeight: sizes ? undefined : "3.3rem" }}
                >
                  {title}
                </h5>
                <p
                  className="card-price"
                  style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.3rem" }}
                >
                  {price}
                </p>

                {sizes ? (
                  <div
                    className="card-text"
                    style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1rem" }}
                  >
                    {sizes.map(({ size, weight }) => (
                      <div key={size}>
                        <i className="fas fa-ruler-horizontal me-2" style={{ color: "#007bff" }}></i>
                        {size}
                        <i
                          className="fas fa-weight-hanging ms-3 me-2"
                          style={{ color: "#dc3545" }}
                        ></i>
                        {weight}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="card-text"
                    style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1rem" }}
                  >
                    <i className="fas fa-weight-hanging me-1"></i> {weight}
                  </p>
                )}

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

export default BurgerCate1;
