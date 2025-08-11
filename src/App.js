import React from "react";
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

import CheckStatus from "./components/checkStatus"; // import หน้า checkStatus เข้ามาด้วย

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* กำหนด route หลักที่เป็นหน้าหลัก */}
        <Route
          path="/"
          element={
            <>
              <Promotion />
              <TipsSection />
              <MenuList />
              <BreadMenu />
              <HotdogCate />
              <BurgerCate />
              <StuffedBreadCate />
              <CakeCate />
              <PieCate />
              <BreadcrumbsCate />
              <BurgerCate1 />
            </>
          }
        />

        {/* กำหนด route checkStatus */}
        <Route path="/checkStatus" element={<CheckStatus />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
