import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "./cartContact";

const BreadMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({}); // เก็บจำนวนสินค้าตาม ProductID

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/products?categoryId=1");
        const data = await res.json();
        if (data.success && data.products) {
          setItems(data.products);
          // เริ่มต้น quantity = 1
          const initialQuantities = {};
          data.products.forEach(p => (initialQuantities[p.ProductID] = 1));
          setQuantities(initialQuantities);
        }
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (id, value) => {
    if (value < 1) value = 1;
    setQuantities(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleAddToCart = (product, e) => {
    const quantity = quantities[product.ProductID] || 1;
    addToCart({ ...product, quantity });

    // หา cart icon
    const cartIcon = document.getElementById("cart-icon");
    if (!cartIcon) return;

    // หา image ของสินค้าที่กด
    const img = e.currentTarget.closest(".card").querySelector("img");
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // clone image
    const imgClone = img.cloneNode(true);
    imgClone.style.position = "fixed";
    imgClone.style.left = `${imgRect.left}px`;
    imgClone.style.top = `${imgRect.top}px`;
    imgClone.style.width = `${imgRect.width}px`;
    imgClone.style.height = `${imgRect.height}px`;
    imgClone.style.transition = "all 0.7s ease-in-out";
    imgClone.style.zIndex = 9999;
    imgClone.style.borderRadius = "10px";
    document.body.appendChild(imgClone);

    requestAnimationFrame(() => {
      imgClone.style.left = `${cartRect.left}px`;
      imgClone.style.top = `${cartRect.top}px`;
      imgClone.style.width = "30px";
      imgClone.style.height = "30px";
      imgClone.style.opacity = "0.5";
    });

    imgClone.addEventListener("transitionend", () => {
      imgClone.remove();
    });

    // สร้างตัวเลข +จำนวน
    const flyingNum = document.createElement("div");
    flyingNum.innerText = `+${quantity}`;
    flyingNum.style.position = "fixed";
    flyingNum.style.left = `${imgRect.left}px`;
    flyingNum.style.top = `${imgRect.top}px`;
    flyingNum.style.fontSize = "18px";
    flyingNum.style.fontWeight = "bold";
    flyingNum.style.color = "red";
    flyingNum.style.zIndex = 9999;
    document.body.appendChild(flyingNum);

    flyingNum.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top
            }px) scale(0.5)`,
          opacity: 0,
        },
      ],
      { duration: 700, easing: "ease-in-out" }
    ).onfinish = () => flyingNum.remove();
  };

  if (loading) return <p>กำลังโหลดสินค้าขนมปัง...</p>;

  return (
    <div className="container mt-3 mb-5">
      <h4
        style={{
          borderLeft: "5px solid #ed1b2f",
          paddingLeft: 10,
          fontWeight: "bold",
        }}
      >
        🍞 ขนมปังแผ่น
      </h4>
      <div className="row g-3">
        {items.map(product => (
          <div key={product.ProductID} className="col-md-3 mb-4">
            <div className="card h-100 text-center">
              <img
                src={product.ImageURL}
                alt={product.ProductName}
                style={{ width: 150, height: 150, objectFit: "contain", margin: "auto" }}
              />
              <div className="card-body">
                <h5>{product.ProductName}</h5>
                <p style={{ fontWeight: 700 }}>{product.Price} ฿</p>

                {/* Input จำนวน */}
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      handleQuantityChange(product.ProductID, quantities[product.ProductID] - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantities[product.ProductID]}
                    onChange={e =>
                      handleQuantityChange(product.ProductID, parseInt(e.target.value))
                    }
                    style={{ width: 50, textAlign: "center", margin: "0 5px" }}
                  />
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      handleQuantityChange(product.ProductID, quantities[product.ProductID] + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-danger"
                  style={{ borderRadius: 25 }}
                  onClick={e => handleAddToCart(product, e)}
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
