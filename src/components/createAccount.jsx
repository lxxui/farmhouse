import React, { useState } from "react";

function CreateAccount({ onClose }) {
    const [step, setStep] = useState(1);

    // ข้อมูลฟอร์ม
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsChecked, setTermsChecked] = useState(false);

    // ฟังก์ชันขั้นตอน 1: กรอก email + phone
    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (!termsChecked) {
            alert("กรุณายอมรับข้อกำหนด");
            return;
        }
        // TODO: validate email/phone และส่งข้อมูลไป backend เก็บก่อน
        setStep(2); // ไปหน้าตั้งรหัสผ่าน
    };

    // ฟังก์ชันขั้นตอน 2: ตั้งรหัสผ่าน
    const handleStep2Submit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }
        if (password.length < 6) {
            alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            return;
        }
        // TODO: ส่งรหัสผ่าน (hash) ไป backend อัปเดตบัญชี
        alert("สมัครสมาชิกสำเร็จ");
        onClose();
    };

    return (
        <div>
            {step === 1 && (
                <form onSubmit={handleStep1Submit}>
                    <h2>สมัครสมาชิก</h2>
                    <input
                        type="email"
                        placeholder="อีเมล"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="เบอร์โทรศัพท์"
                        value={phoneNumber}
                        required
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={termsChecked}
                            onChange={() => setTermsChecked(!termsChecked)}
                        />
                        ยอมรับข้อกำหนด
                    </label>
                    <button type="submit">ถัดไป</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleStep2Submit}>
                    <h2>ตั้งรหัสผ่าน</h2>
                    <input
                        type="password"
                        placeholder="รหัสผ่าน"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="ยืนยันรหัสผ่าน"
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">สมัครสมาชิก</button>
                    <button type="button" onClick={() => setStep(1)}>
                        กลับ
                    </button>
                </form>
            )}
        </div>
    );
}

export default CreateAccount;
