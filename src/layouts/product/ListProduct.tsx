import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import BookProps from "./components/BookProps";
import { findBook, getAllBook } from "../../api/BookAPI";
import { Pagination } from "../utils/Pagination";
import useScrollToTop from "../../hooks/ScrollToTop";
import { CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-solid-svg-icons";

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

  useScrollToTop();
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
      <div className="text-center mt-5">
        <CircularProgress color="inherit" />
      </div>
    );
  }


  if (noticeError) {
    return <div className="alert alert-danger text-center" role="alert">{noticeError}</div>;
  }

  if(bookList.length===0){
    return (
      <div className="container">
        <div className="text-center">
            <h1>Hiện không tìm thấy sách theo yêu cầu!</h1>
            <h2>
                <FontAwesomeIcon icon={faFaceSadCry}></FontAwesomeIcon>
            </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mt-4">
        {bookList.map((book) => (
          <div key={book.bookId} className="col-md-3 mb-4">
            <BookProps book={book} />
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} pagination={pagination}/>
      </div>
    </div>
  );
};

export default ListProduct;
