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

    const [categories, setCategories] = useState([]); // รายการหมวดหมู่
    const [selectedCategory, setSelectedCategory] = useState(""); // หมวดหมู่ที่เลือก
    const [searchTerm, setSearchTerm] = useState(""); // ค้นหาชื่อสินค้า

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // โหลดหมวดหมู่
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:3001/categories"); // ต้องมี endpoint /categories
                const data = await res.json();
                if (data.success) {
                    setCategories(data.categories);
                }
            } catch (err) {
                console.error("Fetch categories error:", err);
            }
        };
        fetchCategories();
    }, []);

    // โหลดรายการสินค้า
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = "http://localhost:3001/products";
                if (selectedCategory) url += `?categoryId=${selectedCategory}`;
                const res = await fetch(url);
                const data = await res.json();
                if (data.success && data.products) {
                    setProducts(data.products);
                    setCurrentPage(1); // รีเซ็ตหน้าเมื่อ filter ใหม่
                }
            } catch (err) {
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory]);

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

    // Pagination
    const filteredProducts = products.filter(p =>
        p.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };
    return (
        <div className="mt-4">
            <h2>จัดการสินค้า</h2>
            {/* Filter & Search */}
            <div className="d-flex justify-content-end mb-3">
                <select
                    className="form-select me-2"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{ width: "200px" }}
                >
                    <option value="">ทุกหมวดหมู่</option>
                    {categories.map(cat => (
                        <option key={cat.CategoryID} value={cat.CategoryID}>{cat.CategoryName}</option>
                    ))}
                </select>

                <input
                    type="text"
                    className="form-control ml-3"
                    placeholder="ค้นหาชื่อสินค้า..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
            {loading ? (
                <p>กำลังโหลด...</p>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "80px" }}>รหัสสินค้า</th>
                                    <th>ชื่อสินค้า</th>
                                    <th style={{ width: "100px" }}>ราคา</th>
                                    <th style={{ width: "120px" }}>ราคาส่วนลด</th>
                                    <th>รายละเอียด</th>
                                    <th style={{ width: "100px" }}>รูป</th>
                                    <th style={{ width: "150px" }}>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">ไม่มีข้อมูลสินค้า</td>
                                    </tr>
                                ) : (
                                    currentProducts.map((p) => (
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
                                            <td style={{ textAlign: "center" }}>
                                                {editingProductId === p.ProductID ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editForm.ImageURL}
                                                        onChange={e => setEditForm({ ...editForm, ImageURL: e.target.value })}
                                                    />
                                                ) : (
                                                    <img src={p.ImageURL} alt={p.ProductName} width="60" />
                                                )}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                {editingProductId === p.ProductID ? (
                                                    <>
                                                        <button className="btn btn-sm btn-success me-1 mr-2" onClick={() => handleSave(p.ProductID)}>บันทึก</button>
                                                        <button className="btn btn-sm btn-secondary" onClick={handleCancel}>ยกเลิก</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn btn-sm btn-primary me-1 mr-2" onClick={() => handleEditClick(p)}>แก้ไข</button>
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

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <button className="btn btn-outline-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                            ก่อนหน้า
                        </button>
                        <span>หน้า {currentPage} / {totalPages}</span>
                        <button className="btn btn-outline-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            ถัดไป
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductManagement;
