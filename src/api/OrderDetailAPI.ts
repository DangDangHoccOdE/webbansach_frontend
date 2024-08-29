import fetchWithAuth from "../layouts/utils/AuthService";
import OrderDetailModel from "../models/OrderDetailModel";

export async function getOrderDetailsFromOrder(orderId:number,currentPage:number=0) :Promise<{orderDetails:OrderDetailModel[],hasMore:boolean} | null>{
    const size:number = 3;
    const result:OrderDetailModel[] = [];

    const url:string=`http://localhost:8080/order-detail/search/findByOrder_OrderId?orderId=${orderId}&size=${size}&page=${currentPage}`

    try{
        const response = await fetchWithAuth(url);
        
        if(!response){
            throw new Error("Không thể truy cập api lấy ra danh sách order detail")
        }

        const data = await response.json();
        const responseData = data._embedded.orderDetails;

        for(const key in responseData){
            result.push({
                orderDetailId:responseData[key].orderDetailId,
                quantity:responseData[key].quantity,
                price:responseData[key].price,
                bookId:responseData[key].bookId
            })
        }
        
        const hasMore = data.page.number < data.page.totalPages - 1;

        return {orderDetails:result, hasMore};
    }catch(error){
        console.error({error})
        return null
    }
}