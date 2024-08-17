/* eslint-disable react/jsx-pascal-case */
import React, {  useState } from "react";
import "./App.css";
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import { BrowserRouter, Route, Routes, useLocation, } from "react-router-dom";
import About from "./layouts/about/About";
import ProductDetail from "./layouts/product/ProductDetail";
import ResendActivationCode from "./user/account/ResendActivationCode";
import Login from "./user/Login";
import Test from "./user/Test";
import UserInformation from "./user/UserInformation";
import RegisterUser from "./user/account/RegisterUser";
import ActivatedAccount from "./user/account/ActivatedAccount";
import ChangeEmail from "./user/email/ChangeEmail";
import ConfirmChangeEmail from "./user/email/ConfirmChangeEmail";
import ForgotPassword from "./user/password/ForgotPassword";
import ConfirmForgotPassword from "./user/password/ConfirmForgotPassword";
import GetAllUser_Admin from "./admin/user/GetAllUser";
import BookForm_Admin from "./admin/book/AddBook";
import EditBook_Admin from "./admin/book/EditBook";
import ShowWishListByUser from "./user/wishList/ShowWishListByUser";
import DeleteWishList from "./user/wishList/DeleteWishList";
import { Error403Page } from "./layouts/page/403Page";
import { Error404Page } from "./layouts/page/404Page";
import EditWishList from "./user/wishList/EditWishList";
import DeleteBookOfWishList from "./user/wishList/DeleteBookOfWishList";
import EditCategory_Admin from "./admin/category/EditCategory";
import ShowAllCategory_Admin from "./admin/category/CategoryManagement";
import ShowCart from "./user/cartItem/ShowCartItemByUser";
import AddVoucher_Admin from "./admin/voucher/AddVoucher";
import EditVoucherAdmin from "./admin/voucher/EditVoucher";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShowAllVoucher_Admin from "./admin/voucher/ShowAllVoucher";
import ShowVoucherUser from "./user/userVoucher/ShowVoucherUser";
import GiftVouchersToUsers_Admin from "./admin/voucher/GiftVouchersToUsers";
import AddVouchersToVoucherAvailable_Admin from "./admin/voucher/AddVouchersToVoucherAvailable";
import ListVoucher from "./layouts/voucher/ListVoucher.tsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import HandleCreateOrder from "./user/order/CreateOrder";
import ShowOrder from "./user/order/ShowOrder";
import OrderManagement_Admin from "./admin/order/OrderManagement";
import ViewPurchasedOrder from "./user/order/ViewPurchasedOrder";
import CheckoutStatus from "./layouts/page/CheckoutStatus";
import OrderSummary from "./user/order/OrderSummary";
import { SlideBar } from "./admin/components/SlideBar";
import DashboardPage_Admin from "./admin/components/Dashboard";
import { ConfirmProvider } from "material-ui-confirm";
import CategoryCategoryManagementPage from "./admin/category/CategoryManagement";
import CategoryManagementPage from "./admin/category/CategoryManagement";

const MyRoutes = () =>{
  const [bookNameFind, setBookNameFind] = useState('');

  // Xử lý ẩn hiện navbar và footer
  const location = useLocation();

  // Kiểm tra xem đường dẫn hiện tại có bắt đầu bằng /admin k
  const isAdminPath = location.pathname.startsWith("/admin")
  return(
        <AuthProvider>
        <CartProvider>
          <ConfirmProvider>
            {/* Customer */}
            {!isAdminPath && <Navbar setBookNameFind={setBookNameFind}/>}
                  <Routes>
                  <Route path="/" element={<HomePage  bookNameFind={bookNameFind} />} />
                  <Route path="/:categoryId" element={<HomePage  bookNameFind={bookNameFind} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/books/:bookId" element={<ProductDetail/>} />
                  <Route path="/register" element={<RegisterUser />} />
                  <Route path="/activatedAccount/:email/:activationCode" element={<ActivatedAccount/>} />
                  <Route path="/resendActivationCode/:email" element={<ResendActivationCode/>} />
                  <Route path="/login" element={ <Login/>}  />
                  <Route path="/error-403" element={<Error403Page/>} />
                  <Route path="/error-404" element={<Error404Page/>} />
                  <Route path="/user/info/:username" element={<UserInformation/>} />
                  <Route path="/user/changeEmail" element={<ChangeEmail/>} />
                  <Route path="/user/confirmChangeEmail/:email/:emailCode/:newEmail" element={<ConfirmChangeEmail/>}/>
                  <Route path="/user/forgotPassword" element={<ForgotPassword/>}/>
                  <Route path="/user/confirmForgotPassword/:username/:forgotPasswordCode" element={<ConfirmForgotPassword/>}/>
                  <Route path="/user/showWishList/:userId" element={<ShowWishListByUser/>}/>
                  <Route path="/wishList/deleteWishList/:wishListId/:userId" element={<DeleteWishList/>}/>
                  <Route path="/wishList/editWishList/:wishListId" element={<EditWishList/>}/>
                  <Route path="/wishList/deleteBookOfWishList/:bookId/:wishListIdNumber" element={<DeleteBookOfWishList/>}/>
                  <Route path="/user/showCart" element={<ShowCart/>}></Route>
                  <Route path="/order/createOrder" element={<OrderSummary/>}></Route>
                  <Route path="/order/handleCreateOrder" element={<HandleCreateOrder/>}></Route>
                  <Route path="/user/showOrder" element={<ShowOrder/>}></Route>
                  <Route path="/vouchers" element={<ListVoucher/>}></Route>
                  <Route path="/user/showVoucherUser" element={<ShowVoucherUser/>}></Route>
                  <Route path="/order/purchase/:orderId" element={<ViewPurchasedOrder/>}></Route>
                  
                    {!isAdminPath && (
                      <Route path='/error-404' element={<Error404Page />} />
                    )}
              </Routes>
                  {!isAdminPath && <Footer />}


            
        {/* Admin */}
        {
                isAdminPath &&
                <div className='row overflow-hidden w-100'>
                    <div className='col-2 col-md-3 col-lg-2'>
                      <SlideBar />
                    </div>
                      <div className='col-10 col-md-9 col-lg-10'>
                    <Routes>
                        <Route path='/admin' element={<DashboardPage_Admin />} />
                        <Route
                          path='/admin/dashboard'
                          element={<DashboardPage_Admin />}
                        />
                        <Route path="/user/test" element={<Test/>} />
                        <Route path="/admin/book/addBook" element={<BookForm_Admin/>} />
                        <Route path="/admin/book/editBook/:bookId" element={<EditBook_Admin/>}/>
                        {/* <Route path="/books/deleteBook/:bookId" element={<DeleteBook_Admin/>}/> */}
                        <Route path="/admin/user/" element={<GetAllUser_Admin/>}/>
                        {/* <Route path="/user/deleteUser/:username" element={<DeleteUser_Admin/>}/> */}

                        <Route path="/admin/categoryManagement" element={<CategoryManagementPage/>}/>
                        <Route path="/admin/category/editCategory/:categoryId" element={<EditCategory_Admin/>}/>
                        {/* <Route path="/category/deleteCategory/:categoryId" element={<DeleteCategory_Admin/>}/> */}
                        {/* <Route path="/category/deleteBookOfCategory/:categoryId/:bookId" element={<DeleteBookOfCategory_Admin/>}/> */}


                        <Route path="/admin/voucher/addVoucher" element={<AddVoucher_Admin/>}></Route>
                        <Route path="/voucher/showAllVoucherAdmin" element={<ShowAllVoucher_Admin/>}></Route>
                        {/* <Route path="/voucher/deleteVoucher/:voucherId" element={<DeleteVoucher_Admin/>}></Route> */}
                        <Route path="/voucher/editVoucher/:voucherId" element={<EditVoucherAdmin/>}></Route>
                        <Route path="/vouchers/GiftVouchersToUsers" element={<GiftVouchersToUsers_Admin/>}></Route>
                        {/* <Route path="/vouchers/deleteAllVouchersSelected" element={<DeleteAllVouchersSelected_Admin/>}></Route> */}
                        <Route path="/vouchers/addVouchersToVoucherAvailable" element={<AddVouchersToVoucherAvailable_Admin/>}></Route>


                        <Route path="/admin/order" element={<OrderManagement_Admin/>}></Route>

                      
                        <Route path="/admin/order/purchase" element={<ViewPurchasedOrder/>}></Route>
                        
                        <Route
                        path='/check-out/status'
                        element={<CheckoutStatus />}
                      />
                    </Routes>
                    </div>
                  </div>
            }
          <ToastContainer
            position='bottom-center'
            autoClose={3000}
            pauseOnFocusLoss={false}
          />
          </ConfirmProvider>
      </CartProvider>
      </AuthProvider>

  )
}
function App() {
  
  return (
      <BrowserRouter>
          <MyRoutes/>
        </BrowserRouter>
  );
}

export default App;
