import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import BookProps from "./components/BookProps";
import { findBook, getAllBook } from "../../api/BookAPI";
import { Pagination } from "../utils/Pagination";

interface ListProductProps{
  bookNameFind : string;
  categoryId : number;
}

function ListProduct({bookNameFind, categoryId} : ListProductProps){
  const [bookList, setBookList] = useState<BookModel[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [noticeError, setNoticeError] = useState(null);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0);

  useEffect(() => {
    if(bookNameFind === '' && categoryId === 0 ){
      getAllBook(currentPage-1)
        .then((result) => {
          setTotalPages(result.totalPages);
          setBookList(result.resultBooks);
          setLoadingData(false);
        })
        .catch((error) => {
          setLoadingData(false);
          setNoticeError(error.message);
        });
  }else{
      findBook(bookNameFind,categoryId)
      .then((result) => {
        setTotalPages(result.totalPages);
        setBookList(result.resultBooks);
        setLoadingData(false);
      })
      .catch((error) => {
        setLoadingData(false);
        setNoticeError(error.message);
      });
  }
  
  },[currentPage,bookNameFind,categoryId] 
  );

  const pagination = (pageCurrent:number)=> {
    setCurrentPage(pageCurrent)
  }

  if (loadingData) {
    return (
      <div>
        <h1>Đang tải dữ liệu</h1>
      </div>
    );
  }

  if (noticeError) {
    return (
      <div>
        <h1>Gặp lỗi: {noticeError}</h1>
      </div>
    );
  }

  if(bookList.length===0){
    return (
      <div className="container">
        <div className="d-flex align-items-center justify-content-center ">
            <h1>Hiện không tìm thấy sách theo yêu cầu!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mt-4">
          {bookList.map((book) => (
            <BookProps key={book.bookId} book={book} />
          ))}
      </div>
      <div className="row mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} pagination={pagination}/>
      </div>
    </div>
  );
};

export default ListProduct;
