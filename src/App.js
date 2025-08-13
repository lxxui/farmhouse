import React, { useState } from "react";  // ต้อง import useState
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Promotion from "./components/promotion";
import TipsSection from "./components/tipssection";
import MenuList from "./components/headCate";
import BreadMenu from "./components/breadCate";
import HotdogCate from "./components/hotdogCate";
import BurgerCate from "./components/burgerCate";
import StuffedBreadCate from "./components/stuffedbreadCate";
import CakeCate from "./components/cakeCate";
import PieCate from "./components/pieCate";
import BreadcrumbsCate from "./components/breadcrumbsCate";
import BurgerCate1 from "./components/burgerCate1";
import Footer from "./components/footer";

import CheckStatus from "./components/checkStatus";

function App() {
  // ประกาศ state category
  const [category, setCategory] = useState("");

  return (
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Navbar กับเนื้อหาทั้งหมด */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Promotion />
                  <TipsSection />
                  <MenuList category={category} setCategory={setCategory} />

                  {/* แสดง component เมนูที่กรองตาม category */}
                  {(category === "" || category === "1") && <BreadMenu category={category} />}
                  {(category === "" || category === "2") && <HotdogCate category={category} />}
                  {(category === "" || category === "3") && <BurgerCate category={category} />}
                  {(category === "" || category === "4") && <StuffedBreadCate category={category} />}
                  {(category === "" || category === "5") && <CakeCate category={category} />}
                  {(category === "" || category === "6") && <PieCate category={category} />}
                  {(category === "" || category === "7") && <BreadcrumbsCate category={category} />}
                  {(category === "" || category === "8") && <BurgerCate1 category={category} />}
                </>
              }
            />
            <Route path="/checkStatus" element={<CheckStatus />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
