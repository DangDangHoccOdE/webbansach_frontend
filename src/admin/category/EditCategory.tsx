import { Link, useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import useScrollToTop from "../../hooks/ScrollToTop";
import { FormEvent, useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import {  getBookListByCategory } from "../../api/BookAPI";
import CategoryModel from "../../models/CategoryModel";
import { getCategoryById } from "../../api/CategoryAPI";
import renderRating from "../../layouts/utils/StarRate";
import NumberFormat from "../../layouts/utils/NumberFormat";
import ImageModel from "../../models/ImageModel";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { Pagination } from "../../layouts/utils/Pagination";
import { getAllIconImage } from "../../layouts/utils/ImageService";
import { Box, CircularProgress } from "@mui/material";
import { confirm } from "material-ui-confirm";
import { toast } from "react-toastify";

const EditCategory:React.FC=()=>{
    useScrollToTop();

    const {categoryId} = useParams();
    const [bookList,setBookList] = useState<BookModel[]>([])
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("")
    const [category,setCategory] = useState<CategoryModel|null>(null)
    const navigate = useNavigate();
    const [showForm,setShowForm] = useState(false)
    const [imageList,setImageList] = useState<ImageModel[]>([])
    const [newCategoryName,setNewCategoryName] = useState("")
    const [isError,setIsError] = useState(false);
    const [errorNewCategoryName,setErrorNewCategoryName] = useState("")
    const [isUpdate,setIsUpdate] = useState(false)

    const categoryIdNumber = parseInt(categoryId+"")
    useEffect(()=>{
        const getCategory=async()=>{ // goij api lấy thể loại từ id
                setIsLoading(true);
                try{
                    const data = await getCategoryById(categoryIdNumber);
                    if (data === null) {
                        navigate("/error-404");
                    }
                    
                    setCategory(data);
                }catch(error){
                    console.log("Không thể tải thể loại!");
                    navigate("/error-404");
                }finally{
                    setIsLoading(false);
                }
        }

        const getBookList = async()=>{  // gọi api lấy ra sách từ thể loại
            setIsLoading(true);
            try{
                const data = await getBookListByCategory(categoryIdNumber,currentPage-1);
                if(data.resultBooks.length===0){
                    setNotice("Danh sách đang rỗng!");
                }
                setBookList(data.resultBooks);
                setTotalPages(data.totalPages);
            }catch(error){
                console.log({error})
                setNotice("Lỗi, không thể tải sách");
            }finally{
                setIsLoading(false);
            }
        }

        getCategory();
        getBookList();
    },[categoryIdNumber, currentPage, navigate, isUpdate])


    useEffect(() => {  
        const fetchImages = async () => { 
            const images = await getAllIconImage(bookList); // lấy ra các icon sách
            setImageList(images);
        }
        fetchImages();
    }, [bookList]);

    const handleDelete=(bookId:number)=>{   // thực hiện xóa sách trong category
        confirm({
            title:'Xóa sách khỏi thể loại',
            description:`Bạn có chắc muốn xóa sách này ra khỏi thể loại ${category?.categoryName}`,
            confirmationText:['Xóa'],
            cancellationText:['Hủy'],
        }).then(()=>{
            toast.promise(
                fetchWithAuth(`http://localhost:8080/category/${categoryIdNumber}/books/${bookId}`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    }
                }
            ).then((response)=>{
                if(response.ok){
                    toast.success("Đã xóa sách khỏi thể loại thành công");
                    setIsUpdate(prev=>!prev); // Biến này để cập nhật lại giao diện khi xóa
                }else{
                    toast.error("Lỗi khi xóa sách khỏi thể loại");
                }
            }).catch(error=>{
                toast.error("Lỗi khi xóa sách khỏi thể loại");
                console.error(error);
            }),
            {pending:"Đang trong quá trình xử lý..."}
        )})
        .catch(()=>{});
    }
    const handleFormSubmit=async(e:FormEvent)=>{  // form đổi tên thể loại
        e.preventDefault();

        const url:string = `http://localhost:8080/category/editCategory`;

        try{
            const response =await fetchWithAuth(url,{
                method:"PUT",
                headers:{
                    "Content-type":"application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body:JSON.stringify({
                    categoryId:categoryIdNumber,
                    categoryName:newCategoryName
                })
            });
     
            const data = await response.json();
            if(response.ok){
                setErrorNewCategoryName(data.content);
                setIsError(false)
                setIsUpdate(prevState=>!prevState)
            }else{
                setErrorNewCategoryName(data.content || "Lỗi đổi tên thể loại");
                setIsError(true);
            }
    
        }catch(error){
            setErrorNewCategoryName("Lỗi đổi tên thể loại!")
            setIsError(true);
            console.log({error})
        }
        setNewCategoryName("")
    }

    const toggleForm=()=>{   // Mở form thêm wishList
        setNewCategoryName("")
        setErrorNewCategoryName("")
        setShowForm(!showForm);
    }

    
    const pagination = (pageCurrent:number)=>{ // phân trang
        setCurrentPage(pageCurrent);
    }

    return(
            <div className="container">
                    <h2 className="text-center mt-2">{category?.categoryName}</h2>
                    {isLoading && (
                        <Box sx={{ textAlign: "center", mt: 5 }}>
                        <CircularProgress color="inherit" />
                    </Box>
                    )}
                     <div className="row mb-3">
                        <div className="col">
                        <button 
                            className="btn btn-primary" 
                            onClick={toggleForm}
                        >
                            <i className="fa fa-plus me-2"></i>Sửa tên thể loại 
                        </button>
                        </div>
                    </div>
                    {showForm&&(
                        <div className="row justify-content-center mb-3">
                            <div className="col-md-6">
                            <form onSubmit={handleFormSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="categoryName">Tên thể loại mới</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="categoryName"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mt-3 text-center">
                                                <button type="submit" className="btn btn-primary">Lưu</button>
                                            </div>
                                        </form>
                            </div>
                            <div className="text-center" style={{color:isError?"red":"green"}}>{errorNewCategoryName}</div>
                        </div>
                    )
                }
                    <div className="d-flex justify-content-center">
                    <table className="table table-striped table-hover">
                    <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên danh sách</th>
                                <th scope="col">Ảnh</th>
                                <th scope="col">Số sao đánh giá</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Tác giả</th>
                                <th scope="col">Tiện ích</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bookList?.map((book,index)=>(
                                    <tr  key={index}>
                                    <th scope="row">{(currentPage - 1) * 10 + index + 1}</th>
                                  <td>
                                     <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none' ,color:"black"}}> {book.bookName}</Link>     
                                  </td>
                                        <td> <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none' }}>
                                           {imageList[index] ? <img src={imageList[index].imageData} alt="Ảnh"  style={{ width: "50px",height:"50px" }}></img>: "Sách chưa có ảnh"}
                                           </Link>
                                        </td>
                                        <td>{renderRating(book.averageRate)}</td>
                                        <td>{NumberFormat(book.price)} đ</td>
                                        <td>{book.author}</td>
                                        <td>
                                            <div className="mt-2">
                                                <button  className="btn btn-danger"  onClick={()=>handleDelete(book.bookId)}>
                                                <i className="fas fa-trash"></i></button>
                                                </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        
                        </tbody>
                        </table>
                    </div>
                    <p>{notice}</p>
                    <Pagination currentPage={currentPage} totalPages={totalPages} pagination={pagination}></Pagination>
            </div>
    )
}

const EditCategory_Admin = RequireAdmin(EditCategory);
export default EditCategory_Admin;