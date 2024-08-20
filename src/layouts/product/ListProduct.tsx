import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import BookProps from "./components/BookProps";
import { getAllBook, searchBook } from "../../api/BookAPI";
import { Pagination } from "../utils/Pagination";
import useScrollToTop from "../../hooks/ScrollToTop";
import {  Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-solid-svg-icons";

interface ListProductProps{
  bookNameFind? : string;
  categoryId? : number;
  filter?:number;
}

function ListProduct({bookNameFind, categoryId,filter} : ListProductProps){
  const [bookList, setBookList] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noticeError, setNoticeError] = useState(null);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0);

  useScrollToTop();
  useEffect(() => {
      // Mặc định sẽ gọi tất cả các sách
      if(bookNameFind === '' && categoryId===0 && filter===0){
          // currentPage - 1 vì trong endpoint trang đầu tiên se là 0
          getAllBook(currentPage-1)
              .then((response)=>{
                setBookList(response.resultBooks);
                setTotalPages(response.totalPages);
                setIsLoading(false)
              })
              .catch(error=>{
                console.error(error);
                setIsLoading(false);
                setNoticeError(error.message);
              })
      }else{
        const size:number=8;
        // Khi có sử dụng bộ lọc
        searchBook(bookNameFind,categoryId,filter,size,currentPage-1)
            .then((response)=>{
              setBookList(response.resultBooks);
              setTotalPages(response.totalPages);
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              setNoticeError(error.message);
            });
      }
  
  },[currentPage, bookNameFind, categoryId, filter] 
  );

  const pagination = (pageCurrent:number)=> {
    setCurrentPage(pageCurrent)
  }

  if (isLoading) {
    return (
      <div className='container-book container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
				</div>
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
