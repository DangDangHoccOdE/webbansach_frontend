import fetchWithAuth from "../layouts/utils/AuthService";
import OrderModel from "../models/OrderModel";

export async function showOrders(userId:number,orderStatus:string):Promise<OrderModel[]|null> {
    const url:string=`http://localhost:8080/orders/search/findByUser_UserIdAndOrderStatusContaining?userId=${userId}&orderStatus=${orderStatus}`;
    const result:OrderModel[] = [];

    try{
        const response = await fetchWithAuth(url);
        if(!response){
            throw new Error(`Lỗi khi gọi api danh sách đặt hàng`)
        }

        const data = await response.json();
        const responseData = data._embedded.orders;

        for(const key in responseData){
            result.push({
                orderId:responseData[key].orderId,
                date:responseData[key].date,
                deliveryAddress:responseData[key].deliveryAddress,
                deliveryStatus:responseData[key].deliveryStatus,
                orderStatus:responseData[key].orderStatus,
                paymentCost:responseData[key].paymentCost,
                purchaseAddress:responseData[key].purchaseAddress,
                shippingFee:responseData[key].shippingFee,
                shippingFeeVoucher:responseData[key].shippingFeeVoucher,
                totalPrice:responseData[key].totalPrice,
                totalProduct:responseData[key].totalProduct,
                noteFromUser:responseData[key].noteFromUser,
                userId:responseData[key].userId,
                cartItems:responseData[key].cartItems,
                paymentMethod:responseData[key].paymentMethod,
                deliveryMethod:responseData[key].deliveryMethod,
            })
        }
        return result;
    }catch(error){
        console.log({error})
        return null;
    }
} 

export async function getOrderByOrderId(orderId:number):Promise<OrderModel|null> {
    const url:string=`http://localhost:8080/orders/${orderId}`;

    try{
        const response = await fetchWithAuth(url);
        if(!response){
            throw new Error(`Lỗi khi gọi api danh sách đặt hàng`)
        }

        const data = await response.json();

        return({
            orderId:data.orderId,
            date:data.date,
            deliveryAddress:data.deliveryAddress,
            deliveryStatus:data.deliveryStatus,
            orderStatus:data.orderStatus,
            paymentCost:data.paymentCost,
            purchaseAddress:data.purchaseAddress,
            shippingFee:data.shippingFee,
            shippingFeeVoucher:data.shippingFeeVoucher,
            totalPrice:data.totalPrice,
            totalProduct:data.totalProduct,
            noteFromUser:data.noteFromUser,
            userId:data.userId,
            cartItems:data.cartItems,
            paymentMethod:data.paymentMethod,
            deliveryMethod:data.deliveryMethod,
        })
    }catch(error){
        console.log({error})
        return null;
    }
} 