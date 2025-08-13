import React, { useState } from "react";
import CreateAccount from "./createAccount";

function LoginPage() {
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [userName, setUserName] = useState(""); // เก็บชื่อผู้ใช้

    const openCreateAccount = () => setShowCreateAccountModal(true);
    const closeCreateAccount = () => {
        setFadeIn(false);
        setTimeout(() => setShowCreateAccountModal(false), 300);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const res = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                // เอา 2 ตัวแรกของอีเมล
                const name = email.slice(0, 2);
                setUserName(name);
            } else {
                alert(data.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            }
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };

    return (
        <div>
            <div className="logo text-center">
                <img src="/image/logo_top.png" alt="Logo" />
                <div className="text-center font-second">
                    {userName ? `คุณ ${userName}` : "เข้าสู่ระบบ"}
                </div>
                <p className="font-detail">ฟาร์มเฮาส์ ฟาร์มสุข</p>
            </div>

            <div className="login-form-container">
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">อีเมล</label>
                        <input type="email" id="email" name="email" className="form-control" placeholder="กรอกอีเมล" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">รหัสผ่าน</label>
                        <input type="password" id="password" name="password" className="form-control" placeholder="กรอกรหัสผ่าน" required />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">เข้าสู่ระบบ</button>
                </form>

                <div className="text-center mt-4">
                    ยังไม่มีสมาชิก?{" "}
                    <span style={{ color: "#ed1b2f", cursor: "pointer" }} onClick={openCreateAccount}>
                        สมัครสมาชิก
                    </span>
                </div>
            </div>

            {showCreateAccountModal && (
                <div className={`modal fade ${fadeIn ? "show fade-in" : "fade-out"}`}
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={closeCreateAccount}>
                    <div className="modal-dialog" role="document" onClick={e => e.stopPropagation()}>
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
