import React from "react";

const images = [
  { src: "/image/to_tone.jpg", alt: "img_pro1" },
  { src: "/image/dora.jpg", alt: "img_pro2" },
  { src: "/image/mario.jpg", alt: "img_pro3" },
  { src: "/image/pang_pea.jpg", alt: "img_pro4" },
  { src: "/image/dora.jpg", alt: "img_pro5" },
];

const Carousel = () => {
  return (
<div className="container" style={{ marginTop: "60px" }}>
      <div
        id="carouselExample"
        className="carousel slide carousel-fade mt-2"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-inner">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`carousel-item${idx === 0 ? " active" : ""}`}
            >
              <img src={img.src} className="d-block w-100" alt={img.alt} />
            </div>
          ))}
        </div>

        {/* ปุ่มควบคุม (ถ้าต้องการ) */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span> */}
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          {/* <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span> */}
        </button>
      </div>
    </div>
  );
};

export default Carousel;
