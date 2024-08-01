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

        const fetchOrderDetails = await getOrderDetailsFromOrder(orderId); // lYas ra orderDetail để lấy ra số lượng từng book
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


  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography color={order?.deliveryStatus === "Hoàn thành" ? "green" : "orange"}>
            {order?.deliveryStatus}
          </Typography>
          <Typography color="orange">{order?.orderStatus}</Typography>
        </Box>

        {orderDetails.map((orderDetail, index) => (
          <Box key={index} display="flex" alignItems="center" mb={2} borderBottom={1} pb={2}>
            <img
              src={imageBooks[index]?.imageData}
              alt="Ảnh"
              style={{ width: '80px', height: '80px', marginRight: '16px' }}
            />
            <Box flexGrow={1}>
              <Typography variant="h6">{books[index]?.bookName}</Typography>
              <Typography>x{orderDetail.quantity}</Typography>
            </Box>
            <Typography variant="body2" color="error">{NumberFormat(books[index]?.price)}</Typography>
          </Box>
        ))}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Button variant="contained" color="error" sx={{ mr: 1 }}>Đánh Giá</Button>
            <Button variant="outlined" color="secondary">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
          </Box>
          <Typography variant="h5" color="error">
            Thành tiền: {NumberFormat(order?.totalPrice)} đ
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderDetail;