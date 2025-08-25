import React, { useContext } from "react";
import { CartContext } from "./cartContact";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    if (!cartItems) return <p>Loading...</p>;
    if (cartItems.length === 0) return <h3 className="text-center mt-5">🛒 ตะกร้าสินค้าว่าง</h3>;

    return (
        <div className="container mt-4">
            <h3>ตะกร้าสินค้า</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>สินค้า</th>
                        <th>ราคา</th>
                        <th>จำนวน</th>
                        <th>รวม</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.ProductID}>
                            <td>
                                <img src={item.ImageURL} alt={item.ProductName} style={{ width: 60, marginRight: 10 }} />
                                {item.ProductName}
                            </td>
                            <td>{item.Price} ฿</td>
                            <td>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    style={{ width: 60 }}
                                    onChange={(e) => updateQuantity(item.ProductID, parseInt(e.target.value))}
                                />
                            </td>
                            <td>{item.Price * item.quantity} ฿</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.ProductID)}>
                                    ลบ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4 className="text-end" style={{ marginTop: 20 }}>
                รวมทั้งหมด: {cartItems.reduce((sum, item) => sum + item.Price * item.quantity, 0)} ฿
            </h4>

            {/* ปุ่มกลับไปเลือกสินค้าต่อ */}
            <div className="text-start mt-3">
                <button className="btn btn-secondary" onClick={() => navigate("/")}>
                    ← กลับไปเลือกสินค้าต่อ
                </button>
            </div>
        </div>
    );
};

export default CartPage;
