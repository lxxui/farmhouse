import React from "react";
import { BrowserRouter } from "react-router-dom";
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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (

    <BrowserRouter>
      <Navbar />
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
      <Footer />
{/* 
      <Routes>
        <Route path="/createAccount" element={<CreateAccount />} />
      </Routes> */}
    </BrowserRouter>
  );
}

export default App;
