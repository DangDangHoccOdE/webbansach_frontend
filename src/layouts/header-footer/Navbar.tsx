/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ChangeEvent, useState ,KeyboardEvent, useEffect, useContext} from "react";
import {  Link, NavLink, useNavigate } from "react-router-dom";
import { getAllCategory } from "../../api/CategoryAPI";
import CategoryModel from "../../models/CategoryModel";
import { Search } from "react-bootstrap-icons";
import { getUsernameByToken, isToken, logout } from "../utils/JwtService";
import { getUserByCondition } from "../../api/UserAPI";
import UserModel from "../../models/UserModel";
import { useAuth } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { Avatar } from "@mui/material";
interface NavbarProps{
    setBookNameFind: (keyword:string)=> void
  }

function Navbar({setBookNameFind} : NavbarProps){

  const [temporaryKeyWord,setTemporaryKeyWord] = useState('');
  const [categoryList,setCategoryList] = useState<CategoryModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user,setUser] = useState<UserModel|null>(null); 
  const navigator = useNavigate();
  const {setLoggedIn} = useAuth();
  const {itemCounter} = useContext(CartContext);
  
  useEffect(() => {
    const fetchCategories = async () => { // gọi api lấy thể loại
      try {
        const result = await getAllCategory(); 
        setCategoryList(result); 
      } catch (error) {
        setError("Lỗi khi gọi api danh sách thể loại"); 
      }
    };

    const getUser = async () =>{ // gọi api lấy user
        const username = getUsernameByToken();
        if(username!==undefined){
          try{
              const result = await getUserByCondition(username);
              setUser(result);
          }catch(error){
            setError("Lỗi khi gọi api user!");
          }          
      } 
    }
    getUser();
    fetchCategories(); 

  },[navigator, setLoggedIn]);


  if(error!==null){
    return(
      <div>
        <h1>{error}</h1>
      </div>
    )
  }
  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTemporaryKeyWord(e.target.value);
  }

  const handleSearch=()=>{
    setBookNameFind(temporaryKeyWord);
  }

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleLogout=() =>{
      logout();
      setLoggedIn(false);
      navigator("/login")
  }

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Bookstore</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
  
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="/">Trang chủ</NavLink>
              </li>
              <li className="nav-item dropdown">
                <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Thể loại sách
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                    {categoryList.map(item=> 
                        <li key={item.categoryId}><NavLink className="dropdown-item" to={`/${item.categoryId}`}>{item.categoryName}</NavLink></li>
                    )}
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Quy định bán hàng
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown2">
                  <li><a className="dropdown-item" href="#">Quy định 1</a></li>
                  <li><a className="dropdown-item" href="#">Quy định 2</a></li>
                  <li><a className="dropdown-item" href="#">Quy định 3</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Liên hệ</a>
              </li>
            </ul>
          </div>
  
          {/* Tìm kiếm */}
          <div className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" onChange={onSearchInputChange} value={temporaryKeyWord} onKeyPress={handleEnter}/>
            <button className="btn btn-outline-success" type="submit" onClick={handleSearch}>
                    <Search/>
            </button>
          </div>
  
          {/* Biểu tượng giỏ hàng */}
          <ul className="navbar-nav me-1">
            <li className="nav-item">
                <Link to={`/user/showCart`} style={{textDecoration:"none",color:"green",  marginLeft:"4px"}}>
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
               {  
                  user?.avatar===null?
                           <i className="fas fa-user"></i>
                           : <Avatar alt={user?.firstName?.toUpperCase()} src={user?.avatar}   sx={{ width: 30, height: 30 }} />
                  
              }</a>
                 <div className="dropdown-menu dropdown-menu-end">
                 <p className="dropdown-item">Chào, {user?.firstName}</p>
                 <Link className="dropdown-item" to={`/user/info/${user?.userName}`}>Xem thông tin</Link>
                 <Link className="dropdown-item" to={`/user/showWishList/${user?.userId}`}>Danh sách yêu thích</Link>
                 <Link className="dropdown-item" to={`/user/showVoucherUser`}>Voucher của tôi</Link>
                 <Link className="dropdown-item" to={`/user/showOrder`}>Đơn hàng</Link>
                   <div className="dropdown-divider"></div>
                   <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                 </div>
             </li>
         </ul> : <Link className="btn btn-warning" to={"/login"}>Đăng nhập</Link>
          }
         
        </div>
      </nav>
    );
} 

export default Navbar;