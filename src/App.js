// src/App.js
import React, { useState, useEffect } from "react";
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
import LoginPage from "./components/loginpage";
import ProfilePage from "./components/profile";
import AddProduct from "./components/addProduct";
import CartPage from "./components/cartPage";

// ✅ import CartProvider ให้ตรง path
import { CartProvider } from "./components/cartContact";
function App() {
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <CartProvider>
        {/* Navbar ควรอยู่ข้างนอก container scroll */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999 }}>
          <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />
        </div>
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Promotion />
                  <TipsSection />
                  <MenuList setCategory={setCategory} />
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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkStatus" element={<CheckStatus />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} handleLogout={handleLogout} />} />
            <Route path="/addproduct" element={<AddProduct setUser={setUser} />} />
          </Routes>
        </div>

        <Footer />
      </CartProvider>
    </BrowserRouter>

  );
}

export default App;
