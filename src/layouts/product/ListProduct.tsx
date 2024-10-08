import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import BookProps from "./components/BookProps";
import { getAllBook, searchBook } from "../../api/BookAPI";
import { Pagination } from "../utils/Pagination";
import {  Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faSearch } from "@fortawesome/free-solid-svg-icons";
import ToolFilter from "./components/ToolFilter";

const ListProduct:React.FC=(props)=>{
  const [bookList, setBookList] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0);
  const [temporaryWordFind,setTemporaryWordFind] = useState("")
  const [idCate, setIdCate] = useState(0); // Thể loại muốn hiển thị
	const [filter, setFilter] = useState(0); // Lọc theo chế độ gì (tên từ A - Z, Z - A, ...)

  useEffect(() => {
    setIsLoading(true);
      // Mặc định sẽ gọi tất cả các sách
      if(temporaryWordFind === '' && filter===0 && idCate===0){
          // currentPage - 1 vì trong endpoint trang đầu tiên sẽ là 0
          getAllBook(currentPage-1)
              .then((response)=>{
                setBookList(response.resultBooks);
                setTotalPages(response.totalPages);
              })
              .catch(error=>{
                console.error(error);
              })
              .finally(
                ()=> setIsLoading(false)
              )
      }else{
        const size:number=8;
        // Khi có sử dụng bộ lọc
            searchBook(temporaryWordFind,idCate,filter,size,currentPage-1)
            .then((response)=>{
              setBookList(response.resultBooks);
              setTotalPages(response.totalPages);
            })
            .catch((error) => {
              console.error(error);
            }).finally(
              ()=> setIsLoading(false)
            )
      }
  },[ currentPage, filter, idCate, temporaryWordFind] 
  );

  const pagination = (pageCurrent:number)=> {
    setCurrentPage(pageCurrent)
  }

  const handleChangeWordFind=(keySearch:string)=>{ // Theo dõi từng từ tìm kiếm
    setTemporaryWordFind(keySearch);
}

  return (
    <div className="container">
      {
        isLoading ? 
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
			</div> : (
        <>
               <div>
                   <ToolFilter keyBookFind={temporaryWordFind}
                            filter={filter}
                            idCate={idCate}
                            setKeySearch={handleChangeWordFind}
                            setFilter={setFilter}
                            setIdCate={setIdCate}
                            />
               </div>

               {
                bookList.length === 0 ? (
                      <div className="text-center py-5">
                      <div className="mb-4">
                        <FontAwesomeIcon icon={faBookOpen} size="4x" color="#6c757d" />
                        <FontAwesomeIcon icon={faSearch} size="2x" color="#007bff" 
                          style={{ marginLeft: '-15px', marginBottom: '-15px' }} />
                      </div>
                      <h2 className="mb-3" style={{ color: '#343a40' }}>Oops! Không tìm thấy sách</h2>
                      <p className="text-muted mb-4">
                        Chúng tôi không thể tìm thấy cuốn sách bạn đang tìm kiếm.
                        <br />Hãy thử tìm kiếm với từ khóa khác hoặc duyệt qua danh mục của chúng tôi.
                      </p>
                      <button className="btn btn-primary me-2">
                        Quay lại trang chủ
                      </button>
                      <button className="btn btn-outline-secondary">
                        Xem danh mục sách
                      </button>
                    </div>

                 ) : (
                  <>
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
                </>
                 )
               }
        </>
      )
      }
    </div>
     )       
};

export default ListProduct;
