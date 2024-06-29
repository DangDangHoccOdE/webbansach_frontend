/* eslint-disable react/jsx-pascal-case */
import React, {  useState } from "react";
import "./App.css";
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import About from "./layouts/about/About";
import RegisterUser from "./user/RegisterUser";
import ProductDetail from "./layouts/product/ProductDetail";
import ResendActivationCode from "./user/ResendActivationCode";
import ActivatedAccount from "./user/ActivatedAccount";
import Login from "./user/Login";
import Test from "./user/Test";
import BookForm_Admin from "./admin/BookForm";
import Error_403 from "./layouts/utils/Error_403";
import UserInformation from "./user/UserInformation";
import { AuthProvider } from "./layouts/utils/AuthContext";
import ChangeEmail from "./user/ChangeEmail";
import ConfirmChangeEmail from "./user/ConfirmChangeEmail";

function App() {
  const [bookNameFind, setBookNameFind] = useState('');
  
  return (
      <BrowserRouter>
          <AuthProvider>
          <Navbar setBookNameFind={setBookNameFind}/>
          <Routes>
              <Route path="/" element={<HomePage  bookNameFind={bookNameFind} />} />
              <Route path="/:categoryId" element={<HomePage  bookNameFind={bookNameFind} />} />
              <Route path="/about" element={<About />} />
              <Route path="/books/:bookId" element={<ProductDetail/>} />
              <Route path="/register" element={<RegisterUser />} />
              <Route path="/activatedAccount/:email/:activationCode" element={<ActivatedAccount/>} />
              <Route path="/resendActivationCode/:email" element={<ResendActivationCode/>} />
              <Route path="/login" element={ <Login/>}  />
              <Route path="/user/test" element={<Test/>} />
              <Route path="/admin/addBook" element={<BookForm_Admin/>} />
              <Route path="/error-403" element={<Error_403/>} />
              <Route path="/user/info" element={<UserInformation/>} />
              <Route path="/user/changeEmail" element={<ChangeEmail/>} />
              <Route path="/user/confirmChangeEmail/:email/:emailCode/:newEmail" element={<ConfirmChangeEmail/>}/>
          </Routes>
          <Footer/>
          </AuthProvider>

        </BrowserRouter>
  );
}

export default App;
