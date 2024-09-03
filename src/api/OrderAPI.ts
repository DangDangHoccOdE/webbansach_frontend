import fetchWithAuth from "../layouts/utils/AuthService";
import OrderModel from "../models/OrderModel";

interface ResultInterface{
    resultOrders:OrderModel[];
    totalPages :number;
    totalOrders: number;
}


export async function showOrders(userId:number,orderStatus:string,page:number=0):Promise<{orders:OrderModel[],hasMore:boolean} | null> {
    let url:string=``;
    const size:number  =5;
    if(orderStatus==="Đã giao"){
        url=`http://localhost:8080/orders/search/findByUser_UserIdAndDeliveryStatusContaining?userId=${userId}&deliveryStatus=${orderStatus}&sort=date,desc&page=${page}&size=${size}`;
    }else 
    if(orderStatus==="Tất cả"){
        url=`http://localhost:8080/orders/search/findByUser_UserId?userId=${userId}&sort=date,desc&page=${page}&size=${size}`;
    }else{
        url=`http://localhost:8080/orders/search/findByUser_UserIdAndOrderStatusContaining?userId=${userId}&orderStatus=${orderStatus}&sort=date,desc&page=${page}&size=${size}`;
    }

    try{
        const response = await fetchWithAuth(url);
        if(!response){
            throw new Error(`Lỗi khi gọi api danh sách đặt hàng`)
        }

        const data = await response.json();
        const responseData = data._embedded.orders;
        
        const result:OrderModel[] = filerLoop(responseData);

        const hasMore = data.page.number < data.page.totalPages - 1;

        return {orders:result, hasMore};
    }catch(error){
        console.log({error})
        return null;
    }
} 


export async function getOrderByOrderCode(orderCode:string):Promise<OrderModel|null> {
    const url:string=`http://localhost:8080/orders/search/findByOrderCode?orderCode=${orderCode}`;

    try{
        const response = await fetchWithAuth(url);
        if(!response){
            throw new Error(`Lỗi khi gọi api danh sách đặt hàng`)
        }

        const data = await response.json();

        return({
            orderId:data.orderId,
            orderCode:data.orderCode,
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
            cancelOrderTime:data.cancelOrderTime,
            reasonCancelOrder:data.reasonCancelOrder
        })
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
            orderCode:data.orderCode,
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
            cancelOrderTime:data.cancelOrderTime,
            reasonCancelOrder:data.reasonCancelOrder
        })
    }catch(error){
        console.log({error})
        return null;
    }
} 

export async function fetchAllOrders(currentPage:number):Promise<ResultInterface|null> {
    let url:string='';
    if(currentPage>=0){
        url=`http://localhost:8080/orders?sort=date,desc&size=10&page=${currentPage}`
    }
    else{
        url='http://localhost:8080/orders?sort=date,desc&size=10000';
    }

    try{
        const response = await fetchWithAuth(url);
        if(!response){
            throw new Error(`Lỗi khi gọi api danh sách đặt hàng`)
        }

        const data = await response.json();
        const responseData = data._embedded.orders;

        const totalPages:number = data.page.totalPages;
        const totalOrders:number = data.page.totalElements;

        const result:OrderModel[] = filerLoop(responseData);

        return {resultOrders:result, totalOrders:totalOrders , totalPages:totalPages};
    }catch(error){
        console.error(error)
        return null;
    }
}

const filerLoop=(responseData:any)=>{ // Tạo function cho đỡ bị lặp code
    const result:OrderModel[] = [];

    for(const key in responseData){
        result.push({
            orderId:responseData[key].orderId,
            orderCode:responseData[key].orderCode,
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
            voucherIds:responseData[key].voucherIds,
        })
    }

        return result;
}