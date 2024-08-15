import {useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react";
import fetchWithAuth from "../utils/AuthService";
import { CheckoutFail } from "./CheckoutFail";
import { CheckoutSuccess } from "./CheckoutSuccess";


const CheckoutStatus=()=>{
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const [isSuccess,setIsSuccess] = useState(false);
    
	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	});

    const location = useLocation();
    
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const vnpResponseCode = searchParams.get("vnp_ResponseCode");
        const orderInfo = searchParams.get("vnp_OrderInfo"); // orderInfo là mã đơn hàng

        if(vnpResponseCode==="00"){  // Nếu thanh toán thành công sẽ chuyển từ trạng thái Chờ Thanh Toán thành Đang xử lý
            setIsSuccess(true);
            const url:string = `http://localhost:8080/order/confirmSuccessfullyBankOrderPayment/${orderInfo}`
            fetchWithAuth(url,{
                method:"PUT",
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					"Content-type": "application/json",
                }
            }).catch(error=>{
                console.log(error)
            })

        }
    },[location.search]);

    return <>
        {
        isSuccess ? <CheckoutSuccess/> : <CheckoutFail/>
    }
    </>
}
export default CheckoutStatus;