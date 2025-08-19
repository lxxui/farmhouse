import React, { useState } from "react";
import provinces from './data/provinces.json';
import district from './data/districts.json';
import geography from './data/geography.json';
import subdistricts from './data/subdistricts.json';



function ProfilePage({ user }) {
    const [activeMenu, setActiveMenu] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const menuItems = [
        { key: "profile", label: "ข้อมูลส่วนตัว", icon: "fas fa-user" },
        { key: "address", label: "ข้อมูลที่อยู่", icon: "fas fa-map-marker-alt" },
        { key: "orders", label: "ติดตามการสั่งซื้อ", icon: "fas fa-box" },
    ];

    const handleMenuClick = (key) => {
        setActiveMenu(key);
        setIsEditing(false); // ปิด edit ถ้าเปลี่ยนเมนู
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // TODO: ส่ง formData ไป update backend

        console.log("บันทึกข้อมูล:", formData);
        setIsEditing(false);
    };

    const renderContent = () => {
        if (!user) {
            return (
                <div>
                    <h4>กรุณาเข้าสู่ระบบ</h4>
                    <p>คุณต้องเข้าสู่ระบบก่อนจึงจะดูข้อมูลได้</p>
                </div>
            );
        }

        switch (activeMenu) {
            case "profile":
                return (
                    <div>
                        <h4>ข้อมูลส่วนตัว</h4>

                        <p>
                            ชื่อ:{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            ) : (
                                formData.name
                            )}
                        </p>

                        <p>
                            อีเมล:{" "}
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            ) : (
                                formData.email
                            )}
                        </p>

                        <p>
                            เบอร์โทรศัพท์:{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            ) : (
                                formData.phone
                            )}
                        </p>

                        {isEditing ? (
                            <button className="btn btn-success mt-2" onClick={handleSave}>
                                บันทึก
                            </button>
                        ) : (
                            <button className="btn btn-primary mt-2" onClick={handleEdit}>
                                แก้ไขข้อมูล
                            </button>
                        )}
                    </div>
                );

            case "address":
                return (
                    <div>
                        <h4>ข้อมูลที่อยู่</h4>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label>ชื่อผู้ติดต่อ</label>
                                <input
                                    type="text"
                                    name="contact_name"
                                    value={formData.contact_name || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label>เบอร์โทรศัพท์</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label>บ้านเลขที่</label>
                                <input
                                    type="text"
                                    name="house_number"
                                    value={formData.house_number || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label>หมู่บ้าน/คอนโด</label>
                                <input
                                    type="text"
                                    name="village"
                                    value={formData.village || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label>ถนน</label>
                                <input
                                    type="text"
                                    name="road"
                                    value={formData.road || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label>จังหวัด</label>
                                <select
                                    name="province"
                                    value={formData.province || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">-- เลือกจังหวัด --</option>
                                    {provinces.map((p) => (
                                        <option key={p.id} value={p.name}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label>อำเภอ</label>
                                <select
                                    name="amphoe"
                                    value={formData.amphoe || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">-- เลือกอำเภอ --</option>
                                    {amphoes
                                        .filter((a) => a.province_id === selectedProvinceId)
                                        .map((a) => (
                                            <option key={a.id} value={a.name}>
                                                {a.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                        </div>

                        <button className="btn btn-success mt-3" onClick={handleSave}>
                            บันทึก
                        </button>
                    </div>
                );


            case "orders":
                return (
                    <div>
                        <h4>ติดตามการสั่งซื้อ</h4>
                        {/* ใส่เนื้อหาสำหรับติดตามการสั่งซื้อ */}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container">
            <div className="container-fluid mt-4">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3 col-sm-12 mb-3">
                        <div className="list-group">
                            {menuItems.map((item) => (
                                <button
                                    key={item.key}
                                    className={`list-group-item list-group-item-action ${activeMenu === item.key ? "active" : ""
                                        }`}
                                    onClick={() => handleMenuClick(item.key)}
                                >
                                    <i className={`${item.icon} me-2`}></i> &nbsp;
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-md-9 col-sm-12">
                        <div className="card p-3 shadow-sm">{renderContent()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
