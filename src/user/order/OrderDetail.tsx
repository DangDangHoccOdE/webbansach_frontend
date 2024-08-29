import React, {useCallback, useContext, useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import OrderDetailModel from "../../models/OrderDetailModel";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getBooksOfOrders } from "../../api/BookAPI";
import OrderModel from "../../models/OrderModel";
import { getOrderByOrderId } from "../../api/OrderAPI";
import NumberFormat from "../../layouts/utils/NumberFormat";
import { getOrderDetailsFromOrder } from "../../api/OrderDetailAPI";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import OrderReview from "../review/OrderReview";
import { CartContext } from "../../context/CartContext";
import { confirmReceivedOrder, handleCreateOrder, repurchase } from "./OrderActions";
import { handleBankPayment } from "../payment/handleBankPayment";
import { toast } from "react-toastify";
import ModalCancelOrder from "./ModalCancelOrder";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

interface OrderProps {
  orderId: number;
  onOrderUpdate:((updateOder:OrderModel)=>void) | null // Hàm này có chức năng cập nhật lại giao diện mà không cần load lại
  showFunctionRelateOrder:boolean // Có chức năng giúp xác nhận có hiển thị thêm phần Đánh giá, mua lại, hủy đơn ,...
}

const OrderDetail: React.FC<OrderProps> = ({ orderId ,onOrderUpdate,showFunctionRelateOrder}) => {
  const [order, setOrder] = useState<OrderModel | null>(null);
  const [books, setBooks] = useState<BookModel[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetailModel[]>([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const userId = getUserIdByToken();
  const [showModal, setShowModal] = useState(false);  // form review
  const {updateCartItemCount} = useContext(CartContext);
  const [showModalCancelOrder, setShowModalCancelOrder] = useState(false);
  const [currentPage,setCurrentPage] = useState(0);
  const [hasMore,setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        // Lấy thông tin đơn hàng, order details, books, và images cùng lúc
        const [fetchOrder, fetchOrderDetails, fetchBooks] = await Promise.all([
          getOrderByOrderId(orderId),
          getOrderDetailsFromOrder(orderId,currentPage),
          getBooksOfOrders(orderId),
        ]);
    
        if (!fetchOrder || !fetchOrderDetails) {
          navigate("/error-404", { replace: true });
          return;
        }
    
        setOrder(fetchOrder);
        setOrderDetails(prev=>[...prev, ...fetchOrderDetails.orderDetails]);
        setBooks(fetchBooks);
        setHasMore(fetchOrderDetails.hasMore)
      } catch (error) {
        console.error({ error });
        navigate("/error-404", { replace: true });
      } 
    };
    fetchData()    
  }, [currentPage, isLoggedIn, navigate, orderId]);

  const handleRepurchase=async()=>{ // Xử lý mua lại hàng
      if(order && userId){
        const cartItemIds = await repurchase(order.orderId);
        if(cartItemIds){
          updateCartItemCount();
           navigate(`/user/showCart`,{state:{cartItemIds}})  // function repurchase
        }
      }
  }

  const handleConfirmReceivedOrder=async()=>{ // Xử lý đã nhận đơn hàng
    if (order) {
        const isUpdate = await confirmReceivedOrder(order.orderId);
        if(isUpdate&& onOrderUpdate){
          const updateOrder = {...order,orderStatus:"Hoàn thành"};
          onOrderUpdate(updateOrder);
          setOrder(updateOrder);
      }
    }

}

  const handleShowRequestReturnOrder=()=>{ // Xử lý khi ấn vào yêu cầu trả hàng/ hoàn tiền
      toast.warn("Tính năng đang cập nhật!")
}  

const handleShowDetailCancelOrder=()=>{ // Xử lý khi ấn vào yêu cầu trả hàng/ hoàn tiền
      if(order){
          navigate(`/user/purchase/cancellation/${orderId}`);
      }
}

  const handleClose=()=>{  // Mở form đánh giá sản phẩm
      setShowModal(false);
  }

  const handleReviewClick=()=>{
      setShowModal(true);
  }
  const handlePaymentWithBank=()=>{  // Tiến hành thanh toán ngân hàng
    if(order)
         handleBankPayment(order)
            .then(paymentUrl => {
              if (paymentUrl) {
                return handleCreateOrder(order, false)  // isBuyNow là false
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

  const handleReviewSubmit=useCallback(()=>{ // Khi người dùng đánh giá thành công thì cập nhật lại trạng thái đơn hàng
    if(order && onOrderUpdate){
      const updateOrder = {...order,orderStatus:"Đánh giá"};
      onOrderUpdate(updateOrder);
      setOrder(updateOrder);
    }
  },[onOrderUpdate, order])

 

  const handleCancelOrder = () => { // Mở form hủy đơn hàng
    setShowModalCancelOrder(true);
  }; 
  
  const handleCloseModalCancelOrder = () => { // Đóng form hủy đơn hàng
    setShowModalCancelOrder(false);
  };


  const handleOrderUpdate = (updateOrder: Partial<OrderModel>) => { // Cập nhật lại giao diện ngay sau khi xác nhận hủy
    if (order && onOrderUpdate) {
      const newOrder = { ...order, ...updateOrder };
      onOrderUpdate(newOrder);
      setOrder(newOrder);
    }
  };

  const handleShowMore = ()=>{
    setCurrentPage(prevPage=>prevPage+1);
  }

  return (
    <>
        <ModalCancelOrder onClose={handleCloseModalCancelOrder}
                              onOrderUpdate={handleOrderUpdate}
                              open={showModalCancelOrder}
                              orderId={orderId}
                              key={orderId}
          />
         
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          {  showFunctionRelateOrder &&
              (  order?.deliveryStatus==="Đã giao" && order.orderStatus==="Hoàn thành" ?
              <>
                  <Typography color={"green"}>
                    {order?.deliveryStatus}
                </Typography>
                <Typography mx={2}>|</Typography>
                <Typography color="orange">{order?.orderStatus}</Typography>
              </>  :  
               <Typography color="orange">{order?.orderStatus}</Typography> )
          }
         </Box>

         <Link to={`/order/purchase/${order?.orderId}`} style={{textDecoration:"none",color:"black"}} >
              {orderDetails.map((orderDetail, index) => (
              <Box key={index} display="flex" alignItems="flex-start" mb={2} borderBottom={1} pb={2}>
              <Box display="flex" alignItems="center" flexGrow={1}>
                <img
                  src={books[index].thumbnail}
                  alt="Bìa sách"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '16px' }}
                />
                <Box display="flex" flexDirection="column">
                  <Typography variant="subtitle1" fontWeight="medium">
                    {books[index]?.bookName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    x{orderDetail.quantity}
                  </Typography>
                </Box>
              </Box>
              {
                books[index].discountPercent>0 &&  
                <Typography variant="body1" mr={1} color="#6c757d"  fontSize={14} alignSelf="center">
                  <del>{NumberFormat(books[index]?.listedPrice)} đ</del>
              </Typography>
              }
              
              <Typography variant="body1" color="error" alignSelf="center">
                {NumberFormat(books[index]?.price)} đ
              </Typography>
            </Box>
              ))}
        </Link>
        {
        hasMore && (
          <div className="text-center mt-3 mb-3">
              <button className="btn btn-secondary" onClick={handleShowMore}><KeyboardDoubleArrowDownIcon/></button>
          </div>
        )
      }

      {
        showFunctionRelateOrder && 
            <Box display="flex" justifyContent="space-between" alignItems="center">
            {
            <Box>
            {
              order?.orderStatus !== 'Đã hủy' && order?.orderStatus !== 'Đánh giá' ? (
                order?.orderStatus === 'Hoàn thành' ? (
                  <>
                    <Button variant="contained" color="error" sx={{ mr: 1 }} onClick={handleReviewClick}>Đánh Giá</Button>
                    <OrderReview 
                      onReviewSubmit={handleReviewSubmit} 
                      books={books} 
                      handleClose={handleClose} 
                      showModal={showModal} 
                      orderId={orderId} 
                      reviews={null}
                      orderReview={null}
                    />
                    <Button variant="outlined" color="secondary">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
                  </>
                ) : (
                  order?.orderStatus === "Chờ thanh toán" ?
                          <>
                          <Button variant="contained" color="error" sx={{ mr: 1 }} onClick={handlePaymentWithBank}>Thanh toán</Button>
                          <Button variant="outlined" color="secondary" type="button" onClick={handleCancelOrder}>Hủy đơn</Button>
                        </> : 
                          <>
                          <Button variant="contained" color="error" sx={{ mr: 1 }} onClick={handleConfirmReceivedOrder}>Đã nhận được hàng</Button>
                          <Button variant="outlined" color="secondary" type="button" onClick={handleCancelOrder}>Hủy đơn</Button>
                        </>
                )
              ) : (
                <>
                  <Button variant="contained" type="button" onClick={handleRepurchase} color="error" sx={{ mr: 1 }}>Mua lại</Button>
                  {
                    order?.orderStatus === 'Đánh giá' ? (
                      <Button variant="outlined" color="secondary" type="button" onClick={handleShowRequestReturnOrder}>Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
                    ) : (
                      <Button variant="outlined" color="secondary" type="button" onClick={handleShowDetailCancelOrder}> Xem chi tiết hủy đơn</Button>
                    )
                  }
                </>
              )
            }
          </Box>
          
            }
          
            <Typography variant="h5" color="error">
              Thành tiền: {NumberFormat(order?.paymentCost)} đ
            </Typography>
         </Box>
      }

      
      
      </CardContent>
    </Card> 
    </>
  );
};

export default OrderDetail;