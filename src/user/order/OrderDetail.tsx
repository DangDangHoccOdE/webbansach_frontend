import React, {useCallback, useContext, useEffect, useState } from "react";
import ImageModel from "../../models/ImageModel";
import BookModel from "../../models/BookModel";
import OrderDetailModel from "../../models/OrderDetailModel";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getBooksOfOrders } from "../../api/BookAPI";
import { getAllIconImage } from "../../layouts/utils/ImageService";
import OrderModel from "../../models/OrderModel";
import { getOrderByOrderId } from "../../api/OrderAPI";
import NumberFormat from "../../layouts/utils/NumberFormat";
import { getOrderDetailsFromOrder } from "../../api/OrderDetailAPI";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import OrderReview from "../review/OrderReview";
import { CartContext } from "../../context/CartContext";
import { cancelOrder, confirmReceivedOrder, repurchase } from "./OrderActions";

interface OrderProps {
  orderId: number;
  onOrderUpdate:((updateOder:OrderModel)=>void) | null // Hàm này có chức năng cập nhật lại giao diện mà không cần load lại
  showFunctionRelateOrder:boolean // Có chức năng giúp xác nhận có hiển thị thêm phần Đánh giá, mua lại, hủy đơn ,...
}

const OrderDetail: React.FC<OrderProps> = ({ orderId ,onOrderUpdate,showFunctionRelateOrder}) => {
  const [order, setOrder] = useState<OrderModel | null>(null);
  const [books, setBooks] = useState<BookModel[]>([]);
  const [imageBooks, setImageBooks] = useState<ImageModel[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetailModel[]>([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const userId = getUserIdByToken();
  const [showModal, setShowModal] = useState(false);
  const {updateCartItemCount} = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        // Lấy thông tin đơn hàng, order details, books, và images cùng lúc
        const [fetchOrder, fetchOrderDetails, fetchBooks, fetchImageOfBook] = await Promise.all([
          getOrderByOrderId(orderId),
          getOrderDetailsFromOrder(orderId),
          getBooksOfOrders(orderId),
          getAllIconImage(await getBooksOfOrders(orderId))
        ]);
    
        if (!fetchOrder) {
          navigate("/error-404", { replace: true });
          return;
        }
    
        setOrder(fetchOrder);
        setOrderDetails(fetchOrderDetails);
        setBooks(fetchBooks);
        setImageBooks(fetchImageOfBook);
      } catch (error) {
        console.error({ error });
        navigate("/error-404", { replace: true });
      } 
    };
    fetchData()    
  }, [isLoggedIn, navigate, orderId]);

  const handleCancelOrder = useCallback(async () => {
    if (order) {
        const isUpdate = await cancelOrder(order.orderId);
        if(isUpdate && onOrderUpdate){
          const updateOrder = {...order,orderStatus:"Đã hủy"};
          onOrderUpdate(updateOrder);
          setOrder(updateOrder)
        }
    }

  },[onOrderUpdate, order]);


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

  const handleClose=()=>{  // Mở form đánh giá sản phẩm
      setShowModal(false);
  }

  const handleReviewClick=()=>{
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }else{
      setShowModal(true);
    }
  }

  const handleReviewSubmit=useCallback(()=>{ // Khi người dùng đánh giá thành công thì cập nhật lại trạng thái đơn hàng
    if(order && onOrderUpdate){
      const updateOrder = {...order,orderStatus:"Đánh giá"};
      onOrderUpdate(updateOrder);
      setOrder(updateOrder);
    }
  },[onOrderUpdate, order])

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          {  showFunctionRelateOrder &&
              (  order?.deliveryStatus==="Đã giao" ?
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


        {orderDetails.map((orderDetail, index) => (
         <Box key={index} display="flex" alignItems="flex-start" mb={2} borderBottom={1} pb={2}>
         <Box display="flex" alignItems="center" flexGrow={1}>
           <img
             src={imageBooks[index]?.imageData}
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
                      imageOfBooks={imageBooks} 
                      showModal={showModal} 
                      orderId={orderId} 
                      reviews={null}
                      orderReview={null}
                    />
                    <Button variant="outlined" color="secondary">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
                  </>
                ) : (
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
                      <Button variant="outlined" color="secondary">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
                    ) : (
                      <Button variant="outlined" color="secondary" type="button">Xem chi tiết hủy đơn</Button>
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
  );
};

export default OrderDetail;