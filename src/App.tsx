/* eslint-disable react/jsx-pascal-case */
import "./App.css";
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import HomePage from "./layouts/homepage/HomePage";
import { BrowserRouter, Outlet, Route, Routes, useLocation, } from "react-router-dom";
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
import BookForm_Admin from "./admin/book/AddBook";
import EditBook_Admin from "./admin/book/EditBook";
import ShowWishListByUser from "./user/wishList/ShowWishListByUser";
import { Error403Page } from "./layouts/page/403Page";
import { Error404Page } from "./layouts/page/404Page";
import EditWishList from "./user/wishList/EditWishList";
import EditCategory_Admin from "./admin/category/EditCategory";
import ShowCart from "./user/cartItem/ShowCartItemByUser";
import AddVoucher_Admin from "./admin/voucher/AddVoucher";
import EditVoucherAdmin from "./admin/voucher/EditVoucher";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShowVoucherUser from "./user/userVoucher/ShowVoucherUser";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import ShowOrder from "./user/order/ShowOrder";
import OrderManagement_Admin from "./admin/order/OrderManagement";
import ViewPurchasedOrder from "./user/order/ViewPurchasedOrder";
import CheckoutStatus from "./layouts/page/CheckoutStatus";
import OrderSummary from "./user/order/OrderSummary";
import { SlideBar } from "./admin/components/SlideBar";
import DashboardPage_Admin from "./admin/components/Dashboard";
import { ConfirmProvider } from "material-ui-confirm";
import CategoryManagementPage from "./admin/category/CategoryManagement";
import UserManagementPage from "./admin/user/UserManagement";
import VoucherManagementPage from "./admin/voucher/VoucherManagement";
import ListVoucherToday from "./layouts/voucher/ListVoucherToday.tsx";
import CreateOrder from "./user/order/CreateOrder";
import BookManagementPage from "./admin/book/BookManagement";
import PolicyPage from "./layouts/page/PolicyPage";
import ShowCancellationDetails from "./user/order/ShowCancellationDetails";

const MyRoutes = () =>{
  // Xử lý ẩn hiện navbar và footer
  const location = useLocation();

  // Kiểm tra xem đường dẫn hiện tại có bắt đầu bằng /admin k
  const isAdminPath = location.pathname.startsWith("/admin")
  return(
        <AuthProvider>
        <CartProvider>
          <ConfirmProvider>
            {/* Customer */}
           {!isAdminPath &&  <div id="root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {!isAdminPath && <Navbar />} {/* Hiển thị Navbar nếu không phải đường dẫn admin */}
                
                <div className="content" style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/books/:bookId" element={<ProductDetail />} />
                    <Route path="/register" element={<RegisterUser />} />
                    <Route path="/user/confirmForgotPassword/:username/:forgotPasswordCode" element={<ConfirmForgotPassword />} />
                    <Route path="/activatedAccount/:email/:activationCode" element={<ActivatedAccount />} />
                    <Route path="/resendActivationCode/:email" element={<ResendActivationCode />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/error-403" element={<Error403Page />} />
                    <Route path="/error-404" element={<Error404Page />} />
                    <Route path="/user/forgotPassword" element={<ForgotPassword />} />
                    <Route path="/vouchers" element={<ListVoucherToday />} />
                    <Route path="/policy" element={<PolicyPage />} />

                    <Route element={<ProtectedRoute><Outlet/></ProtectedRoute>}>  {/* Các endpoint yêu cầu xác thực , ProtectedRoute có chức năng lưu đường dẫn trước đó vào local Storage*/}
                          <Route path="/user/info/:username" element={<UserInformation />}/>
                          <Route path="/user/changeEmail" element={<ChangeEmail />}/>  
                          <Route path="/user/confirmChangeEmail/:email/:emailCode/:newEmail" element={<ConfirmChangeEmail />}/>  
                          <Route path="/user/showWishList/:userId" element={ <ShowWishListByUser />}/>  
                          <Route path="/wishList/editWishList/:wishListId" element={<EditWishList />}/>  
                          <Route path="/user/showCart" element= {<ShowCart />}/>  
                          <Route path="/order/orderSummary" element={ <OrderSummary />}/>  
                          <Route path="/order/createOrder" element={ <CreateOrder />}/>  
                          <Route path="/user/showVoucherUser" element={ <ShowVoucherUser /> }/>  
                          <Route path="/order/purchase/:orderId" element={ <ViewPurchasedOrder />}/>  
                          <Route path="/check-out/status" element={ <CheckoutStatus />}/>  
                          <Route path="/user/showOrder" element={<ShowOrder />} />
                          <Route path="/user/purchase/cancellation/:orderId" element={<ShowCancellationDetails />} />
                    </Route>
                    {/* Các route khác */}
                  </Routes>
                </div>
                
                {!isAdminPath && <Footer />} {/* Hiển thị Footer nếu không phải đường dẫn admin */}
      </div>}
            
        {/* Admin */}
        {
                isAdminPath &&
                <div className='row overflow-hidden w-100'>
                    <div className='col-2 col-md-3 col-lg-2'>
                      <SlideBar />
                    </div>
                      <div className='col-10 col-md-9 col-lg-10'>
                    <Routes>
                         <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>   {/* Các endpoint yêu cầu xác thực , ProtectedRoute có chức năng lưu đường dẫn trước đó vào local Storage */}
                            <Route path='/admin' element={<DashboardPage_Admin />} />
                            <Route path="/admin/dashboard" element={<DashboardPage_Admin />} />
                            <Route path="/user/test" element={<Test/>} />
                            <Route path="/admin/book/addBook" element={<BookForm_Admin/>} />
                            <Route path="/admin/book/editBook/:bookId" element={<EditBook_Admin/>}/>
                            <Route path="/admin/userManagement/" element={<UserManagementPage/>}/>
                            <Route path="/admin/categoryManagement" element={<CategoryManagementPage/>}/>
                            <Route path="/admin/category/editCategory/:categoryId" element={<EditCategory_Admin/>}/>
                            <Route path="/admin/voucherManagement/addVoucher" element={<AddVoucher_Admin/>}></Route>
                            <Route path="/admin/voucherManagement" element={<VoucherManagementPage/>}></Route>
                            <Route path="/admin/voucher/editVoucher/:voucherId" element={<EditVoucherAdmin/>}></Route>
                            <Route path="/admin/orderManagement" element={<OrderManagement_Admin/>}></Route>
                            <Route path="/admin/bookManagement" element={<BookManagementPage/>}></Route>
                            <Route path="/admin/order/purchase" element={<ViewPurchasedOrder/>}></Route>
                            <Route
                            path='/check-out/status'
                            element={<CheckoutStatus />}
                          />
                      </Route>
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
