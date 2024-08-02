import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

interface OrderProps {
  orderId: number;
  setIsLoading: Dispatch<SetStateAction<boolean>>,
}

const OrderDetail: React.FC<OrderProps> = ({ orderId ,setIsLoading}) => {
  const [order, setOrder] = useState<OrderModel | null>(null);
  const [books, setBooks] = useState<BookModel[]>([]);
  const [imageBooks, setImageBooks] = useState<ImageModel[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetailModel[]>([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        navigate("/login", { replace: true });
        return;
      }
      setIsLoading(true);
      try {
        const fetchOrder = await getOrderByOrderId(orderId);  // Lấy ra order để lấy trạng thái đơn hàng, vận chuyển ...
        if (fetchOrder === null) {
          navigate("/error-404", { replace: true });
          return;
        }
        setOrder(fetchOrder);

        const fetchOrderDetails = await getOrderDetailsFromOrder(orderId); // Lấy ra orderDetail để lấy ra số lượng từng book
        setOrderDetails(fetchOrderDetails);

        const fetchBooks = await getBooksOfOrders(orderId); // Lấy ra book trong order
        setBooks(fetchBooks);

        const fetchImageOfBook = await getAllIconImage(fetchBooks); // lấy ra image của book
        setImageBooks(fetchImageOfBook);
      } catch (error) {
        console.error({ error });
        navigate("/error-404", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, navigate, orderId, setIsLoading]);


  const handleCancelOrder=async()=>{
    const confirmUser = window.confirm("Bạn có chắc muốn hủy đơn")
    if(!confirmUser){
      return;
    }else{
      if(order){
        console.log("pl")
        navigate(`/order/cancelOrder/${order.orderId}`)
    }
  }
}

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          <Typography color={order?.deliveryStatus === "Hoàn thành" ? "green" : "orange"}>
            {order?.deliveryStatus}
          </Typography>
          <Typography mx={2}>|</Typography>
          <Typography color="orange">{order?.orderStatus}</Typography>
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
         <Typography variant="body1" mr={1} color="#6c757d"  fontSize={14} alignSelf="center">
          <del>{NumberFormat(books[index]?.listedPrice)} đ</del>
         </Typography>
         <Typography variant="body1" color="error" alignSelf="center">
           {NumberFormat(books[index]?.price)} đ
         </Typography>
       </Box>
        ))}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          {
            order?.orderStatus!=='Đã hủy' ? 
                    <Box>
                    {
                      order?.orderStatus==='Hoàn thành' ? <Button variant="contained" color="error" sx={{ mr: 1 }}>Đánh Giá</Button>
                                                :    <Button variant="contained" color="error" sx={{ mr: 1 }}>Đã nhận được hàng</Button>

                    }

                      {
                      order?.deliveryStatus==='Đã giao hàng thành công' ?  <Button variant="outlined" color="secondary">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
                                                :          <Button variant="outlined" color="secondary" type="button" onClick={handleCancelOrder}>Hủy đơn</Button>

                    }
                  </Box> : 

                        <Box>
                             <Button variant="contained" color="error" sx={{ mr: 1 }}>Mua lại</Button>
                            <Button variant="outlined" color="secondary" type="button" onClick={handleCancelOrder}>Xem chi tiết hủy đơn</Button>
                        </Box>
          }
         
          <Typography variant="h5" color="error">
            Thành tiền: {NumberFormat(order?.totalPrice)} đ
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderDetail;