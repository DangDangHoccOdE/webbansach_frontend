import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import OrderModel from "../../models/OrderModel";
import { useNavigate } from "react-router-dom";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { useAuth } from "../../context/AuthContext";
import { showOrders } from "../../api/OrderAPI";
import OrderDetail from "./OrderDetail";

interface OrderProps {
  value: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const OrderList: React.FC<OrderProps> = (props) => {
  const [orders, setOrders] = useState<OrderModel[] | null>(null);
  const navigate = useNavigate();
  const userId = getUserIdByToken();
  const { isLoggedIn } = useAuth();
  const [notice, setNotice] = useState("");
  const [orderStatus, setOrderStatus] = useState("Tất cả");
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
  }, [props.value]);

  const fetchOrders = useCallback(async () => {
    if (userId) {
      try {
        const data = await showOrders(userId, orderStatus);
        if (!data) {
          navigate("/error-404", { replace: true });
          return;
        } else {
          if (data.length === 0) {
            setNotice("Chưa có đơn hàng");
          } else {
            setNotice("");
          }
          setOrders(data);
        }
      } catch (error) {
        console.log({ error });
        navigate("/error-404", { replace: true });
        return;
      }
    }else{
      return;
    }
  }, [userId, orderStatus, navigate]);

  
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      navigate("/login", { replace: true });
      return;
    }
   
    fetchOrders();
  }, [isLoggedIn, userId, fetchOrders, navigate]);

  const handleOrderUpdate = useCallback((updateOrder:OrderModel)=>{ // Cập nhật lại giao diện ngay khi thay đổi trong Tất cả chỗ order.
    setOrders(prevOrders=>
      prevOrders?prevOrders.map(order=>
        order.orderId===updateOrder.orderId ? updateOrder : order
      ):null
    );
  },[]);

  return (
    <div className="container">
      {orders?.map((order, index) => (
        <OrderDetail
          key={index}
          orderId={order.orderId}
          setIsLoading={props.setIsLoading}
          onOrderUpdate={handleOrderUpdate}
        />
      ))}
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
