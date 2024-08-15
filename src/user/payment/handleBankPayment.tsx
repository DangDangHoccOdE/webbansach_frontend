import fetchWithAuth from "../../layouts/utils/AuthService"
import OrderModel from "../../models/OrderModel";

export const handleBankPayment=async(order:OrderModel)=>{
    try{
        const response = await fetchWithAuth(`http://localhost:8080/payment/create-payment?amount=${order.paymentCost}&orderInfo=${order.orderCode}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
            },
        }
        );
        if(!response.ok){
            throw new Error("Không thể tiến hành thanh toán qua ngân hàng")
        }

        const paymentUrl = await response.text();
        return paymentUrl;
    }catch(error){
        console.error('Lỗi khi thanh toán qua ngân hàng:', error);
        return null;
    }
}