// src/components/navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import LoginPage from "./loginpage"

const Navbar = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // toggle hamburger menu
  const [showPopup, setShowPopup] = useState(false); // ควบคุมแสดง/ซ่อน modal

  const modalContentRef = useRef(null);

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

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-custom d-flex align-items-center justify-content-between flex-wrap">
        <div id="clickable-image" className="logo">
          <a href="/page/home.html" className="d-inline-block">
            <img
              src="/image/logo_top.png"
              alt="ขนมปัง"
              className="img-fluid"
              style={{ maxHeight: 50 }}
            />
          </a>
        </div>

        {/* Hamburger toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarSupportedContent"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          style={{ border: "none", background: "transparent", color: "white" }}
        >
          <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
        </button>

        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarSupportedContent"
          style={collapsedMenuStyle}
        >
          {/* เมนูหลัก + ช่องค้นหา + ปุ่มต่าง ๆ */}
          <div
            className="d-flex align-items-center menu-items-container"
            style={{ gap: 10, flexWrap: "nowrap", flexDirection: "row" }}
          >
            {/* ช่องค้นหา */}
            <input
              type="text"
              className="form-control"
              placeholder="ค้นหาสินค้า / Search products"
              lang="th"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              style={{ width: 250, minWidth: 150 }}
            />

            {/* ปุ่มเปลี่ยนภาษา */}
            <div
              className="dropdown"
              onClick={toggleLangDropdown}
              style={{ cursor: "pointer" }}
            >
              <span
                className="text-white text-decoration-none"
                id="langDropdown"
                aria-expanded={langDropdownOpen}
                style={{ fontSize: 16, userSelect: "none" }}
              >
                TH <i className="bi bi-caret-down-fill ms-1"></i>
              </span>
              {langDropdownOpen && (
                <ul
                  className="dropdown-menu dropdown-menu-end show"
                  aria-labelledby="langDropdown"
                  style={{ background: "transparent", border: "none" }}
                >
                  <li>
                    <a className="dropdown-item text-white" href="#">
                      TH
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item text-white" href="#">
                      EN
                    </a>
                  </li>
                </ul>
              )}
            </div>

            {/* ปุ่มเข้าสู่ระบบ — แบบเดิม: ใช้ <a> แต่ intercept คลิกแล้วเปิด modal */}
            <a
              href="/login"
              className="text-white text-decoration-none"
              style={{ fontSize: 16 }}
              id="loginBtn"
              onClick={(e) => {
                e.preventDefault(); // ป้องกันการไปหน้าใหม่
                setShowPopup(true);
              }}
            >
              เข้าสู่ระบบ
            </a>
            ลงทะเบียน / เข้าสู่ระบบ

            {/* ตะกร้าสินค้า */}
            <div
              className="cart-icon position-relative"
              style={{ fontSize: 24, color: "white", cursor: "pointer" }}
            >
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count btn-cart position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </div>
          </div>
        </div>
      </nav>

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
      {showPopup && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onMouseDown={onBackdropClick}
        >
          <div className="modal-dialog" role="document" style={{ pointerEvents: "auto" }}>
            <div
              className="modal-content"
              ref={modalContentRef}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="modal-body">
                {/* เรียกใช้งาน component check_user ที่คุณสร้างไว้ */}
                <LoginPage/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
