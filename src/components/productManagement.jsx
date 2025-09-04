import React, { useState, useEffect } from "react";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editForm, setEditForm] = useState({
        ProductName: "",
        Price: "",
        DiscountPrice: "",
        ShortDescription: "",
        ImageURL: ""
    });

    // โหลดรายการสินค้า
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:3001/products");
                const data = await res.json();
                if (data.success && data.products) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // เริ่มแก้ไข
    const handleEditClick = (product) => {
        setEditingProductId(product.ProductID);
        setEditForm({
            ProductName: product.ProductName,
            Price: product.Price,
            DiscountPrice: product.DiscountPrice,
            ShortDescription: product.ShortDescription,
            ImageURL: product.ImageURL
        });
    };

    // บันทึกการแก้ไข
    const handleSave = (id) => {
        setProducts(products.map(p => p.ProductID === id ? { ...p, ...editForm } : p));
        setEditingProductId(null);
    };

    // ยกเลิกการแก้ไข
    const handleCancel = () => {
        setEditingProductId(null);
    };

    // ลบสินค้า
    const handleDelete = (id) => {
        if (window.confirm("คุณต้องการลบสินค้านี้หรือไม่?")) {
            setProducts(products.filter(p => p.ProductID !== id));
        }
    };

    return (
        <div className="container mt-4">
            <h2>จัดการสินค้า</h2>
            {loading ? (
                <p>กำลังโหลด...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>รหัสสินค้า</th>
                                <th>ชื่อสินค้า</th>
                                <th>ราคา</th>
                                <th>ราคาส่วนลด</th>
                                <th>รายละเอียด</th>
                                <th>รูป</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">ไม่มีข้อมูลสินค้า</td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.ProductID}>
                                        <td>{p.ProductID}</td>
                                        <td>
                                            {editingProductId === p.ProductID ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editForm.ProductName}
                                                    onChange={e => setEditForm({ ...editForm, ProductName: e.target.value })}
                                                />
                                            ) : (
                                                p.ProductName
                                            )}
                                        </td>
                                        <td>
                                            {editingProductId === p.ProductID ? (
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={editForm.Price}
                                                    onChange={e => setEditForm({ ...editForm, Price: e.target.value })}
                                                />
                                            ) : (
                                                `${p.Price} ฿`
                                            )}
                                        </td>
                                        <td>
                                            {editingProductId === p.ProductID ? (
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={editForm.DiscountPrice}
                                                    onChange={e => setEditForm({ ...editForm, DiscountPrice: e.target.value })}
                                                />
                                            ) : (
                                                p.DiscountPrice && p.DiscountPrice < p.Price ? (
                                                    <>
                                                        <span style={{ textDecoration: "line-through", color: "#999" }}>
                                                            {p.Price} ฿
                                                        </span>{" "}
                                                        <span style={{ color: "red", fontWeight: 700 }}>
                                                            {p.DiscountPrice} ฿
                                                        </span>
                                                    </>
                                                ) : (
                                                    `${p.Price} ฿`
                                                )
                                            )}
                                        </td>
                                        <td>
                                            {editingProductId === p.ProductID ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editForm.ShortDescription}
                                                    onChange={e => setEditForm({ ...editForm, ShortDescription: e.target.value })}
                                                />
                                            ) : (
                                                p.ShortDescription
                                            )}
                                        </td>
                                        <td>
                                            {editingProductId === p.ProductID ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editForm.ImageURL}
                                                    onChange={e => setEditForm({ ...editForm, ImageURL: e.target.value })}
                                                />
                                            ) : (
                                                <img src={p.ImageURL} alt={p.ProductName} width="80" />
                                            )}
                                        </td>
                                        <td>
                                            {editingProductId === p.ProductID ? (
                                                <>
                                                    <button className="btn btn-sm btn-success me-1" onClick={() => handleSave(p.ProductID)}>บันทึก</button>
                                                    <button className="btn btn-sm btn-secondary" onClick={handleCancel}>ยกเลิก</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="btn btn-sm btn-primary me-1" onClick={() => handleEditClick(p)}>แก้ไข</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.ProductID)}>ลบ</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
