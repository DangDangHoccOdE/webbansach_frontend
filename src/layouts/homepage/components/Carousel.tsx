import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { getThreeBooksLatest } from "../../../api/BookAPI";
import CarouselItem from "./CarouselItem";

const Carousel=()=> {
  const [loadingData, setLoadingData] = useState(true);
  const [noticeError, setNoticeError] = useState<string | null>(null);
  const [bookList, setBookList] = useState<BookModel[]>([]);

  useEffect(()=>{
      getThreeBooksLatest().then(
          result=>{
            setBookList(result.resultBooks);
            setLoadingData(false);
          }).catch(
            error=>{
              setLoadingData(false);
              setNoticeError(error.message);
            }
          )
  },[])
  
 
  if (loadingData) {
    return( <h1>Đang tải dữ liệu</h1>);
  }

  if (noticeError) {
    return <h1>Error: {noticeError}</h1>;
  }

  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide">
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="10000">
          <CarouselItem key={0} book={bookList[0]}/>
        </div>
        <div className="carousel-item" data-bs-interval="10000">
          <div className="row align-items-center">
          <CarouselItem key={1} book={bookList[1]}/>
          </div>
        </div>
        <div className="carousel-item" data-bs-interval="10000">
          <div className="row align-items-center">
          <CarouselItem key={2} book={bookList[2]}/>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
