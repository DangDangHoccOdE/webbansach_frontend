import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import BookModel from "../../models/BookModel";
import { getBookListByWishList } from "../../api/BookAPI";
import WishListModel from "../../models/WishListModel";
import { getWishListByWishListId } from "../../api/WishListAPI";
import ImageModel from "../../models/ImageModel";
import { Pagination } from "../../layouts/utils/Pagination";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { useAuth } from "../../layouts/utils/AuthContext";
import NumberFormat from "../../layouts/utils/NumberFormat";
import renderRating from "../../layouts/utils/StarRate";
import { getAllIconImage } from "../../layouts/utils/ImageService";

const EditWishList=()=>{
    useScrollToTop();

    const {wishListId} = useParams();
    const [isLoading,setIsLoading] = useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    const [bookList,setBookList] = useState<BookModel[]>([]);
    const [notice,setNotice] = useState("")
    const navigate = useNavigate();
    const [wishList,setWishList] = useState<WishListModel|null>(null);
    const [imageList,setImageList] = useState<ImageModel[]>([])
    const [showForm,setShowForm] = useState(false);
    const [newWishListName,setNewWishListName] = useState("");    
    const [errorNewWishList,setErrorNewWishList] = useState("");
    const [isError,setIsError] = useState(false);
    const [isUpdate,setIsUpdate] = useState(false)
    const {isLoggedIn} = useAuth();

    const wishListIdNumber = parseInt(wishListId+"");

    useEffect(()=>{
        if (!isLoggedIn) {  // Kiểm tra người dùng đã đăng nhập chưa
            alert("Bạn phải đăng nhập để tiếp tục")
            navigate("/")
            return;
        }

        const fetchBookListData = async()=>{ // lấy ra ds sách từ wishList
            try{
                setIsLoading(true);
                const getBookList = await getBookListByWishList(wishListIdNumber,currentPage-1);
                if(getBookList.resultBooks===null){
                    navigate("/error-404");
                }

                if(getBookList.resultBooks.length===0){
                    setNotice("Danh sách trống!");
                }

                setBookList(getBookList.resultBooks);
                setTotalPages(getBookList.totalPages);

            }catch(error){
                console.log("Lỗi, Không thể tải được sách!!");
                navigate("/error-404");
            }finally{
                setIsLoading(false);
            }
            
        }

        const getWishListById= async()=>{  // Lấy ra wishList từ id
            setIsLoading(true);
            try{
                const data = await getWishListByWishListId(wishListIdNumber);
                if (data === null) {
                    navigate("/error-404");
                }
                
                setWishList(data);
            }catch(error){
                console.log("Không thể tải được danh sách yêu thích!");
                navigate("/error-404");
            }finally{
                setIsLoading(false);
            }
        }

        fetchBookListData();
        getWishListById();
    },[navigate, wishListIdNumber, currentPage, isUpdate, isLoggedIn])
    
    useEffect(() => { // lấy ra các icon sách
        const fetchImages = async () => {
            const images = await getAllIconImage(bookList);
            setImageList(images);
        }
        fetchImages();
    }, [bookList]);

    const handleDelete=(bookId:number)=>{  // xóa sách trong wishList
        const userConfirm = window.confirm("Bạn có chắc chắn muốn xóa!");
        if(!userConfirm){
            return;
        }else{
            navigate(`/wishList/deleteBookOfWishList/${bookId}/${wishListIdNumber}`)
        }
    }

    const pagination=(currentPage:number)=>{ // phân trang
        setCurrentPage(currentPage);
    }

    const handleFormSubmit=async(e:FormEvent)=>{ // form đổi tên danh sách yêu thích
        e.preventDefault();

        const url:string = `http://localhost:8080/wishList/editWishListName`;

        try{
            const response =await fetchWithAuth(url,{
                method:"PUT",
                headers:{
                    "Content-type":"application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body:JSON.stringify({
                    wishListId:wishListIdNumber,
                    newWishListName:newWishListName
                })
            });
     
            const data = await response.json();
            if(response.ok){
                setErrorNewWishList(data.content);
                setIsError(false)
                setIsUpdate(prevState=>!prevState)
            }else{
                setErrorNewWishList(data.content || "Lỗi đổi tên danh sách yêu thích");
                setIsError(true);
            }
    
        }catch(error){
            setErrorNewWishList("Lỗi đổi tên danh sách yêu thích!")
            setIsError(true);
            console.log({error})
        }

        setNewWishListName("");
    }

    const toggleForm=()=>{
        setShowForm(!showForm);
    }

    if(!isLoggedIn){
        return null;
    }

    return (
        <div className="container">
                <h2 className="text-center mt-2">{wishList?.wishListName}</h2>
                {isLoading && <p className="text-center">Đang tải...</p>}
                    <div className="col-3">
                        <button className="btn btn-secondary ms-auto" onClick={toggleForm}>Đổi tên danh sách yêu thích</button>  
                    </div>
                {
                showForm&&(
                    <div className="row justify-content-center mb-3">
                        <div className="col-md-6">
                        <form onSubmit={handleFormSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="wishListName">Tên danh sách yêu thích mới</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="wishListName"
                                                value={newWishListName}
                                                onChange={(e) => setNewWishListName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-3 text-center">
                                            <button type="submit" className="btn btn-primary">Lưu</button>
                                        </div>
                                    </form>
                        </div>
                        <div className="text-center" style={{color:isError?"red":"green"}}>{errorNewWishList}</div>
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
                                <th scope="row">{index}</th>
                              <td>
                                 <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none' ,color:"black"}}> {book.bookName}</Link>     
                              </td>
                                    <td> <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none' }}>
                                       {imageList[index] ? <img src={imageList[index].imageData} alt="Ảnh"  style={{ width: "50px" }}></img>: "Sách chưa có ảnh"}
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

export default EditWishList;