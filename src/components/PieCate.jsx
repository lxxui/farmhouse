// PieCate.jsx
import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "./cartContact";

const PieCate = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/products?categoryId=6");
        const data = await res.json();
        if (data.success && data.products) {
          setItems(data.products);
          // init quantity = 1
          const initialQuantities = {};
          data.products.forEach(p => (initialQuantities[p.ProductID] = 1));
          setQuantities(initialQuantities);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Change quantity
  const handleQuantityChange = (id, value) => {
    value = parseInt(value);
    if (isNaN(value) || value < 1) value = 1;
    setQuantities(prev => ({ ...prev, [id]: value }));
  };

  // Add to cart
  const handleAddToCart = (product, e) => {
    const quantity = quantities[product.ProductID] || 1;
    addToCart({ ...product, quantity });

    // Animation
    const cartIcon = document.getElementById("cart-icon");
    if (!cartIcon) return;

    const img = e.currentTarget.closest(".card").querySelector("img");
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const imgClone = img.cloneNode(true);
    Object.assign(imgClone.style, {
      position: "fixed",
      left: `${imgRect.left}px`,
      top: `${imgRect.top}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
      transition: "all 0.7s ease-in-out",
      zIndex: 9999,
      borderRadius: "10px",
    });
    document.body.appendChild(imgClone);

    requestAnimationFrame(() => {
      Object.assign(imgClone.style, {
        left: `${cartRect.left}px`,
        top: `${cartRect.top}px`,
        width: "30px",
        height: "30px",
        opacity: "0.5",
      });
    });

    imgClone.addEventListener("transitionend", () => imgClone.remove());

    const flyingNum = document.createElement("div");
    flyingNum.innerText = `+${quantity}`;
    Object.assign(flyingNum.style, {
      position: "fixed",
      left: `${imgRect.left}px`,
      top: `${imgRect.top}px`,
      fontSize: "18px",
      fontWeight: "bold",
      color: "red",
      zIndex: 9999,
    });
    document.body.appendChild(flyingNum);

    flyingNum.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.5)`, opacity: 0 },
      ],
      { duration: 700, easing: "ease-in-out" }
    ).onfinish = () => flyingNum.remove();
  };

  if (loading) return <p>กำลังโหลดสินค้าพาย...</p>;

  return (
    <div data-id="6" className="container mt-3 mb-5">
      <h4 style={{ borderLeft: "5px solid #ed1b2f", paddingLeft: 10, fontWeight: "bold" }}>🥧 พาย</h4>
      <p className="text-muted" style={{ marginTop: -10, marginBottom: 20 }}>
        พายกรอบนอกนุ่มใน ไส้แน่นเต็มคำ หลากหลายรสชาติที่คุณต้องลอง
      </p>

      <div className="row g-3">
        {items.map(({ ProductID, ProductName, Price, ShortDescription, ImageURL, Badge }) => (
          <div key={ProductID} className="col-md-3 mb-4">
            <div className="card h-100 text-center">
              {Badge && <div className="category-badge">{Badge}</div>}

              <div className="image-box mx-auto" style={{ width: 150, height: 150, overflow: "hidden" }}>
                <img src={ImageURL} alt={ProductName} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>

              <div className="card-body text-center">
                <h5 className="card-title" style={{ fontWeight: 600, fontSize: "1rem" }}>{ProductName}</h5>
                <p className="card-price" style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.3rem" }}>{Price} ฿</p>
                <p className="card-text" style={{ color: "#555", fontSize: "0.9rem", marginBottom: 16 }}>
                  <i className="fas fa-weight-hanging me-1"></i> {ShortDescription}
                </p>

                {/* Quantity Input */}
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(ProductID, (quantities[ProductID] || 1) - 1)}>-</button>
                  <input
                    type="number"
                    value={quantities[ProductID] || 1}
                    onChange={e => handleQuantityChange(ProductID, e.target.value)}
                    style={{ width: 50, textAlign: "center", margin: "0 5px" }}
                  />
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(ProductID, (quantities[ProductID] || 1) + 1)}>+</button>
                </div>

                <button className="btn btn-danger" style={{ borderRadius: 25 }} onClick={e => handleAddToCart({ ProductID, ProductName, Price, ImageURL, ShortDescription, Badge }, e)}>
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

export default PieCate;
