import React from "react";
import useScrollToTop from "../../../hooks/ScrollToTop";

function Banner() {
  useScrollToTop();
  return (
    <div className="p-2 mb-2 bg-dark">
      <div
        className="container-fluid py-5 text-white d-flex 
        justify-content-center align-items-center"
      >
        <div>
          <h3 className="display-5 fw-bold">
            Đọc sách chính là hộ chiếu <br /> cho vô số cuộc phiêu lưu
          </h3>
          <p className="">Mary Pope Osborne</p>
          <button className="btn btn-primary btn-lg text-white float-end">
            Khám phá sách tại TITV.vn
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
