import React, { useState } from "react";
import CreateAccount from "./createAccount";

function LoginPage() {
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const openCreateAccount = () => setShowCreateAccountModal(true);
    const closeCreateAccount = () => setShowCreateAccountModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // ป้องกัน form reload หน้า

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login success:", data);
                setError("");
                alert(`Login สำเร็จ! ยินดีต้อนรับ ${data.name}`);
                // ตัวอย่าง redirect ไปหน้าหลัก
                // window.location.href = "/dashboard";
            } else {
                setError(data.error || "เกิดข้อผิดพลาด");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("ไม่สามารถเชื่อมต่อกับ server");
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
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">อีเมล</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="กรอกอีเมล"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="text-danger mb-3">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100">เข้าสู่ระบบ</button>
                </form>
            </div>

            {/* popup สมัครสมาชิก */}
            {showCreateAccountModal && (
                <div
                    className="modal fade show"
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
