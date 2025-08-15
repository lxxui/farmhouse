import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage({ user, handleLogout }) {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("profile");

    const menuItems = [
        { key: "profile", label: "ข้อมูลส่วนตัว", icon: "fas fa-user" },
        { key: "address", label: "ข้อมูลที่อยู่", icon: "fas fa-map-marker-alt" },
        { key: "orders", label: "ติดตามการสั่งซื้อ", icon: "fas fa-box" },
        { key: "logout", label: "ออกจากระบบ", icon: "fas fa-sign-out-alt" },
    ];

    const handleMenuClick = (key) => {
        if (key === "logout") {
            handleLogout();
        } else {
            setActiveMenu(key);
        }
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
                        <p>ชื่อ: {user.name}</p>
                        <p>อีเมล: {user.email}</p>
                    </div>
                );
            // ...
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
                                    <i className={`${item.icon} me-2`}></i>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-md-9 col-sm-12">
                        <div className="card p-3 shadow-sm">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
