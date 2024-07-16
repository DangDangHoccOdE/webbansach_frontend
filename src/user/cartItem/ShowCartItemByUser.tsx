import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";
import { ChangeEvent, useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { getAllCartItemByUser } from "../../api/CartItemAPI";
import ImageModel from "../../models/ImageModel";
import { getAllIconImage } from "../../layouts/utils/ImageService";
import NumberFormat from "../../layouts/utils/NumberFormat";
import CartItemModel from "../../models/CartItemModel";
import { getBookByCartItem } from "../../api/BookAPI";

const ShowCart=()=>{
    const {userId} = useParams();
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate()
    const [bookListOfCart,setBookListOfCart] = useState<BookModel[]>([])
    const [cartItem,setCartItem] = useState<CartItemModel[]>([])
    const [notice,setNotice] = useState("")
    const [iconImageList,setIconImageList]=useState<ImageModel[]>([])

    const userIdNumber = parseInt(userId+''); 
    useEffect(()=>{
        if(!isLoggedIn){
            alert("Bạn phải đăng nhập để tiếp tục");
            navigate("/",{replace:true})
            return;
        }

        const showCartByUser = async()=>{
            try{
                const cartItemData = await getAllCartItemByUser(userIdNumber);
                if(cartItemData===null){
                    navigate("/error-404",{replace:true});
                    return;
                }   
                if(cartItemData.length===0){
                    setNotice("Giỏ hàng trống!")
                }
                setCartItem(cartItemData);
            }catch(error){
                console.log("Không tải được dữ liệu giỏ hàng!");
                navigate("/error-404",{replace:true});                
            }
        }

        showCartByUser()
    },[isLoggedIn, navigate, userIdNumber])

    useEffect(()=>{
        const getBookOfCart = async()=>{
            try{
                if(cartItem){
                  const cart = cartItem.map(async(item:CartItemModel)=>{
                        const bookData = await getBookByCartItem(item.cartItemId);
                        const quantity = item.quantity;
                        return {bookData,quantity}
                  })
                        const result =await Promise.all(cart);
                        const bookValid = result.map(item=>item.bookData).filter(book => book !== null) as BookModel[];
                        setBookListOfCart(bookValid);
                  
                }
            }catch(error){
                navigate("/error-404",{replace:true}); 
            }
        }
        getBookOfCart()
    },[cartItem,navigate])

    useEffect(()=>{ // Lấy ra các icon của sách
        const fetchIconImageList = async()=>{
            const result = await getAllIconImage(bookListOfCart);
            setIconImageList(result);
        }

        fetchIconImageList();
    },[bookListOfCart])

    const handleDelete=(cartItemId:number)=>{ // Xóa sách trong giỏ hàng
        const userConfirm = window.confirm("Bạn có chắc chắn muốn xóa!")
        if(!userConfirm){
            return;
        }else{
            navigate(`/cart/deleteCartItem/${cartItemId}/${userId}`,{replace:true});
        }
    }

    const handleQuantity = (event:ChangeEvent<HTMLInputElement>,book:BookModel)=>{ 
        const quantityNow = parseInt(event.target.value);
        const inventoryNumber = book && book.quantity?book.quantity:0;
        if(!isNaN(quantityNow) && quantityNow>=1 && quantityNow<=inventoryNumber){
            const updateCart = cartItem.map((item,index)=>{
                if(bookListOfCart[index].bookId === book.bookId){
                    return {...item,quantity:item.quantity+1}
                }
                return item;
            })
            setCartItem(updateCart);
        }
    }

    const increaseQuantity = (cart:CartItemModel,book:BookModel) => { // Tăng số lượng
        if(cart.quantity< book.quantity){
             const updateQuantityBooks = cartItem.map((item,index)=>{
                if(bookListOfCart[index].bookId === book.bookId){
                    return {...item,quantity:item.quantity+1}
                }
                return item;
             })
             setCartItem(updateQuantityBooks);
        }
    }

    const reduceQuantity = (cart:CartItemModel,book:BookModel) => { // Giảm số lượng
        if(book.quantity>=2 && cart.quantity>1){
            const updateQuantityBooks = cartItem.map((item,index)=>{
                if(bookListOfCart[index].bookId === book.bookId){
                    return {...item,quantity:item.quantity-1}
                }
                return item;
             })
             setCartItem(updateQuantityBooks);
        }
    }


    if(!isLoggedIn){
        return null;
    }
    return(
        <div className="container">
        <h1 className="mt-5">Giỏ hàng</h1>
             <div className="d-flex justify-content-center">
             <table className="table table-striped table-hover">
                <thead className="thead-light">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tên danh sách</th>
                    <th scope="col">Ảnh</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Thành tiền</th>
                    <th scope="col">Tiện ích</th>
                    </tr>
                </thead>
                <tbody>
                    {bookListOfCart?.map((book, index) => (
                    <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                        <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none', color: "black" }}>
                            {book.bookName}
                        </Link>
                        </td>
                        <td>
                        <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none' }}>
                            {iconImageList[index] ? (
                            <img src={iconImageList[index].imageData} alt="Ảnh" style={{ width: "50px", maxHeight: "50px" }} />
                            ) : "Sách chưa có ảnh"}
                        </Link>
                        </td>
                        <td>{NumberFormat(book.price)} đ</td>
                        <td className="align-middle">
                        <div className="d-flex align-items-center">
                            <button
                                className="btn btn-outline-secondary me-2"
                                onClick={() => increaseQuantity(cartItem[index],book)}
                                style={{ height: "38px" }} // Đặt chiều cao cố định cho nút
                                >
                                +
                            </button>
                            <input
                                className="form-control text-center mx-2"
                                type="number"
                                min={1}
                                value={cartItem[index].quantity}
                                onChange={e => handleQuantity(e, book)}
                                style={{ width: "100px", height: "38px" }} // Đặt chiều cao cố định cho ô nhập liệu
                            />
                            <button
                                className="btn btn-outline-secondary ms-2"
                                onClick={()=>reduceQuantity(cartItem[index],book)}
                                style={{ height: "38px" }} // Đặt chiều cao cố định cho nút
                                >
                                -
                            </button>
                        </div>
                        <span className="badge bg-secondary" style={{ fontSize: "12px" }}>
                                Còn {book.quantity} sản phẩm
                            </span>
                        </td>
                        <td style={{color:"red"}}>{NumberFormat(cartItem[index].quantity * book.price)} đ</td>
                        <td>
                        <button className="btn btn-danger" onClick={() => handleDelete(book.bookId)}>
                            <i className="fas fa-trash"></i>
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>

                    </div>
                    <p>{notice}</p>
        </div>
    )
}
export default ShowCart;