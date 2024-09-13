import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faGift } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { confirm } from "material-ui-confirm";
import { toast } from "react-toastify";

import CartItemModel from "../../models/CartItemModel";
import BookModel from "../../models/BookModel";
import UserModel from "../../models/UserModel";
import VoucherModel from "../../models/VoucherModel";

import { getBookByBookId, getBookByCartItem } from "../../api/BookAPI";
import {  getUserByUserId } from "../../api/UserAPI";
import { getCartItemById } from "../../api/CartItemAPI";

import NumberFormat from "../../layouts/utils/NumberFormat";
import generateOrderCode from "../../layouts/utils/GenerateOrderCode";

import { useAuth } from "../../context/AuthContext";
import { handleBankPayment } from "../payment/handleBankPayment";
import { handleCreateOrder } from "./OrderActions";
import SelectVoucherToAddCreate from "./SelectVoucherToAddOrder";
import EditIcon from '@mui/icons-material/Edit';
import { getUserIdByToken } from "../../layouts/utils/JwtService";
const OrderSummary: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const userId = getUserIdByToken();

    const { selectedItems, total, bookVoucher, shipVoucher, totalProduct, isBuyNow } = location.state as { 
        selectedItems: number[], 
        total: number,
        bookVoucher: VoucherModel | null,
        shipVoucher: VoucherModel | null,
        totalProduct: number,
        isBuyNow: boolean,
    } || { selectedItems: [], total: 0, bookVoucher: null, shipVoucher: null, totalProduct: 0, isBuyNow: false };

    const [bookIsChoose, setBookIsChoose] = useState<BookModel[]>([]);
    const [user, setUser] = useState<UserModel | null>(null);
    const deliveryDate = moment().add(7, 'day').format("Do MMMM, YYYY");
    const dateNow = moment().format("Do MMMM, YYYY");
    const [showAllBooks, setShowAllBooks] = useState(false);
    const [formOfDelivery, setFormOfDelivery] = useState("Nhanh");
    const [priceShip, setPriceShip] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [appliedBookVoucher, setAppliedBookVoucher] = useState<VoucherModel | null>(bookVoucher);
    const [appliedShipVoucher, setAppliedShipVoucher] = useState<VoucherModel | null>(shipVoucher);
    const [cart, setCart] = useState<CartItemModel[]>([]);
    const [noteUser, setNoteUser] = useState('');
    const [selectMethodPayment, setSelectMethodPayment] = useState("Thanh toán khi nhận hàng");
    const [voucherIds, setVoucherIds] = useState<number[]>([]);

    const renderDetail = () => {
        switch (formOfDelivery) {
            case "Nhanh":
                return (
                    <div className="mb-3">
                        <div className="d-flex justify-content-between">
                            <p><strong>Nhanh</strong></p>
                            <p>{NumberFormat(30000)} đ</p>
                        </div>
                        <p style={{color:"green"}}><i className="fa-solid fa-truck-fast me-2"></i>Đảm bảo nhận hàng trong vòng từ hôm nay đến {deliveryDate}</p>
                        <p className="text-muted">Nhận voucher trị giá ({NumberFormat(15000)} đ) nếu đơn hàng được giao đến bạn sau ngày {deliveryDate}</p>
                        <p className="text-muted">Được đồng kiểm</p>
                    </div>
                );
            case "Hỏa tốc":
                return (
                    <div className="mb-3">
                        <div className="d-flex justify-content-between">
                            <p><strong>Hỏa tốc</strong></p>
                            <p>{NumberFormat(50000)} đ</p>
                        </div>
                        <p style={{color:"green"}}><i className="fa-solid fa-truck-fast me-2"></i>Đảm bảo nhận hàng trong {dateNow}</p>
                        <p className="text-muted">Nhận voucher trị giá ({NumberFormat(30000)} đ) nếu đơn hàng được giao đến bạn sau ngày {dateNow}</p>
                        <p className="text-muted">Được đồng kiểm</p>
                    </div>
                );
        }
    };

    useEffect(() => {
        if (!isLoggedIn || !userId) {
            navigate("/login", { replace: true });
            return;
        }

        const handlePurchase = async () => {  // Xử lý mua hàng
            if (isBuyNow) {
                const book = await getBookByBookId(selectedItems[0]);
                if (book) {
                    const books: BookModel[] = [book];
                    setBookIsChoose(books);
                }
            } else {
                const handleBook = selectedItems.map(async (item: number) => {
                    const book = await getBookByCartItem(item);
                    if (book) { 
                        return book;
                    }
                });
                const bookList = await Promise.all(handleBook);
                const bookValid = bookList.filter(book => book !== null) as BookModel[];
                setBookIsChoose(bookValid);

                const handleCart = selectedItems.map(async (item: number) => {
                    const cartItem = await getCartItemById(item);
                    if (cartItem) {
                        return cartItem;
                    }
                });

                const cartItemList = await Promise.all(handleCart);
                const cartItemListValid = cartItemList.filter(cartItem => cartItem !== null) as CartItemModel[];
                setCart(cartItemListValid);
            }
        };

        const handleUser = async () => {   // Load thông tin user
            if (userId) {
                try {
                    const getUser = await getUserByUserId(userId);
                    if (getUser === null) {
                        navigate("/error-404", { replace: true });
                    }
                    setUser(getUser);
                } catch (error) {
                    console.log({ error });
                }
            }
        };

        const handleSelectDelivery = () => {
            if (formOfDelivery === "Nhanh") {
                setPriceShip(30000);
            } else {
                setPriceShip(50000);
            }
        };

        handleSelectDelivery();
        handlePurchase();
        handleUser();
    }, [formOfDelivery, isBuyNow, isLoggedIn, navigate, selectedItems, userId]);

    const [priceByVoucher, setPriceByVoucher] = useState(total);

    const discountPriceByBookVoucher = useMemo(() => {  // Tính giảm giá tiền sách
        if (selectedItems && appliedBookVoucher) {
            let discount = total * (appliedBookVoucher.discountValue / 100);
            if (discount > appliedBookVoucher.maximumOrderDiscount && appliedBookVoucher.maximumOrderDiscount > 0) {
                discount = appliedBookVoucher.maximumOrderDiscount;
            }
            return Math.floor(discount);
        } else {
            return 0;
        }
    }, [appliedBookVoucher, selectedItems, total]);

    const discountPriceByShipVoucher = useMemo(() => {  // Tính giảm giá tiền ship
        if (selectedItems && appliedShipVoucher) {
            let discount = priceShip * (appliedShipVoucher.discountValue / 100);
            if (discount > appliedShipVoucher.maximumOrderDiscount && appliedShipVoucher.maximumOrderDiscount > 0) {
                discount = appliedShipVoucher.maximumOrderDiscount;
            }
            return Math.floor(discount);
        } else {
            return 0;
        }
    }, [appliedShipVoucher, selectedItems, priceShip]);

    useEffect(() => {  // Tính tổng tiền
        let totalPrice = total + priceShip;
        if (appliedBookVoucher) {
            totalPrice -= discountPriceByBookVoucher;
        }
        if (appliedShipVoucher) {
            totalPrice -= discountPriceByShipVoucher;
        }

        setPriceByVoucher(Math.floor(totalPrice));
    }, [appliedBookVoucher, appliedShipVoucher, discountPriceByBookVoucher, discountPriceByShipVoucher, priceShip, total]);

    const handleSelectVoucher = () => {
        setShowModal(!showModal);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleApplyVoucher = (voucherBook: VoucherModel | null, voucherShip: VoucherModel | null) => {
        setAppliedBookVoucher(voucherBook);
        setAppliedShipVoucher(voucherShip);
    };

    const handleSelectMethodPayment = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectMethodPayment(e.target.value);
    };

    const handleClickBuy = () => {
        confirm({
            title: 'Đơn hàng',
            description: `Bạn có chắc muốn mua đơn hàng này không (${selectMethodPayment})?`,
            confirmationText: 'Đồng ý',
            cancellationText: 'Hủy',
        })
            .then(() => {
                if (user) {
                    let updatedVoucherIds = [...voucherIds];
                    if (appliedBookVoucher) {
                        updatedVoucherIds.push(appliedBookVoucher.voucherId);
                    }
                    if (appliedShipVoucher) {
                        updatedVoucherIds.push(appliedShipVoucher.voucherId);
                    }
                    setVoucherIds(updatedVoucherIds);

                    const order = {
                        orderId: 0,
                        date: moment().format('YYYY/MM/DD HH:mm:ss'),
                        orderCode: generateOrderCode(),
                        deliveryAddress: user.deliveryAddress,
                        deliveryStatus: "Chưa giao",
                        orderStatus: 'Đang xử lý',
                        paymentCost: priceByVoucher,
                        purchaseAddress: "BookStore Hà Nội",
                        shippingFee: priceShip,
                        shippingFeeVoucher: appliedShipVoucher ? priceShip - priceShip * (appliedShipVoucher.discountValue / 100) : priceShip,
                        totalPrice: total,
                        totalProduct: totalProduct,
                        noteFromUser: noteUser,
                        userId: user.userId,
                        cartItems: selectedItems,
                        paymentMethod: selectMethodPayment,
                        deliveryMethod: formOfDelivery,
                        voucherIds: updatedVoucherIds,
                    };

                    if (order.deliveryAddress === null || order.deliveryAddress.trim() === "" || user.phoneNumber === null) {
                        toast.warning("Địa chỉ giao hàng hoặc số điện thoại không được bỏ trống!");
                        return;
                    }

                    if (selectMethodPayment === "Thanh toán khi nhận hàng") {
                        navigate("/order/createOrder", { state: { order, isBuyNow }, replace: true });
                    } else {
                        handleBankPayment(order)
                            .then(paymentUrl => {
                                if (paymentUrl) {
                                    order.orderStatus = 'Chờ thanh toán';
                                    return handleCreateOrder(order, false)
                                        .then(() => {
                                            window.location.replace(paymentUrl);
                                        });
                                } else {
                                    throw new Error("Không tạo được URL thanh toán");
                                }
                            })
                            .catch(error => {
                                console.error("Lỗi khi xử lý thanh toán:", error);
                                toast.error("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.");
                            });
                    }
                }
            })
            .catch(() => {
                console.log("Người dùng đã hủy hoặc có lỗi xảy ra");
            });
    };


   
    return(
        <div className="container mb-5">
        <h1 className="text-center mt-3">Thanh toán</h1>
        <div className="row">
            {/* Section for Book Details */}
             <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Đơn hàng của bạn</h2>
              {bookIsChoose.length > 0 && (showAllBooks ? bookIsChoose : bookIsChoose.slice(0,3)).map((book, index) => (
                <div key={index} className="d-flex mb-3 align-items-center">
                  <img src={bookIsChoose[index].thumbnail} alt={book.bookName} className="img-fluid me-3" style={{ width: "100px" }} />
                  <div>
                    <h5>{book.bookName}</h5>
                    {cart.length>0 ?  
                           <div>
                           <p className="mb-0">Số lượng: {cart[index].quantity}</p>
                           <p className="mb-0">Đơn giá: {NumberFormat(book.price)} đ</p>
                           <p className="text-danger mb-0">Thành tiền: {NumberFormat(cart[index].quantity * book.price)} đ</p> 
                       </div>
                            :
                            <div>
                            <p className="mb-0">Số lượng: {totalProduct}</p>
                            <p className="mb-0">Đơn giá: {NumberFormat(book.price)} đ</p>
                            <p className="text-danger mb-0">Thành tiền: {NumberFormat(totalProduct * book.price)} đ</p> 
                        </div>
                    }   
                 
                  </div>
                </div>
                
              ))}
              {
                bookIsChoose.length > 3 && (
                    <button className="btn btn-link"
                            onClick={()=>setShowAllBooks(!showAllBooks)}
                >
                    {showAllBooks ?
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-double-up" viewBox="0 0 16 16" style={{width:"100px"}}>
                            <path  d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708z"/>
                            <path  d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                        </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-double-down" viewBox="0 0 16 16" style={{width:"100px"}}>
                        <path d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                        <path d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                    </svg>
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
                        <div className="row">
                            <div className="col-6">
                              <span style={{color:user?.deliveryAddress===null || user?.deliveryAddress.trim()==="" ?"red":undefined}}>
                                     {user?.deliveryAddress===null || user?.deliveryAddress.trim()==="" ? "Chưa có địa chỉ giao hàng" : user?.deliveryAddress}
                                </span>
                            </div>
                            <div className="col-6 ">
                                <Link to={`/user/info/${userId}`}>
                                    <EditIcon/>
                                </Link>
                            </div>
                        </div>
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
                        <input type="text" id="userMessage" placeholder="Lưu ý cho người bán" className="form-control" value={noteUser} onChange={e=>setNoteUser(e.target.value)} />
                    </div>
                    <hr />

                    {/* Tổng tiền */}
                    <div className="d-flex justify-content-between mb-3">
                        <p className="mb-0">Tổng số tiền ({totalProduct} sản phẩm):</p>
                        <p className="mb-0 text-danger">{NumberFormat(total + priceShip)} đ</p>
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
                        <button className="btn btn-outline-primary w-100" onClick={handleSelectVoucher}>
                                        <FontAwesomeIcon icon={faGift} className="me-2" /> Chọn hoặc nhập mã voucher
                                     </button>

                        {
                            <SelectVoucherToAddCreate
                                showModal={showModal}
                                handleClose={handleClose}
                                onApplyVoucher={handleApplyVoucher}
                                selectedBookVoucher={appliedBookVoucher}
                                selectedShipVoucher={appliedShipVoucher}
                                totalPrice={total + priceShip}
                            />                        }
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
                        <select className="form-select" value={selectMethodPayment} onChange={handleSelectMethodPayment}>
                            <option value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</option>
                            <option value="Thanh toán qua ngân hàng">Thanh toán qua ngân hàng</option>
                        </select>
                    </div>
                    <hr />

                    {/* Tổng thanh toán */}
                    <div>
                        <h5><FontAwesomeIcon icon={faCircleInfo} style={{color:"orange"}} /> Chi tiết thanh toán: </h5>
                        <div className="d-flex justify-content-between mb-2">
                           <span>Tổng tiền hàng :  </span>
                           <span><b>{NumberFormat(total)} đ</b></span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                           <span>Tổng tiền vận chuyển :</span>
                           <span><b>{NumberFormat(priceShip)} đ</b></span>
                        </div>
                        {
                                    appliedBookVoucher &&
                                    <div className="d-flex justify-content-between mb-2">
                                    <span>Voucher giảm giá</span>
                                    <span><b>- {NumberFormat(discountPriceByBookVoucher)} đ</b></span>
                                </div>
                                }
                                {
                                    appliedShipVoucher && 
                                    <div className="d-flex justify-content-between mb-2">
                                    <span>Giảm giá phí vận chuyển</span>
                                    <span><b>- {NumberFormat(discountPriceByShipVoucher)} đ</b></span>
                                </div>
                                }
                                  <div className="d-flex justify-content-between mb-2">
                                  <h4>Tổng thanh toán:  </h4>
                                    <h4 style={{color:"red"}}> {NumberFormat(priceByVoucher)} đ</h4>                 
                                </div>
                        <button type="submit" className="btn btn-success btn-lg" onClick={handleClickBuy}>Đặt hàng</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default OrderSummary;