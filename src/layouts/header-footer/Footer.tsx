import React from "react";
import { useLocation } from "react-router-dom";
import { HideNavbarEnpoint } from "../utils/HideNavbar";

function Footer() {
  const location = useLocation();
  const pathHideNavbar = HideNavbarEnpoint;
  
  if (pathHideNavbar.includes(location.pathname) || location.pathname.startsWith("/user/confirmForgotPassword")) {
    return null;
  }

  return (  
    <footer className='bg-secondary text-light py-2'>
  <div className='container'>
    <div className='row'>
      <div className='col-md-4 mb-1'>
        <h5 className='text-uppercase fs-6 mb-1'>Dịch vụ</h5>
        <ul className='list-unstyled mb-0'>
          <li><a href='#!' className='text-light text-decoration-none fs-6'>Điều khoản sử dụng</a></li>
          <li><a href='#!' className='text-light text-decoration-none fs-6'>Chính sách bảo mật</a></li>
          <li><a href='#!' className='text-light text-decoration-none fs-6'>Hệ thống trung tâm</a></li>
        </ul>
      </div>
      <div className='col-md-4 mb-1'>
        <h5 className='text-uppercase fs-6 mb-1'>Hỗ trợ</h5>
        <ul className='list-unstyled mb-0'>
          <li><a href='#!' className='text-light text-decoration-none fs-6'>Chính sách đổi trả</a></li>
          <li><a href='#!' className='text-light text-decoration-none fs-6'>Chính sách vận chuyển</a></li>
          <li><a href='#!' className='text-light text-decoration-none fs-6'>Chính sách khách sỉ</a></li>
        </ul>
      </div>
      <div className='col-md-4 mb-1'>
        <h5 className='text-uppercase fs-6 mb-1'>Tài khoản</h5>
        <ul className='list-unstyled mb-0'>
          <li><a href='/login' className='text-light text-decoration-none fs-6'>Đăng nhập/Đăng ký</a></li>
          <li><a href='#!' className='text-light text-decoration-none fs-6'>Chi tiết tài khoản</a></li>
          <li><a href='#!' className='text-light text-decoration-none fs-6'>Lịch sử mua hàng</a></li>
        </ul>
      </div>
    </div>
    <hr className='bg-light my-2' />
    <div className='row'>
      <div className='col-md-6 mb-1'>
        <small>© 2023 Copyright BookStore</small>
      </div>
      <div className='col-md-6 text-md-end'>
        <a href='#!' className='text-light me-1'><i className='fab fa-facebook-f fa-xs'></i></a>
        <a href='#!' className='text-light me-1'><i className='fab fa-twitter fa-xs'></i></a>
        <a href='#!' className='text-light me-1'><i className='fab fa-instagram fa-xs'></i></a>
        <a href='#!' className='text-light'><i className='fab fa-linkedin-in fa-xs'></i></a>
      </div>
    </div>
  </div>
</footer>

  );
}

export default Footer;
