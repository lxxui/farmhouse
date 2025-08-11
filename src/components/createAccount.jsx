import React, { useState } from "react";

function CreateAccount({ onClose }) {
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [termsChecked, setTermsChecked] = useState(false);
    const [newsletterChecked, setNewsletterChecked] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!termsChecked || !newsletterChecked) {
            alert("กรุณาเลือกทั้ง 'ยอมรับข้อกำหนด' และ 'ต้องการรับข้อมูลข่าวสาร' ก่อนสมัคร");
            return;
        }

        alert("สมัครสมาชิกสำเร็จ");
        onClose(); // ปิด popup หลังสมัครสำเร็จ
    };

    return (
        <div>
            <div className="logo text-center">
                <img src="/image/logo_top.png" alt="Logo" />
                <div className="text-center font-second">สมัครสมาชิก</div>
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
                        <label htmlFor="number" className="form-label">หมายเลขโทรศัพท์</label>
                        <input
                            type="text"
                            id="number"
                            className="form-control"
                            placeholder="กรอกหมายเลขโทรศัพท์"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="form-check mb-1">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="termsCheckbox"
                            checked={termsChecked}
                            onChange={() => setTermsChecked(!termsChecked)}
                        />
                        <label className="form-check-label" htmlFor="termsCheckbox">
                            ยอมรับข้อกำหนดและเงื่อนไขการให้บริการ{" "}
                            <a href="#">ดูข้อมูลเพิ่มเติม</a>
                        </label>
                    </div>

                    <div className="form-check mb-1">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="newsletterCheckbox"
                            checked={newsletterChecked}
                            onChange={() => setNewsletterChecked(!newsletterChecked)}
                        />
                        <label className="form-check-label" htmlFor="newsletterCheckbox">
                            ต้องการรับข้อมูลข่าวสารผ่านทางอีเมล์
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">ยืนยันการสมัคร</button>

                    <div className="text-center mt-2">
                        <button
                            type="button"
                            className="btn text-center"
                            style={{ color: "#ed1b2f", marginRight: 10 }}
                            onClick={onClose}
                        >
                            กลับสู่หน้าล็อกอิน
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAccount;
