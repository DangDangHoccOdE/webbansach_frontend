import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import CartModel from "../../models/CartModel";
import { showCart } from "../../api/CartAPI";
import { getBookListByCart } from "../../api/BookAPI";
import ImageModel from "../../models/ImageModel";
import { getAllIconImage } from "../../layouts/utils/ImageService";
import renderRating from "../../layouts/utils/StarRate";
import NumberFormat from "../../layouts/utils/NumberFormat";

const ShowCart=()=>{
    const {userId} = useParams();
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate()
    const [bookListOfCart,setBookListOfCart] = useState<BookModel[]>([])
    const [cart,setCart] = useState<CartModel|null>(null)
    const [notice,setNotice] = useState("")
    const [isLoading,setIsLoading] = useState(false);
    const [iconImageList,setIconImageList]=useState<ImageModel[]>([])

    const userIdNumber = parseInt(userId+''); 

    useEffect(()=>{
        if(!isLoggedIn){
            alert("Bạn phải đăng nhập để tiếp tục");
            return;
        }

        const showCartByUser = async()=>{
            setIsLoading(true);
            try{
                const cartData = await showCart(userIdNumber);
                if(cartData===null){
                    navigate("/error-404",{replace:true});
                    return;
                }   
                if(cartData.quantity===0){
                    setNotice("Giỏ hàng trống!")
                }
                setCart(cartData);
            }catch(error){
                console.log("Không tải được dữ liệu giỏ hàng!");
                navigate("/error-404",{replace:true});                
            }finally{
                setIsLoading(false)
            }
        }

        showCartByUser()
    },[isLoggedIn, navigate, userIdNumber])

    useEffect(()=>{
        const getBookListOfCart = async()=>{
            setIsLoading(true);
            try{
                if(cart){
                    const bookListData = await getBookListByCart(cart.cartId)
                    setBookListOfCart(bookListData);
                }
            }catch(error){
                navigate("/error-404",{replace:true}); 
            }finally{
                setIsLoading(false)
            }
        }
        getBookListOfCart()
    },[cart,navigate])

    useEffect(()=>{
        const fetchIconImageList = async()=>{
            const result = await getAllIconImage(bookListOfCart);
            setIconImageList(result);
        }

        fetchIconImageList();
    },[bookListOfCart])

    const handleDelete=(bookId:number)=>{

    }

    if(!isLoggedIn){
        return null;
    }
    return(
        <div className="container">
        <h1 className="mt-5">Giỏ hàng</h1>
             {isLoading && <div style={{ textAlign: "center" }}>Đang tải...</div> }
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
                                bookListOfCart?.map((book,index)=>(
                                    <tr  key={index}>
                                    <th scope="row">{index}</th>
                                  <td>
                                     <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none' ,color:"black"}}> {book.bookName}</Link>     
                                  </td>
                                        <td> <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none' }}>
                                           {iconImageList[index] ? <img src={iconImageList[index].imageData} alt="Ảnh"  style={{ width: "50px" }}></img>: "Sách chưa có ảnh"}
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
        </div>
    )
}
export default ShowCart;