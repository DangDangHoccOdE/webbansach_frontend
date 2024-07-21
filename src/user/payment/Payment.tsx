import CartItemModel from "../../models/CartItemModel";
import BookModel from "../../models/BookModel";
import { useContext, useEffect, useState } from "react";
import { getBookByCartItem } from "../../api/BookAPI";
import { useLocation, useNavigate } from "react-router-dom";
import ImageModel from "../../models/ImageModel";
import { getAllIconImage } from "../../layouts/utils/ImageService";
import NumberFormat from "../../layouts/utils/NumberFormat";
import UserModel from "../../models/UserModel";
import { getUserByUsername } from "../../api/UserAPI";
import {getUsernameByToken } from "../../layouts/utils/JwtService";
import { useAuth } from "../../layouts/utils/AuthContext";
import moment from "moment";
import { CartContext } from "../cartItem/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Payment:React.FC =()=>{
    const location = useLocation();
    const { selectedItems, cartItems, totalPrice } = location.state as { 
        selectedItems: number[], 
        cartItems: CartItemModel[], 
        totalPrice:number
    } || { selectedItems: [], cartItems: [],totalPrice:0 };
    const [bookIsChoose, setBookIsChoose] = useState<BookModel[]>([]);
    const [iconImageList,setIconImageList] = useState<ImageModel[]>([])
    const [user,setUser] = useState<UserModel|null>(null);
    const navigate = useNavigate();
   const {isLoggedIn} = useAuth();
   const deliveryDate = moment().add(7,'day').format("Do MMMM,YYYY");
   const dateNow = moment().format("Do MMMM,YYYY");
   const {itemCounter} = useContext(CartContext);
   const [showAllBooks,setShowAllBooks] = useState(false);
    const [formOfDelivery,setFormOfDelivery] = useState("Nhanh")

    const renderDetail = ()=>{ // Xử lý chọn phương thức giao hàng
        switch (formOfDelivery){
            case "Nhanh":
                return(
                    <div className="mb-3">
                        <div className="d-flex justify-content-between">
                        <p><strong>Nhanh</strong></p>
                        <p>{NumberFormat(30000)} đ</p>
                        </div>
                        <p style={{color:"green"}}><i className="fa-solid fa-truck-fast me-2"></i>Đảm bảo nhận hàng trong vòng từ hôm nay đến {deliveryDate}</p>
                        <p className="text-muted">Nhận voucher trị giá ({NumberFormat(15000)} đ) nếu đơn hàng được giao đến bạn sau ngày {deliveryDate}</p>
                        <p className="text-muted">Được đồng kiểm</p>
                 </div>
                )
            
            case "Hỏa tốc":
                return(
                    <div className="mb-3">
                        <div className="d-flex justify-content-between">
                        <p><strong>Hỏa tốc</strong></p>
                        <p>{NumberFormat(50000)} đ</p>
                        </div>
                        <p style={{color:"green"}}><i className="fa-solid fa-truck-fast me-2"></i>Đảm bảo nhận hàng trong {dateNow}</p>
                        <p className="text-muted">Nhận voucher trị giá ({NumberFormat(30000)} đ) nếu đơn hàng được giao đến bạn sau ngày {dateNow}</p>
                        <p className="text-muted">Được đồng kiểm</p>
               </div>
                )
        }
    }

    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login",{replace:true})
            return ;
        }
        const handlePurchase = async()=>{ // xử lý chuyển từ id cartItem thành sách
            const handleBook = selectedItems.map(async(item:number)=>{
                const book = await getBookByCartItem(item);
                if(book){
                    return book;
                }
            })
                const bookList = await Promise.all(handleBook);
                const bookValid = bookList.filter(book=>book!==null) as BookModel[];
                setBookIsChoose(bookValid);
        }

        const handleUser = async()=>{
            const username = getUsernameByToken();
            if(username){
                try{
                    const getUser = await getUserByUsername(username);
                    if(getUser===null){
                        navigate("/error-404",{replace:true});
                    }
                    setUser(getUser);
                }catch(error){
                    console.log({error});
                }
              
            }
        }
        handlePurchase();
        handleUser();
    },[isLoggedIn, navigate, selectedItems])

    useEffect(()=>{
        const handleIcon = async()=>{  // Lấy ra những icon của sách
            const iconImage = await getAllIconImage(bookIsChoose);
            console.log(iconImage)
            setIconImageList(iconImage);

        }
        handleIcon();
    },[bookIsChoose])
    return(
        <div className="container">
        <h1 className="text-center mt-3">Thanh toán</h1>
        <div className="row">
            {/* Section for Book Details */}
             <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Đơn hàng của bạn</h2>
              {iconImageList.length > 0 && (showAllBooks ? bookIsChoose : bookIsChoose.slice(0,3)).map((book, index) => (
                <div key={index} className="d-flex mb-3 align-items-center">
                  <img src={iconImageList[index].imageData} alt={book.bookName} className="img-fluid me-3" style={{ width: "100px" }} />
                  <div>
                    <h5>{book.bookName}</h5>
                    <p className="mb-0">Số lượng: {cartItems[index].quantity}</p>
                    <p className="mb-0">Đơn giá: {NumberFormat(book.price)} đ</p>
                    <p className="text-danger mb-0">Thành tiền: {NumberFormat(cartItems[index].quantity * book.price)} đ</p>
                  </div>
                </div>
              ))}
              {
                bookIsChoose.length > 3 && (
                    <button className="btn btn-link"
                            onClick={()=>setShowAllBooks(!showAllBooks)}
                >
                    {showAllBooks ?
                          <img src="/images/public/show-less.png" alt="Xem tất cả" style={{width:"50px"}}/>
                    :
                         <img src="/images/public/show-more.png" alt="Xem tất cả" style={{width:"50px"}}/>
                    }
                </button>)
              }
            </div>
          </div>
        </div>
            {/* Thông tin liên quan đến giao hàng */}
           <div className="col-6">
                <div className="card border shadow-sm">
                    <div className="card-body">
                    {/* Shipping Address */}
                    <div className="mb-3">
                        <h5>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt me-2" viewBox="0 0 16 16" style={{ color: "red" }}>
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                        Địa chỉ nhận hàng
                        </h5>
                        <p className="mb-0">{user?.lastName} {user?.firstName} ({user?.phoneNumber})</p>
                        <p>{user?.deliveryAddress}</p>
                    </div>
                    <hr />

                    {/* Phương thức ship */}
                    <h5 className="mb-3">Phương thức vận chuyển (Nhấn để chọn)</h5>
                    <select className="form-select" onChange={e=>setFormOfDelivery(e.target.value)}>
                            <option value="Nhanh">Nhanh</option>
                            <option value="Hỏa tốc">Hỏa tốc</option>
                    </select>

                    {
                        renderDetail()
                    }
                    <hr />

                    {/*Tin nhắn từ user*/}
                    <div className="mb-3">
                        <label htmlFor="userMessage" className="form-label">Tin nhắn</label>
                        <input type="text" id="userMessage" placeholder="Lưu ý cho người bán" className="form-control" />
                    </div>
                    <hr />

                    {/* Tổng tiền */}
                    <div className="d-flex justify-content-between mb-3">
                        <p className="mb-0">Tổng số tiền ({itemCounter} sản phẩm):</p>
                        <p className="mb-0 text-danger">{NumberFormat(totalPrice + 30000)} đ</p>
                    </div>
                    <hr />

                    {/* Voucher */}
                    <div className="mb-3">
                        <h5>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-ticket-perforated me-2" viewBox="0 0 16 16" style={{ color: "red" }}>
                            <path d="M4 4.85v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9z" />
                            <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3zM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9z" />
                        </svg>
                        BookStore Voucher
                        </h5>
                        <div className="d-flex justify-content-between align-items-center">
                            <input type="text" placeholder="Nhập mã voucher" className="form-control me-2" />
                            <button className="btn btn-outline-secondary">Áp dụng</button>
                        </div>
                    </div>
                    <hr />

                    {/* Phương Thức Thanh toán */}
                    <div className="mb-3">
                        <h5>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-coin me-2" viewBox="0 0 16 16" style={{ color: "red" }}>
                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                        </svg>
                        Phương thức thanh toán
                        </h5>
                        <select className="form-select">
                            <option value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</option>
                            <option value="Thanh toán qua ngân hàng">Thanh toán qua ngân hàng</option>
                        </select>
                    </div>
                    <hr />

                    {/* Tổng thanh toán */}
                    <div>
                        <h5><FontAwesomeIcon icon={faCircleInfo} style={{color:"orange"}} /> Chi tiết thanh toán: </h5>
                        <p>Tổng tiền hàng :{NumberFormat(totalPrice)} đ </p>
                        <p>Tổng tiền vận chuyển : {NumberFormat(30000)} đ</p>
                        <h4>Tổng thanh toán:
                            <span style={{color:"red"}}> {NumberFormat(totalPrice+30000)} đ</span>
                        </h4>
                        <button className="btn btn-success btn-lg">Đặt hàng</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Payment;