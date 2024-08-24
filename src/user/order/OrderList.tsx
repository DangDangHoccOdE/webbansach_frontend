import React, { useCallback, useEffect, useState } from "react";
import OrderModel from "../../models/OrderModel";
import { useNavigate } from "react-router-dom";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { useAuth } from "../../context/AuthContext";
import { showOrders } from "../../api/OrderAPI";
import OrderDetail from "./OrderDetail";
import { CircularProgress } from "@mui/material";

interface OrderProps {
  value: string;}

const OrderList: React.FC<OrderProps> = (props) => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const navigate = useNavigate();
  const userId = getUserIdByToken();
  const { isLoggedIn } = useAuth();
  const [notice, setNotice] = useState("");
  const [orderStatus, setOrderStatus] = useState("Tất cả");
  const [hasMore,setHasMore] = useState(false);
  const [currentPage,setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set orderStatus based on props.value
    const statusMap:{ [key:string] :string}={
      "1":"Tất cả",
      "2":"Chờ thanh toán",
      "3":"Đang xử lý",
      "4":"Đang vận chuyển",
      "5":"Đã giao",
      "6":"Đã hủy",
      "7":"Trả hàng/Hoàn tiền",
    }
    setOrderStatus(statusMap[props.value] || "Tất cả")
    setCurrentPage(0);
    setOrders([])
  }, [props.value]);

  
  
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      navigate("/login", { replace: true });
      return;
    }
   
    const fetchOrders = async () => {   // Lấy tất cả dữ liệu đơn hàng
      if (userId) {
        try {
          setIsLoading(true);
          const data = await showOrders(userId, orderStatus,currentPage); /// Thực hiện tìm kiếm các đơn hàng theo trạng thái đơn hàng
          if (!data) {
            navigate("/error-404", { replace: true });
            return;
          } else {
            if (data.orders.length === 0) {
              setNotice("Chưa có đơn hàng");
            } else {
              setNotice("");
            }
            setOrders(prevOrders => [...prevOrders, ...data.orders]);
            setHasMore(data.hasMore)
          }
        } catch (error) {
          console.log({ error });
          navigate("/error-404", { replace: true });
          return;
        }finally{
          setIsLoading(false)
        }
      }else{
        return;
      }
    }
  
    fetchOrders();
  }, [isLoggedIn, userId, navigate, orderStatus, currentPage]);

  const handleOrderUpdate = useCallback((updateOrder:OrderModel)=>{ // Cập nhật lại giao diện ngay khi thay đổi trong Tất cả chỗ order.
    setOrders(prevOrders=>
      prevOrders.map(order=>
        order.orderId===updateOrder.orderId ? updateOrder : order
      )
    );
  },[]);

  const handleShowMore=()=>{
    setCurrentPage(prevPage=>prevPage+1);
  }

  return (
    <div className="container">
      {orders?.map((order, index) => (
              <OrderDetail
            key={index}
            orderId={order.orderId}
            onOrderUpdate={handleOrderUpdate}
            showFunctionRelateOrder={true}/>
      ))}
          {isLoading && (
      <div className="text-center mt-3">
        <CircularProgress />
      </div>
    )}
      {
        hasMore && (
          <div className="text-center mt-3 mb-3">
              <button className="btn btn-primary" onClick={handleShowMore}>Hiển thị thêm</button>
          </div>
        )
      }
      {
        notice && 
        <div className="container mt-4 mb-3">
        <div className="border text-center py-4" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <i className="fas fa-shopping-cart" style={{ fontSize: "100px", color: "#ccc" }}></i>
          <p className="text-danger mt-3">{notice || "Chưa có đơn hàng"}</p>
        </div>
      </div>
      }
      

    </div>
  );
};

export default OrderList;
