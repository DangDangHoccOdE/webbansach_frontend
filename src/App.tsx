import React from "react";
import "./App.css";
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
function App() {
  return (
    
    <div className="App">
        <Navbar/>
         <HomePage/>
        <Footer/>
    </div>
  );
}

export default App;
