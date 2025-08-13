// src/components/navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import LoginPage from "./loginpage"
import { useNavigate } from "react-router-dom";
import checkStatus from "./checkStatus"


const Navbar = () => {
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // toggle hamburger menu
    const [showPopup, setShowPopup] = useState(false); // ควบคุมแสดง/ซ่อน modal
    const [lang, setLang] = useState("TH");
    const [user, setUser] = useState(null);



    const modalContentRef = useRef(null);

    const handleLogin = async (email, password) => {
        try {
            const res = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.error);
                return;
            }

            const data = await res.json();
            setUser({ name: data.name }); // เก็บชื่อผู้ใช้
            closePopup(); // ปิด modal หลังล็อกอิน
        } catch (err) {
            console.error(err);
        }
    };


    const handleLogout = () => {
        setUser(null);   // ลบข้อมูลผู้ใช้
        // ถ้าต้องการ redirect หลัง logout:
        navigate("/");   // กลับหน้าแรก
    };

    const handleSubmenuClick = (submenu) => {
        setActiveSubmenu((prev) => (prev === submenu ? null : submenu));
    };

    const toggleLangDropdown = () => {
        setLangDropdownOpen((prev) => !prev);
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // ปิด modal ด้วยปุ่ม Esc
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setShowPopup(false);
        };
        if (showPopup) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showPopup]);

    // ถ้าคลิกบริเวณ backdrop จะปิด modal
    const onBackdropClick = (e) => {
        // ถ้าคลิกตรงนอก content ให้ปิด
        if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
            setShowPopup(false);
        }
    };

    const collapsedMenuStyle = {
        flexBasis: "auto",
        justifyContent: "flex-start",
    };

    const navigate = useNavigate();

    const [fadeIn, setFadeIn] = useState(false);

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setFadeIn(false);
        setTimeout(() => setShowPopup(false), 300); // รอ animation ก่อนซ่อนจริง
    };

    useEffect(() => {
        if (showPopup) {
            setTimeout(() => setFadeIn(true), 10);
        }
    }, [showPopup]);


    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-custom d-flex align-items-center flex-wrap">
                <div className="logo">
                    <a href="/">
                        <img
                            src="/image/logo_top.png"
                            alt="ขนมปัง"
                            className="img-fluid"
                            style={{ maxHeight: 50 }}
                        />
                    </a>
                </div>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleMenu}
                    style={{ border: "none", background: "transparent", color: "white" }}
                >
                    <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
                </button>

                <div
                    className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
                    style={{ flexBasis: "auto", justifyContent: "flex-start" }}
                >
                    <div className="d-flex align-items-center w-100 justify-content-end" style={{ gap: 10 }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="ค้นหาสินค้า"
                            style={{ width: 250, minWidth: 150 }}
                        />

                        {user ? (
                            <div className="text-white">
                                สวัสดี, {user.name}{" "}
                                <button onClick={handleLogout} className="btn btn-sm btn-outline-light ms-2">
                                    ออกจากระบบ
                                </button>
                            </div>
                        ) : (
                            <a
                                href="/login"
                                className="text-white text-decoration-none"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openPopup();
                                }}
                            >
                                เข้าสู่ระบบ
                            </a>
                        )}

                        <div
                            className="cart-icon position-relative"
                            style={{ fontSize: 24, color: "white", cursor: "pointer" }}
                        >
                            <i className="fas fa-shopping-cart"></i>
                            <span className="cart-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                3
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {showPopup && (
                <div
                    className={`modal fade ${fadeIn ? "fade-in show" : "fade-out"}`}
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={closePopup}
                >
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-body">
                                <LoginPage />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*ตรวจสอบสถานะคำสั่งซื้อ*/}
            <button
                type="button"
                className="btn btn-danger"  // ใช้คลาส bootstrap สีแดง
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 1000,
                    borderRadius: "50px",  // ทำให้โค้งมนมาก ๆ
                    padding: "10px 20px",  // กำหนดขนาดปุ่มให้ดูดี
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // เงานิดๆให้ลอยเด่น
                }}
                onClick={() => navigate("/checkStatus")}
            >
                ตรวจสอบสถานะคำสั่งซื้อ
            </button>



            {/* ปุ่มหมวดหมู่สินค้า */}
            <div className="justify-content-between mt-2">
                <div className="dropdown">
                    <button
                        id="dropdownBtn"
                        className="btn btn-secondary"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span>
                            <i className="bi bi-list"></i>
                        </span>{" "}
                        หมวดหมู่สินค้า <i className="bi bi-caret-down-fill ms-1"></i>
                    </button>

                    <div className="dropdown-menu mega-menu p-3" style={{ width: "100%" }}>
                        <div className="col-12">
                            <div className="d-flex align-items-center mb-3">
                                <img src="/image/bread.png" alt="หมวดหมู่สินค้า" style={{ height: 40 }} />
                                <h5 className="ml-2 ms-2 mb-0">หมวดหมู่สินค้า</h5>
                            </div>
                        </div>

                        <div className="menu-container d-flex flex-column flex-lg-row">
                            <div className="menu-left d-flex flex-column" style={{ minWidth: 180 }}>
                                {[
                                    { id: "promo", label: "Promotion (โปรโมชั่น)" },
                                    { id: "newproduct", label: "สินค้าใหม่" },
                                    { id: "bread", label: "ขนมปังแผ่น" },
                                    { id: "burger", label: "ขนมปังเบอร์เกอร์และขนมปังฮอทดอก" },
                                    { id: "cake", label: "เค้กขนม" },
                                    { id: "fried", label: "ผลิตภัณฑ์สำหรับทอด" },
                                    { id: "catering", label: "ผลิตภัณฑ์ด่วน จัดเลี้ยง" },
                                ].map(({ id, label }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        className="btn menu-btn mb-1"
                                        onClick={() => handleSubmenuClick(id)}
                                        style={{
                                            backgroundColor: activeSubmenu === id ? "#198754" : "#6c757d",
                                            color: "white",
                                            width: window.innerWidth < 992 ? "100%" : "auto",
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div
                                className="submenu-right flex-grow-1 ps-lg-3 mt-3 mt-lg-0"
                                style={{ minWidth: 180 }}
                            >
                                {activeSubmenu === "promo" && (
                                    <ul className="submenu list-unstyled">
                                        {["โปร 1", "โปร 2", "โปร 3", "โปร 4", "โปร 5"].map((item, idx) => (
                                            <li key={idx}>
                                                <button
                                                    type="button"
                                                    className="btn submenu-btn mb-1"
                                                    style={{
                                                        width: window.innerWidth < 992 ? "100%" : "auto",
                                                    }}
                                                >
                                                    {item}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {activeSubmenu === "newproduct" && (
                                    <ul className="submenu list-unstyled">
                                        {["สินค้าใหม่ 1", "สินค้าใหม่ 2", "สินค้าใหม่ 3"].map((item, idx) => (
                                            <li key={idx}>
                                                <button
                                                    type="button"
                                                    className="btn submenu-btn mb-1"
                                                    style={{
                                                        width: window.innerWidth < 992 ? "100%" : "auto",
                                                    }}
                                                >
                                                    {item}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {!activeSubmenu && (
                                    <div style={{ color: "#666", fontStyle: "italic" }}>
                                        กรุณาเลือกหมวดหมู่ด้านซ้ายเพื่อดูรายละเอียด
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: แสดง LoginPage component */}
            {
                showPopup && (
                    <div
                        className={`modal fade ${fadeIn ? "fade-in show" : "fade-out"}`}
                        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                        onClick={closePopup}
                    >
                        <div
                            className="modal-dialog"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-body">
                                    <LoginPage onLogin={handleLogin} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Navbar;
