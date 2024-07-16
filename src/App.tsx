/* eslint-disable react/jsx-pascal-case */
import React, {  useState } from "react";
import "./App.css";
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import About from "./layouts/about/About";
import ProductDetail from "./layouts/product/ProductDetail";
import ResendActivationCode from "./user/account/ResendActivationCode";
import Login from "./user/Login";
import Test from "./user/Test";
import UserInformation from "./user/UserInformation";
import { AuthProvider } from "./layouts/utils/AuthContext";
import DeleteBook_Admin from "./admin/book/DeleteBook";
import RegisterUser from "./user/account/RegisterUser";
import ActivatedAccount from "./user/account/ActivatedAccount";
import ChangeEmail from "./user/email/ChangeEmail";
import ConfirmChangeEmail from "./user/email/ConfirmChangeEmail";
import ForgotPassword from "./user/password/ForgotPassword";
import ConfirmForgotPassword from "./user/password/ConfirmForgotPassword";
import GetAllUser_Admin from "./admin/user/GetAllUser";
import BookForm_Admin from "./admin/book/BookForm";
import EditBook_Admin from "./admin/book/EditBook";
import DeleteUser_Admin from "./admin/user/DeleteUser";
import ShowWishListByUser from "./user/wishList/ShowWishListByUser";
import DeleteWishList from "./user/wishList/DeleteWishList";
import { Error403Page } from "./layouts/page/403Page";
import { Error404Page } from "./layouts/page/404Page";
import EditWishList from "./user/wishList/EditWishList";
import DeleteBookOfWishList from "./user/wishList/DeleteBookOfWishList";
import DeleteCategory_Admin from "./admin/category/DeleteCategory";
import EditCategory_Admin from "./admin/category/EditCategory";
import DeleteBookOfCategory_Admin from "./admin/category/DeleteBookOfCategory";
import ShowAllCategory_Admin from "./admin/category/ShowAllCategory";
import ShowCart from "./user/cartItem/ShowCartItemByUser";
import DeleteBookOfCart from "./user/cartItem/DeleteCartItems";
import AddCartItem from "./user/cartItem/AddCartItem";

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
              <Route path="/error-403" element={<Error403Page/>} />
              <Route path="/error-404" element={<Error404Page/>} />
              <Route path="/user/info/:username" element={<UserInformation/>} />
              <Route path="/user/changeEmail" element={<ChangeEmail/>} />
              <Route path="/user/confirmChangeEmail/:email/:emailCode/:newEmail" element={<ConfirmChangeEmail/>}/>
              <Route path="/user/forgotPassword" element={<ForgotPassword/>}/>
              <Route path="/user/confirmForgotPassword/:username/:forgotPasswordCode" element={<ConfirmForgotPassword/>}/>
              <Route path="/admin/editBook/:bookId" element={<EditBook_Admin/>}/>
              <Route path="/admin/deleteBook/:bookId" element={<DeleteBook_Admin/>}/>
              <Route path="/admin/getAllUsers/" element={<GetAllUser_Admin/>}/>
              <Route path="/user/deleteUser/:username" element={<DeleteUser_Admin/>}/>
              <Route path="/user/showWishList/:userId" element={<ShowWishListByUser/>}/>
              <Route path="/wishList/deleteWishList/:wishListId/:userId" element={<DeleteWishList/>}/>
              <Route path="/wishList/editWishList/:wishListId" element={<EditWishList/>}/>
              <Route path="/wishList/deleteBookOfWishList/:bookId/:wishListIdNumber" element={<DeleteBookOfWishList/>}/>
              <Route path="/category/showAllCategory" element={<ShowAllCategory_Admin/>}/>
              <Route path="/category/editCategory/:categoryId" element={<EditCategory_Admin/>}/>
              <Route path="/category/deleteCategory/:categoryId" element={<DeleteCategory_Admin/>}/>
              <Route path="/category/deleteBookOfCategory/:categoryId/:bookId" element={<DeleteBookOfCategory_Admin/>}/>
              <Route path="/user/showCart/:userId" element={<ShowCart/>}></Route>
              <Route path="/cart/deleteCartItem/:cartItemId/:userId" element={<DeleteBookOfCart/>}></Route>
              <Route path="/cart/addCartItem/:bookId/:userId" element={<AddCartItem/>}></Route>
            </Routes>
          <Footer/>
          </AuthProvider>

        </BrowserRouter>
  );
}

export default App;
