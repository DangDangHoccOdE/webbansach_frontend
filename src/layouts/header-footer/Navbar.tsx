/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {  useState , useEffect, useContext} from "react";
import {  Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUsernameByToken, isToken, logout } from "../utils/JwtService";
import { getUserByCondition } from "../../api/UserAPI";
import UserModel from "../../models/UserModel";
import { useAuth } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { Avatar, Button } from "@mui/material";
import { HideNavbarEnpoint } from "../utils/HideNavbar";

  const Navbar: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [user,setUser] = useState<UserModel|null>(null); 
  const navigator = useNavigate();
  const {setLoggedIn} = useAuth();
  const {itemCounter} = useContext(CartContext);

   
  useEffect(() => {
    const getUser = async () =>{ // gọi api lấy user
        const username = getUsernameByToken();
        if(username!==undefined){
          try{
              const result = await getUserByCondition(username);
              setUser(result);
          }catch(error){
            setError("Lỗi khi gọi api user!");
            console.error(error)
          }          
      } 
    }
    getUser();

  },[navigator, setLoggedIn]);
  
 // Thực hiện ẩn Navbar
 const location = useLocation();

 const pathHideNavbar = HideNavbarEnpoint;
 if(pathHideNavbar.includes(location.pathname) || location.pathname.startsWith("/user/confirmForgotPassword") || location.pathname.startsWith("/activatedAccount")) {
   return null;
 }


  if(error!==null){
    return(
      <div>
        <h1>{error}</h1>
      </div>
    )
  }

  const handleLogout=() =>{
      logout();
      setLoggedIn(false);
      navigator("/login")
  }


    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
        <Link to='/'>						
							<img
								src={"./../../../logo.jpg"}
								width='100'
								alt='MDB Logo'
								loading='lazy'
							/>
            </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
  
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="/">Trang chủ</NavLink>
              </li>
             
              <li className='nav-item'>
							<Link className='nav-link' to={"/policy"}>
								Chính sách
							</Link>
						</li>
            <li>
            <Link className='nav-link' to={"/about"}>
								Giới thiệu
							</Link>
						</li>
            </ul>
          </div>
  
          {/* Biểu tượng giỏ hàng */}
          <ul className="navbar-nav me-1">
            <li className="nav-item">
                <Link to={`/user/showCart/${user?.userId}`} style={{textDecoration:"none",color:"green",  marginLeft:"4px"}}>
                    <i className="fas fa-shopping-cart"></i> 
                    <span className="badge bg-danger rounded-pill">{itemCounter}</span>
                </Link>
            </li>
          </ul>

          {/* { Biểu tượng đăng nhập */}
          {
            isToken() ? 
              <ul className="navbar-nav me-1">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown3" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {user?.avatar === null ? (
                      <i className="fas fa-user"></i>
                    ) : (
                      <Avatar alt={user?.firstName?.toUpperCase()} src={user?.avatar} sx={{ width: 30, height: 30 }} />
                    )}
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="dropdown-header">
                      <p className="mb-0">Chào, {user?.firstName}</p>
                    </div>
                    <Link className="dropdown-item" to={`/user/info/${user?.userName}`}>
                      <i className="fas fa-user-circle me-2"></i>
                      Xem thông tin
                    </Link>
                    <Link className="dropdown-item" to={`/user/showWishList/${user?.userId}`}>
                      <i className="fas fa-heart me-2"></i>
                      Danh sách yêu thích
                    </Link>
                    <Link className="dropdown-item" to={`/user/showVoucherUser/${user?.userId}`}>
                      <i className="fas fa-ticket-alt me-2"></i>
                      Voucher của tôi
                    </Link>
                    <Link className="dropdown-item" to={`/user/showOrder`}>
                      <i className="fas fa-shopping-bag me-2"></i>
                      Đơn hàng
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Đăng xuất
                    </button>
                  </div>
                </li>
         </ul> :<Link to={"/login"}>
                     <Button>Đăng nhập</Button>
                  </Link>
          }
         
        </div>
      </nav>
    );
} 

export default Navbar;