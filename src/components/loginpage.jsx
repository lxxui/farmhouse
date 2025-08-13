import React, { useState } from "react";
import CreateAccount from "./createAccount";

function LoginPage() {
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);

    // ฟังก์ชันเปิด popup สมัครสมาชิก (ปิด popup login)
    const openCreateAccount = () => {
        setShowCreateAccountModal(true);
    };

    // ฟังก์ชันปิด popup สมัครสมาชิก (เปิด popup login)
    const closeCreateAccount = () => {
        setShowCreateAccountModal(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // ป้องกันหน้ารีเฟรช

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${data.name}`);
            } else {
                alert(data.error || "เข้าสู่ระบบไม่สำเร็จ");
            }

        } catch (error) {
            console.error("Login fetch error:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        }
    };

    return (
        <div>
            <div className="logo text-center">
                <img src="/image/logo_top.png" alt="Logo" />
                <div className="text-center font-second">เข้าสู่ระบบ</div>
                <p className="font-detail">ฟาร์มเฮาส์ ฟาร์มสุข</p>
            </div>

            <div className="login-form-container">
                <form className="login-form" onSubmit={handleLogin}>
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
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={closeCreateAccount}  // คลิกที่หลัง popup ให้ปิด
                >
                    <div
                        className="modal-dialog"
                        role="document"
                        onClick={(e) => e.stopPropagation()} // หยุดการปิด popup เมื่อคลิกข้างใน
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
