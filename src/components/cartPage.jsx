import React, { useContext } from "react";
import { CartContext } from "./cartContact";
import { useNavigate } from "react-router-dom";

const CartPage = ({ user }) => {
    const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    if (!cartItems) return <p>Loading...</p>;

    if (cartItems.length === 0) {
        return (
            <div className="container text-center" style={{ marginTop: "100px" }}>
                <h3 style={{ color: "#ed1b2f" }}>🛒 ตะกร้าสินค้าว่าง</h3>
                <button className="btn btn-danger mt-3" onClick={() => navigate("/")}>
                    ← กลับไปเลือกสินค้าต่อ
                </button>
            </div>
        );
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.Price * item.quantity, 0);

    const userAddress = user?.address || {}; // ป้องกัน undefined

    return (
        <div className="container mt-4 mb-5">
            <h3 className="mb-4" style={{ color: "#ed1b2f" }}>ตะกร้าสินค้า</h3>

            {cartItems.map((item) => (
                <div
                    key={item.ProductID}
                    className="d-flex flex-wrap align-items-center justify-content-between p-3 mb-3"
                    style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
                >
                    <div className="d-flex align-items-center" style={{ flex: 2, minWidth: 200 }}>
                        <img
                            src={item.ImageURL}
                            alt={item.ProductName}
                            style={{ width: 80, height: 80, objectFit: "contain", marginRight: 15, borderRadius: 8 }}
                        />
                        <div>
                            <h6 style={{ margin: 0 }}>{item.ProductName}</h6>
                            <p style={{ margin: 0, color: "#555" }}>{item.Price} ฿ / ชิ้น</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center mt-2 mt-md-0" style={{ flex: 1, minWidth: 200, justifyContent: "space-between" }}>
                        <div className="d-flex align-items-center">
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => updateQuantity(item.ProductID, item.quantity - 1)}
                            >-</button>
                            <input
                                type="number"
                                value={item.quantity}
                                min="1"
                                onChange={(e) => updateQuantity(item.ProductID, parseInt(e.target.value))}
                                style={{ width: 50, textAlign: "center", margin: "0 5px", borderRadius: 5, border: "1px solid #ccc", padding: "2px 5px" }}
                            />
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => updateQuantity(item.ProductID, item.quantity + 1)}
                            >+</button>
                        </div>

                        <div className="mt-2 mt-md-0 text-end" style={{ minWidth: 80, flex: 0.5 }}>
                            <strong>{item.Price * item.quantity} ฿</strong>
                        </div>

                        <button
                            className="btn btn-danger btn-sm ms-3"
                            onClick={() => removeFromCart(item.ProductID)}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            ))}

            <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ background: "#ffeaea", borderRadius: 10 }}>
                <h5 style={{ margin: 0, color: "#ed1b2f" }}>รวมทั้งหมด:</h5>
                <h5 style={{ margin: 0, color: "#ed1b2f" }}>{totalPrice} ฿</h5>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-outline-danger me-2" onClick={() => navigate("/")}>
                    ← เลือกสินค้าต่อ
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => navigate("/checkoutPage", { state: { user, address: userAddress, cartItems } })}
                >
                    ชำระเงิน
                </button>
            </div>
        </div>
    );
};

export default CartPage;
