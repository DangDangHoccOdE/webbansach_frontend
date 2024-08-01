import { Dispatch, SetStateAction, useEffect, useState } from "react"
import OrderModel from "../../models/OrderModel"
import { useNavigate } from "react-router-dom";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { useAuth } from "../../context/AuthContext";
import { showOrders } from "../../api/OrderAPI";
import OrderDetail from "./OrderDetail";

interface OrderProps {
    value: string
    setIsLoading: Dispatch<SetStateAction<boolean>>,
}

const OrderList: React.FC<OrderProps> = (props) => {
    const [orders, setOrders] = useState<OrderModel[] | null>(null)
    const navigate = useNavigate();
    const userId = getUserIdByToken();
    const { isLoggedIn } = useAuth();
    const [notice, setNotice] = useState("")
    const [orderStatus, setOrderStatus] = useState("Tất cả")

    useEffect(() => {
        // Set orderStatus based on props.value
        if (props.value === "1") {
            setOrderStatus("Tất cả");
        } else if (props.value === "2") {
            setOrderStatus("Chờ thanh toán");
        } else if (props.value === "3") {
            setOrderStatus("Vận chuyển");
        } else if (props.value === "4") {
            setOrderStatus("Chờ giao hàng");
        } else if (props.value === "5") {
            setOrderStatus("Hoàn thành");
        } else if (props.value === "6") {
            setOrderStatus("Đã hủy");
        } else if (props.value === "7") {
            setOrderStatus("Trả hàng/Hoàn tiền");
        }
    }, [props.value]);

    useEffect(() => {
        if (!isLoggedIn || !userId) {
            navigate("/login", { replace: true })
            return
        }

        const fetchOrders = async () => {
            try {
                const data = await showOrders(userId, orderStatus);
                if (!data) {
                    navigate("/error-404", { replace: true });
                    return;
                } else {
                    if (data.length === 0) {
                        setNotice("Chưa có đơn hàng");
                    }
                    setOrders(data);
                }
            } catch (error) {
                console.log({ error })
                navigate("/error-404", { replace: true });
                return;
            }
        }

        fetchOrders();
    }, [isLoggedIn, navigate, orderStatus, userId])

    return (
        <div className="container">
            {
                orders?.map((order, index) =>
                    <OrderDetail key={index} orderId={order.orderId} setIsLoading={props.setIsLoading}/>
                )
            }
            {
                notice && <p className="text-danger">{notice}</p>
            }
        </div>
    )
}

export default OrderList;