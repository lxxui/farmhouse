import React, { useEffect, useState } from "react";

const CakeCate = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/products?categoryId=5");
        const data = await res.json();

        if (data.success && data.products) {
          setItems(data.products);
        } else {
          console.error("ไม่พบสินค้าหมวดนี้", data.error);
        }
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>กำลังโหลดสินค้าเค้กและขนมญี่ปุ่น...</p>;

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
        {items.map(({ ProductID, ProductName, Price, ShortDescription, ImageURL, Badge }) => (
          <div key={ProductID} className="col-md-3 mb-4">
            <div className="card h-100 text-center">
              {Badge && <div className="category-badge">{Badge}</div>}
              <div
                className="image-box mx-auto"
                style={{ width: 150, height: 150, overflow: "hidden" }}
              >
                <img
                  src={ImageURL}
                  alt={ProductName}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="card-title" style={{ fontWeight: 600, fontSize: "1rem" }}>
                  {ProductName}
                </h5>
                <p className="card-price" style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.3rem" }}>
                  {Price} ฿
                </p>
                <p className="card-text" style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  <i className="fas fa-weight-hanging me-1"></i> {ShortDescription}
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
