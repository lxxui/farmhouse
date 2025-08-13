import React, { useState, useEffect } from "react";
import CreateAccount from "./createAccount";

function LoginPage() {
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const openCreateAccount = () => {
    setShowCreateAccountModal(true);
  };

  const closeCreateAccount = () => {
    setFadeIn(false);
    setTimeout(() => setShowCreateAccountModal(false), 300); // รอ animation จบก่อนซ่อน
  };

  useEffect(() => {
    if (showCreateAccountModal) {
      setTimeout(() => setFadeIn(true), 10);
    }
  }, [showCreateAccountModal]);

  return (
    <div>
      <div className="logo text-center">
        <img src="/image/logo_top.png" alt="Logo" />
        <div className="text-center font-second">เข้าสู่ระบบ</div>
        <p className="font-detail">ฟาร์มเฮาส์ ฟาร์มสุข</p>
      </div>

      <div className="login-form-container">
        <form className="login-form">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">อีเมล</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="กรอกอีเมล"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="กรอกรหัสผ่าน"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">เข้าสู่ระบบ</button>

          <div className="text-divider text-center my-2">หรือเข้าสู่ระบบโดย</div>

          <div className="row g-2 text-center mt-2">
            <div className="col-6">
              <a
                href="https://accounts.google.com/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-danger w-100"
              >
                <i className="fab fa-google me-2"></i> Google
              </a>
            </div>
            <div className="col-6">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary w-100"
              >
                <i className="fab fa-facebook-f me-2"></i> Facebook
              </a>
            </div>
          </div>

          <div className="text-center mt-4">
            ยังไม่มีสมาชิก?{" "}
            <span
              style={{ color: "#ed1b2f", cursor: "pointer" }}
              onClick={openCreateAccount}
            >
              สมัครสมาชิก
            </span>
          </div>
        </form>
      </div>

      {/* popup สมัครสมาชิก */}
      {showCreateAccountModal && (
        <div
          className={`modal fade ${fadeIn ? "show fade-in" : "fade-out"}`}
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeCreateAccount}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-body">
                <CreateAccount onClose={closeCreateAccount} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
