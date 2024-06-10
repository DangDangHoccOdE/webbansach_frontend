/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ChangeEvent, useState ,KeyboardEvent, useEffect} from "react";
import { Link } from "react-router-dom";
import Category from "../../models/CategoryModel";
import { getAllCategory } from "../../api/CategoryAPI";

interface NavbarProps{
    setBookNameFind: (keyword:string)=> void
  }

function Navbar({setBookNameFind} : NavbarProps){

  const [temporaryKeyWord,setTemporaryKeyWord] = useState('');
  const [categoryList,setCategoryList] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    getAllCategory().then(
          result => {
            setCategoryList(result);
          })
          .catch(
            error => {setError(error.message)
              }
          )
  },[])

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
                <a className="nav-link active" aria-current="page" href="#">Trang chủ</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Thể loại sách
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                    {categoryList.map(item=> 
                        <li key={item.categoryId}><Link className="dropdown-item" to={`/${item.categoryId}`}>{item.categoryName}</Link></li>
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
            <button className="btn btn-outline-success" type="submit" onClick={handleSearch}>Search</button>
          </div>
  
          {/* Biểu tượng giỏ hàng */}
          <ul className="navbar-nav me-1">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-shopping-cart"></i>
              </a>
            </li>
          </ul>
  
          {/* Biểu tượng đăng nhập */}
          <ul className="navbar-nav me-1">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-user"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
}

export default Navbar;