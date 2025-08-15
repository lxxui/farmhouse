import React, { useState } from "react";

function CreateAccount({ onClose }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsChecked, setTermsChecked] = useState(false);

    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (!termsChecked) {
            alert("กรุณายอมรับข้อกำหนด");
            return;
        }
        setStep(2);
    };

    const handleStep2Submit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }
        if (password.length < 6) {
            alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    phone: phoneNumber,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("สมัครสมาชิกสำเร็จ");
                onClose();
            } else {
                alert(`สมัครสมาชิกไม่สำเร็จ: ${data.error || 'เกิดข้อผิดพลาด'}`);
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
            console.error(error);
        }
    };
    return (
        <>
            <div
                className="modal-dialog d-flex align-items-center"
                style={{ minHeight: "100vh" }}
            >
                <div className="logo text-center">
                    <img src="/image/logo_top.png" alt="Logo" />
                    <div className="text-center font-second">สมัครสมาชิก</div>
                    <p className="font-detail">ฟาร์มเฮาส์ ฟาร์มสุข</p>
                </div>

                <div className="p-3" style={{ maxWidth: 400, margin: "0 auto" }}>
                    {step === 1 && (
                        <form onSubmit={handleStep1Submit}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="อีเมล"
                                    className="form-control"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="เบอร์โทรศัพท์"
                                    className="form-control"
                                    value={phoneNumber}
                                    required
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="termsCheckbox"
                                    checked={termsChecked}
                                    onChange={() => setTermsChecked(!termsChecked)}
                                />
                                <label className="form-check-label" htmlFor="termsCheckbox">
                                    ข้าพเจ้ายินยอมให้เก็บข้อมูลส่วนตัว เช่น อีเมล และเบอร์โทรศัพท์ เพื่อใช้สำหรับส่งข้อมูลข่าวสารและการจัดส่งสินค้า
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                ถัดไป
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleStep2Submit}>
                            <h2 className="mb-4 text-center">ตั้งรหัสผ่าน</h2>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="รหัสผ่าน"
                                    className="form-control"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="ยืนยันรหัสผ่าน"
                                    className="form-control"
                                    value={confirmPassword}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <div className="d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setStep(1)}
                                >
                                    กลับ
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    สมัครสมาชิก
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div >
        </>
    );
}

export default CreateAccount;
