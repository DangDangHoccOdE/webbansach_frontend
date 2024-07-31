import { Link, useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { getAllCartItemByUser } from "../../api/CartItemAPI";
import ImageModel from "../../models/ImageModel";
import { getAllIconImage } from "../../layouts/utils/ImageService";
import NumberFormat from "../../layouts/utils/NumberFormat";
import CartItemModel from "../../models/CartItemModel";
import { getBookByCartItem } from "../../api/BookAPI";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import VoucherModel from "../../models/VoucherModel";
import updateQuantityOfCarts from "./UpdateQuantityOfCartIItem";
import SelectVoucherToAddCreate from "../order/SelectVoucherToAddOrder";

const ShowCart=()=>{
    const {userId} = useParams();
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate()
    const [bookListOfCart,setBookListOfCart] = useState<BookModel[]>([])
    const [cartItem,setCartItem] = useState<CartItemModel[]>([])
    const [notice,setNotice] = useState("")
    const [iconImageList,setIconImageList]=useState<ImageModel[]>([])
    const [selectAll,setSelectAll] = useState(false); // Trạng thái cho checkbox "Tất cả"
    const [selectedItems, setSelectedItems] = useState<number[]>([]); // Trạng thái cho các checkbox
    const [total,setTotal] = useState(0);
    const [totalByVoucher,setTotalByVoucher] = useState(0);
    const [showModal,setShowModal] = useState(false);
    const [appliedBookVoucher, setAppliedBookVoucher] = useState<VoucherModel | null>(null);
    const [appliedShipVoucher, setAppliedShipVoucher] = useState<VoucherModel | null>(null);
    const [totalProduct,setTotalProduct] = useState(0)

    const userIdNumber = parseInt(userId+''); 
    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login",{replace:true})
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
                        // const quantity = item.quantity;
                        // return {bookData,quantity}
                        return {bookData}
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

    useEffect(() => {
        const updateTotal = async () => {
          const totalValue = await calculateTotal();
          setTotal(totalValue);
          if(appliedBookVoucher===null){
            setTotalByVoucher(totalValue);
          }else{
            const priceUpdateVoucher = totalValue - totalValue*(appliedBookVoucher.discountValue/100);
            setTotalByVoucher(priceUpdateVoucher);
          }
        };
    
        updateTotal();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [selectedItems,appliedBookVoucher,cartItem]);

      const calculateTotal = async()=>{ // Tính tổng tiến
        let total = 0;
  
        const calculate = selectedItems.map(async(cardItemId)=>{
          const book = await getBookByCartItem(cardItemId);
          const item = cartItem.find(item=>item.cartItemId === cardItemId);
          if(book && item){
              return book.price * item.quantity;
          }
          return 0;
      })
        const totalPrice = await Promise.all(calculate);
        total = totalPrice.reduce((sum,price)=>sum+price,0); // sum là giá trị tích lũy sau mỗi lần , price là giá hiện tại
        return total;
      }
      
    const handleDelete=(cartItemId:number)=>{ // Xóa sách trong giỏ hàng
        const userConfirm = window.confirm("Bạn có chắc chắn muốn xóa!")
        if(!userConfirm){
            return;
        }else{
            navigate(`/cart/deleteCartItem/${cartItemId}/${userId}`,{replace:true});
        }
    }

    const handleQuantity = async(event:ChangeEvent<HTMLInputElement>,book:BookModel)=>{  // Số lượng
        const quantityNow = parseInt(event.target.value);
        const inventoryNumber = book && book.quantity?book.quantity:0;
        if(!isNaN(quantityNow) && quantityNow>=1 && quantityNow<=inventoryNumber){
            const updateCart = cartItem.map(async(item,index)=>{
                if(bookListOfCart[index].bookId === book.bookId){
                    await updateQuantityOfCarts(cartItem[index].cartItemId,quantityNow);
                    return {...item,quantity:quantityNow}
                }
                return item;
            })
            const completedUpdate = await Promise.all(updateCart);
            setCartItem(completedUpdate);
        }
    }

    const increaseQuantity = async(cart:CartItemModel,book:BookModel) => { // Tăng số lượng
        if(cart.quantity< book.quantity){
             const updateQuantityBooks = cartItem.map(async(item,index)=>{
                if(bookListOfCart[index].bookId === book.bookId){
                    await updateQuantityOfCarts(cartItem[index].cartItemId,item.quantity+1);
                    return {...item,quantity:item.quantity+1}
                }
                return item;
             })
             const completedUpdate = await Promise.all(updateQuantityBooks);
             setCartItem(completedUpdate);
        }
    }

    const reduceQuantity = async(cart:CartItemModel,book:BookModel) => { // Giảm số lượng
        if(book.quantity>=2 && cart.quantity>1){
            const updateQuantityBooks = cartItem.map(async(item,index)=>{
                if(bookListOfCart[index].bookId === book.bookId){
                    await updateQuantityOfCarts(cartItem[index].cartItemId,item.quantity-1);
                    return {...item,quantity:item.quantity-1}
                }
                return item;
             })
             const completedUpdate = await Promise.all(updateQuantityBooks);
             setCartItem(completedUpdate);
        }
    }

    const handleSelectAll=()=>{ // Xử lý chọn tất cả sản phẩm
        setSelectAll(!selectAll);
        if(!selectAll){
            setSelectedItems(cartItem.map(item=>item.cartItemId));
        }else{
            setSelectedItems([]);
        }
    }

    const handleSelectItems = (cartItemId:number)=>{ // Xử lý chọn 1 sản phẩm
        const cartItemFilter = cartItem.find(cart=>cart.cartItemId === cartItemId)
        
        if(cartItemFilter){
            if(selectedItems.includes(cartItemId)){
                setTotalProduct(totalProduct-cartItemFilter.quantity);
                setSelectedItems(selectedItems.filter(item=>item!==cartItemId));
            }else{
                setTotalProduct(totalProduct+cartItemFilter.quantity);
                setSelectedItems([...selectedItems,cartItemId]);
            }
        }
    }

    const handleClickBuy = ()=>{
        if(selectedItems.length>0){
            navigate("/order/createOrder", { state: { selectedItems, 
                                            total: total, 
                                            bookVoucher:appliedBookVoucher, 
                                            shipVoucher:appliedShipVoucher,
                                            totalProduct:totalProduct } });
        }else{
            toast.error("Vui lòng chọn ít nhất một sản phẩm để mua hàng.");
        }
    }



    const handleSelectVoucher=()=>{ // Xử lý khi người dùng chọn hiển thị voucher
        if(!isLoggedIn){
            navigate("/login",{replace:true})
        }
        if(selectedItems.length===0){
            toast.error("Vui lòng chọn ít nhất 1 sản phẩm để chọn voucher")
        }else{
            setShowModal(true);
        }
    }

    const handleClose=()=>{ // đóng modal showVoucher
        setShowModal(false);
    }

    const handleApplyVoucher=(voucherBook:VoucherModel|null,voucherShip:VoucherModel|null)=>{ // Xử lý khi chọn voucher 
        setAppliedBookVoucher(voucherBook);
        setAppliedShipVoucher(voucherShip);
    }

    if(!isLoggedIn){
        return null;
    }
    return(
            <div className="container-fluid">
                <h1 className="mt-5">Giỏ hàng</h1>
        
                <div className="row">
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-body">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <input type="checkbox" style={{ marginRight: "10px" }} checked={selectAll} onChange={handleSelectAll}></input>
                                                Tất cả ({cartItem.length} sản phẩm)
                                            </th>
                                            <th scope="col">Sản phẩm</th>
                                            <th scope="col">Đơn giá</th>
                                            <th scope="col">Số lượng</th>
                                            <th scope="col">Thành tiền</th>
                                            <th scope="col">
                                                    <button className="btn btn-link text-danger" onClick={() => handleDelete(1)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookListOfCart?.map((book, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input type="checkbox"
                                                        checked={selectedItems.includes(cartItem[index].cartItemId)}
                                                        onChange={() => handleSelectItems(cartItem[index].cartItemId)}></input>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none' }}>
                                                            {iconImageList[index] ? (
                                                                <img src={iconImageList[index].imageData} alt="Ảnh" style={{ width: "50px", maxHeight: "50px", marginRight: "10px" }} />
                                                            ) : "Sách chưa có ảnh"}
                                                        </Link>
                                                        <Link to={`/books/${book.bookId}`} style={{ textDecoration: 'none', color: "black" }}>
                                                            {book.bookName}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td>{NumberFormat(book.price)} đ</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <button className="btn btn-outline-secondary" onClick={() => reduceQuantity(cartItem[index], book)}>-</button>
                                                        <input className="form-control text-center mx-2" type="number" min={1} value={cartItem[index].quantity} onChange={e => handleQuantity(e, book)} style={{ width: "100px" }} />
                                                        <button className="btn btn-outline-secondary" onClick={() => increaseQuantity(cartItem[index], book)}>+</button>
                                                    </div>
                                                </td>
                                                <td style={{ color: "red" }}>{NumberFormat(cartItem[index].quantity * book.price)} đ</td>
                                                <td>
                                                    <button className="btn btn-link text-danger" onClick={() => handleDelete(cartItem[index].cartItemId)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Tính tiền</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính</span>
                                    <span>{NumberFormat(total)} đ</span>
                                </div>
                                {
                                    appliedBookVoucher &&
                                    <div className="d-flex justify-content-between mb-2">
                                    <span>Voucher giảm giá</span>
                                    <span>- {NumberFormat(total*(appliedBookVoucher.discountValue/100))} đ</span>
                                </div>
                                }
                                {
                                    appliedShipVoucher && 
                                    <span>Miễn phí vận chuyển</span>
                                }
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Tổng tiền</strong>
                                    <strong style={{ color: "red", fontSize: "18px" }}>{NumberFormat(totalByVoucher)} đ</strong>
                                </div>
                                <button className="btn btn-danger w-100" onClick={handleClickBuy}>Mua hàng</button>
                                
                                <div className="mt-3">
                                    <button className="btn btn-outline-primary w-100" onClick={handleSelectVoucher}>
                                        <FontAwesomeIcon icon={faGift} className="me-2" /> Chọn hoặc nhập mã voucher
                                     </button>

                                     {
                                        <SelectVoucherToAddCreate handleClose={handleClose} showModal={showModal} onApplyVoucher={handleApplyVoucher} selectedBookVoucher={null} selectedShipVoucher={null}/>
                                     }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <p>{notice}</p>
            </div>
        );
    }
    
    export default ShowCart;