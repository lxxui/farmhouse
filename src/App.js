import React from "react";
import Navbar from "./components/navbar";
import Promotion from "./components/promotion"
import TipsSection from "./components/tipssection";
import MenuList from "./components/headCate";
import BreadMenu from "./components/breadCate";
import HotdogCate from "./components/hotdogCate";
import BurgerCate from "./components/BurgerCate";
import StuffedBreadCate from "./components/stuffedbreadCate";
import CakeCate from "./components/cakeCate";
import PieCate from "./components/PieCate";
import BreadcrumbsCate from "./components/BreadcrumbsCate";
import BurgerCate1 from "./components/BurgerCate1";

function App() {
  return (
    <>
      <Navbar />
      <Promotion />
      <TipsSection />
      <MenuList />
      <BreadMenu />
      <HotdogCate />
      <BurgerCate />
      <StuffedBreadCate />
      <CakeCate />
      <PieCate/>
      <BreadcrumbsCate />
      <BurgerCate1 />


      {/* หรือจะเรียกเฉพาะบางหน้า แล้วสลับตามเงื่อนไขก็ได้ */}
    </>
  );
}

export default App;
