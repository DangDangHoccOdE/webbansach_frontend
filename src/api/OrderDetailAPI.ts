import fetchWithAuth from "../layouts/utils/AuthService";
import OrderDetailModel from "../models/OrderDetailModel";

export async function getOrderDetailsFromOrder(orderId:number) :Promise<OrderDetailModel[]>{
    const result:OrderDetailModel[] = [];

    const url:string=`http://localhost:8080/order-detail/getOrderDetailsFromOrderId/${orderId}`

    try{
        const response = await fetchWithAuth(url);

        if(!response){
            throw new Error("Không thể truy cập api lấy ra danh sách order detail")
        }

        const data = await response.json();

        for(const key in data){
            result.push({
                orderDetailId:data[key].orderDetailId,
                quantity:data[key].quantity,
                price:data[key].price,
                bookId:data[key].bookId
            })
        }
        return result;
    }catch(error){
        console.error({error})
        return []
    }
}