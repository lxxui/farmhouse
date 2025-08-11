import React from "react";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#D90000" }} className="text-white py-4">
      <div className="container">
        <div className="row align-items-center text-center text-white">

          {/* โลโก้และ Customer Support */}
          <div className="col-md-3 mb-3 mb-md-0">
            <img src="/image/logo_top.png" alt="Farmhouse Logo" style={{ height: "50px" }} />
            <div className="mt-2">
              <div>Customer Support</div>
              <div>(022093000 Ext. 3090)</div>
              <div>(Mon–Fri : 8.00 – 17.00)</div>
            </div>
          </div>

          {/* เมนูไอคอนแนวนอน */}
          <div className="col-md-7 d-flex justify-content-center flex-wrap text-white">
            <div className="px-3 text-center">
              <img src="/image/36.png" style={{ height: "40px" }} alt="Site Map" />
              <div className="mt-1">Site Map</div>
            </div>
            <div className="vr me-3" style={{ height: "30px" }}></div>

            <div className="px-3 text-center border-start border-white">
              <img src="/image/37.png" style={{ height: "40px" }} alt="CSR & Activity" />
              <div className="mt-1">CSR & Activity</div>
            </div>
            <div className="vr me-3" style={{ height: "30px" }}></div>

            <div className="px-3 text-center border-start border-white">
              <img src="/image/38.png" style={{ height: "40px" }} alt="Farmhouse Online" />
              <div className="mt-1">Farmhouse Online</div>
            </div>
            <div className="vr me-3" style={{ height: "30px" }}></div>

            <div className="px-3 text-center border-start border-white">
              <img src="/image/39.png" style={{ height: "40px" }} alt="Career" />
              <div className="mt-1">Career</div>
            </div>
          </div>

          {/* ตัวการ์ตูนขวาสุด */}
          <div className="col-md-2 text-center">
            <img src="/image/40.png" style={{ height: "100px" }} alt="Mascot" />
            <div className="mt-1 fw-bold">
              อยากรู้เรื่องขนมปัง
              <br />
              ถามฟาร์มเฮ้าส์
            </div>
          </div>

          {/* ติดต่อเรา (แยก row) */}
          <div className="w-100 mt-3">
            <p className="mb-0 text-center">
              ติดต่อเรา:{" "}
              <a href="mailto:info@farmhouseweb.com" style={{ color: "white" }}>
                info@farmhouseweb.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
