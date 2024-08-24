import { useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import RequireAdmin from "../RequireAdmin"
import BookModel from "../../models/BookModel";
import { CircularProgress } from "@mui/material";
import { getAllBook, searchBook } from "../../api/BookAPI";
import { Link } from "react-router-dom";
import { Pagination } from "../../layouts/utils/Pagination";
import { confirm } from "material-ui-confirm";
import { toast } from "react-toastify";
import fetchWithAuth from "../../layouts/utils/AuthService";
import SoldQuantityFormat from "../../layouts/utils/SoldQuantityFormat";
import NumberFormat from "../../layouts/utils/NumberFormat";
import ToolFilter from "../../layouts/product/components/ToolFilter";
import renderRating from "../../layouts/utils/StarRate";

const BookManagement:React.FC=()=>{
    useScrollToTop();
    const [books,setBooks] = useState<BookModel[]>([])
    const [isLoading,setIsLoading] = useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    const [temporaryWordFind,setTemporaryWordFind] = useState("");
    const [isUpdate,setIsUpdate] = useState(false)
	const [idCate, setIdCate] = useState(0); // Thể loại muốn hiển thị
	const [filter, setFilter] = useState(0); // Lọc theo chế độ gì (tên từ A - Z, Z - A, ...)

    useEffect(()=>{
        setIsLoading(true)
            if(temporaryWordFind === '' && idCate===0 && filter===0){
                // currentPage - 1 vì trong endpoint trang đầu tiên se là 0
                getAllBook(currentPage-1)
                    .then((response)=>{
                      setBooks(response.resultBooks);
                      setTotalPages(response.totalPages);
                    })
                    .catch(error=>{
                      console.error(error);
                    })
                    .finally(
                        ()=>setIsLoading(false)
                    )

                    console.log("óadklas")
            }else{
              const size:number=8;
              // Khi có sử dụng bộ lọc
              console.log("Filter:",filter)
              searchBook(temporaryWordFind,idCate,filter,size,currentPage-1)
                  .then((response)=>{
                    setBooks(response.resultBooks);
                    setTotalPages(response.totalPages);
                  })
                  .catch((error) => {
                    console.error(error)
                  }) 
                   .finally(
                    ()=>setIsLoading(false)
                )
            }    console.log("ok",temporaryWordFind)
    },[currentPage, filter, idCate, temporaryWordFind,isUpdate])

    const pagination = (pageCurrent:number)=>{ // phân trang
        setCurrentPage(pageCurrent);
    }

    const handleChangeWordFind=(keySearch:string)=>{ // Theo dõi từng từ tìm kiếm
        console.log("Value",keySearch)
        setTemporaryWordFind(keySearch);
    }

    const handleDelete=(bookId:number)=>{   // thực hiện xóa sách
        confirm({
            title:'Xóa sách',
            description:`Bạn có chắc muốn xóa sách này?`,
            confirmationText:['Xóa'],
            cancellationText:['Hủy'],
        }).then(()=>{
            toast.promise(
                fetchWithAuth(`http://localhost:8080/books/deleteBook/${bookId}`,{
                    method:"DELETE",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    }
                }
            ).then((response)=>{
                if(response.ok){
                    toast.success("Đã xóa sách thành công");
                    setIsUpdate(prev=>!prev); // Biến này để cập nhật lại giao diện khi xóa
                }else{
                    toast.error("Lỗi khi xóa sách!");
                }
            }).catch(error=>{
                toast.error("Lỗi khi xóa sách!");
                console.error(error);
            }),
            {pending:"Đang trong quá trình xử lý..."}
        )})
        .catch(()=>{});
    }


    return(
        <div className="container-fluid mt-5">
        <h1 className="mb-4 text-center">Thông tin sách</h1>
        
        {isLoading ? (
            <div className="text-center mt-5">
            <CircularProgress color="inherit" />
            </div>
        ) : (
            <>
                <div>
                    <ToolFilter keyBookFind={temporaryWordFind}
                            filter={filter}
                            idCate={idCate}
                            setKeySearch={handleChangeWordFind}
                            setFilter={setFilter}
                            setIdCate={setIdCate}
                            />

                <Link to={`/admin/book/addBook`} className="btn btn-sm btn-outline-secondary mt-2 mb-3 ms-2">
                              <i className="fa fa-add me-1"></i>Thêm
                            </Link>

                </div>

          
                {books.length===0  ? (
                <div className="alert alert-danger text-center" role="alert">
                    Hiện tại danh sách sách đang rỗng
                </div>
                          ) : (
                <div className="table-responsive">
                <table className="table table-striped table-hover">
                <thead className="table-light">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tên sách</th>
                    <th scope="col">Ảnh</th>
                    <th scope="col">Tác giả</th>
                    <th scope="col">Số sao</th>
                    <th scope="col">Số lượng kho</th>
                    <th scope="col">Số lượng đã bán</th>
                    <th scope="col">Giá bán</th>
                    <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    { books.length>0 && books?.map((book, index) => (
                    <tr key={index}>
                        <th scope="row">{(currentPage-1)*8 +index + 1}</th>
                        <td>
                        <Link to={`/books/${book.bookId}`} style={{textDecoration:"none"}}>
                            {book.bookName}
                        </Link></td>
                        <td>
                            <img src={book.thumbnail} alt="*" height="50px" width="50px"/></td>
                        <td>{book.author}</td>
                        <td>{renderRating(book.averageRate)}</td>
                        <td>{SoldQuantityFormat(book.quantity)}</td>
                        <td>{SoldQuantityFormat(book.soldQuantity)}</td>
                        <td>{NumberFormat(book.price)} đ</td>
                        <td>
                        <div className="btn-group" role="group">
                            <Link to={`/admin/book/editBook/${book.bookId}`} className="btn btn-sm btn-outline-primary">
                            <i className="fa fa-edit me-1"></i>Sửa
                            </Link>
                   
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book.bookId)}>
                                <i className="fas fa-trash me-1"></i>Xóa
                            </button>
                        </div>
                        </td>
                    </tr>
                    
                    ))
                }
                
                </tbody>
                </table>
  
                <div className="d-flex align-item-center justify-content-center">
                            <Pagination currentPage={currentPage} totalPages={totalPages} pagination={pagination}></Pagination>
                </div>  
            </div>
            )}
            </>
            )}
        
        </div>
)}

const BookManagementPage = RequireAdmin(BookManagement);
export default BookManagementPage;