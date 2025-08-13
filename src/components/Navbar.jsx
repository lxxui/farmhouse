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

 // ฟังก์ชันล็อกอิน
    const handleLogin = async (email, password) => {
        try {
            const res = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.success) {
                setUser({ name: data.name });
                closePopup();
            } else {
                alert(data.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            }
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาด");
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
            <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} style={{ flexBasis: "auto", justifyContent: "flex-start" }}>
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
                        <span
                            style={{ color: "white", cursor: "pointer" }}
                            onClick={openPopup}
                        >
                            เข้าสู่ระบบ
                        </span>
                    )}

                    <div className="cart-icon position-relative" style={{ fontSize: 24, color: "white", cursor: "pointer" }}>
                        <i className="fas fa-shopping-cart"></i>
                        <span className="cart-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            3
                        </span>
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
