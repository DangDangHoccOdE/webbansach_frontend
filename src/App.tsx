import React, { useState } from "react";
import "./App.css";
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./layouts/about/About";
import ProductDetail from "./layouts/product/ProductDetail";

function App() {
  const [bookNameFind, setBookNameFind] = useState('');

  return (
    <div className="App">
      <BrowserRouter>
          <Navbar setBookNameFind={setBookNameFind}/>
          <Routes>
              <Route path="/" element={<HomePage  bookNameFind={bookNameFind} />} />
              <Route path="/:categoryId" element={<HomePage  bookNameFind={bookNameFind} />} />
              <Route path="/about" element={<About />} />
              <Route path="/books/:bookId" element={<ProductDetail/>} />
          </Routes>
          <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;
