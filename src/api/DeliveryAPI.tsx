import fetchWithAuth from "../layouts/utils/AuthService";
import DeliveryModel from "../models/DeliveryModel";

export async function getDeliveryByOrder(orderId:number):Promise<DeliveryModel|null> {
    const url:string=`http://localhost:8080/delivery/findDeliveryByOrderId?orderId=${orderId}`;

    try{
        const response = await fetchWithAuth(url);
        if(!response){
            throw new Error("Lỗi, không thể gọi api lấy phương thức giao hàng từ đơn đặt hàng");
        }

        
        const data = await response.json();
        return({
            deliveryId:data.deliveryId,
            deliveryName:data.deliveryName,
            shippingFee:data.shippingFee,
        })
    }catch(error){
        console.error(error);
        return null;
    }
}