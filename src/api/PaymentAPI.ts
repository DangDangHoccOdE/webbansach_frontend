import fetchWithAuth from "../layouts/utils/AuthService";
import PaymentModel from "../models/PaymentModel";

export async function getPaymentByOrderId(orderId:number):Promise<PaymentModel|null> {
    const url:string=`http://localhost:8080/payment/findPaymentByOrderId?orderId=${orderId}`;

    try{
        const response = await fetchWithAuth(url);
        if(!response){
            throw new Error("Lỗi, không thể gọi api lấy phương thức thanh toán từ đơn đặt hàng");
        }

        
        const data = await response.json();
        return({
            paymentId:data.paymentId,
            paymentName:data.paymentName,
        })
    }catch(error){
        console.error(error);
        return null;
    }
}