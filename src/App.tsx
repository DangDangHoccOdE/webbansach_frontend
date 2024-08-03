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
import AddVoucher_Admin from "./admin/voucher/AddVoucher";
import DeleteVoucher_Admin from "./admin/voucher/DeleteVoucher";
import EditVoucherAdmin from "./admin/voucher/EditVoucher";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShowAllVoucher_Admin from "./admin/voucher/ShowAllVoucher";
import ShowVoucherUser from "./user/userVoucher/ShowVoucherUser";
import GiftVouchersToUsers_Admin from "./admin/voucher/GiftVouchersToUsers";
import DeleteAllVouchersSelected_Admin from "./admin/voucher/DeleteAllVouchersSelected";
import AddVouchersToVoucherAvailable_Admin from "./admin/voucher/AddVouchersToVoucherAvailable";
import ListVoucher from "./layouts/voucher/ListVoucher.tsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import AddOrder from "./user/order/AddOrder";
import HandleCreateOrder from "./user/order/HandleCreateOrder";
import ShowOrder from "./user/order/ShowOrder";
function App() {
  const [bookNameFind, setBookNameFind] = useState('');
  
  return (
      <BrowserRouter>
          <AuthProvider>
            <CartProvider>
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
              <Route path="/books/addBook" element={<BookForm_Admin/>} />
              <Route path="/error-403" element={<Error403Page/>} />
              <Route path="/error-404" element={<Error404Page/>} />
              <Route path="/user/info/:username" element={<UserInformation/>} />
              <Route path="/user/changeEmail" element={<ChangeEmail/>} />
              <Route path="/user/confirmChangeEmail/:email/:emailCode/:newEmail" element={<ConfirmChangeEmail/>}/>
              <Route path="/user/forgotPassword" element={<ForgotPassword/>}/>
              <Route path="/user/confirmForgotPassword/:username/:forgotPasswordCode" element={<ConfirmForgotPassword/>}/>
              <Route path="/books/editBook/:bookId" element={<EditBook_Admin/>}/>
              <Route path="/books/deleteBook/:bookId" element={<DeleteBook_Admin/>}/>
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
              <Route path="/user/showCart" element={<ShowCart/>}></Route>
              <Route path="/order/createOrder" element={<AddOrder/>}></Route>
              <Route path="/order/handleCreateOrder" element={<HandleCreateOrder/>}></Route>
              <Route path="/user/showOrder" element={<ShowOrder/>}></Route>

              <Route path="/voucher/addVoucher" element={<AddVoucher_Admin/>}></Route>
              <Route path="/voucher/showAllVoucherAdmin" element={<ShowAllVoucher_Admin/>}></Route>
              <Route path="/voucher/deleteVoucher/:voucherId" element={<DeleteVoucher_Admin/>}></Route>
              <Route path="/voucher/editVoucher/:voucherId" element={<EditVoucherAdmin/>}></Route>
              <Route path="/vouchers/GiftVouchersToUsers" element={<GiftVouchersToUsers_Admin/>}></Route>
              <Route path="/vouchers/deleteAllVouchersSelected" element={<DeleteAllVouchersSelected_Admin/>}></Route>
              <Route path="/vouchers/addVouchersToVoucherAvailable" element={<AddVouchersToVoucherAvailable_Admin/>}></Route>

              <Route path="/vouchers" element={<ListVoucher/>}></Route>

              <Route path="/user/showVoucherUser" element={<ShowVoucherUser/>}></Route>

            </Routes>
          <Footer/>
          <ToastContainer/>
           </CartProvider>
          </AuthProvider>

        </BrowserRouter>
  );
}

export default App;
