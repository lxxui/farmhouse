import React from "react";

const TipsSection = () => {
  return (
    <div className="p-2 mt-2" style={{ backgroundColor: "#f4f4f5" }}>
      <div className="container my-4">
        <h3>
          <i className="fas fa-bowl-food"></i> เคล็ดลับความอร่อย by Farmhouse
        </h3>
        <div className="center-container">
          <div className="row g-3">
            {[
              { src: "/image/arti_1.jpg", alt: "บทความ 1" },
              { src: "/image/arti_2.jpg", alt: "บทความ 2" },
              { src: "/image/arti_3.png", alt: "บทความ 3" },
              { src: "/image/arti_4.jpg", alt: "บทความ 4" },
            ].map(({ src, alt }, idx) => (
              <div className="col-12 col-sm-6 col-md-3" key={idx}>
                <div className="card">
                  <img
                    src={src}
                    alt={alt}
                    className="card-img"
                    style={{
                      width: "100%",
                      height: "200px",       // กำหนดความสูงเท่ากัน
                      objectFit: "cover",    // ครอบภาพเต็มกรอบโดยไม่บิดเบี้ยว
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsSection;
