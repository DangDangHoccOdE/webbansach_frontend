import fetchWithAuth from "../layouts/utils/AuthService";
import OrderReview from "../models/OrderReviewModel";

export async function getOrderReviewByOrder(orderId: number): Promise<OrderReview|null> {
    const url: string = `http://localhost:8080/orders/${orderId}/orderReview`;
    try {
        const response = await fetchWithAuth(url);

        if (!response.ok) {
            throw new Error(`Không thể truy cập API lấy đánh giá! Status: ${response.status}`);
        }

        const data = await response.json();

        return{
                orderReviewId: data.orderReviewId,
                deliveryRate: data.deliveryRate,
                shopRate: data.shopRate,
    };
    } catch (error) {
        // Log lỗi hoặc xử lý tùy thuộc vào tình huống
        console.error(error);
        return null;
    }

}

export async function getNumberOfOrderReview(): Promise<number> {
    const url: string = `http://localhost:8080/order-review/search/countBy`;
     try {
        const response = await fetchWithAuth(url);
        const data = await response.json();
        if (data) {
           return data;
        }
     } catch (error) {
        throw new Error("Lỗi không gọi được endpoint lấy tổng đánh giá shop\n" + error);
     }
     return 0;
  }
  
  export async function getNumberOfStarShop() {
    const url:string=`http://localhost:8080/order-review/findTotalReviewShop`;
    const response = await fetchWithAuth(url);

    if(!response.ok){
        throw new Error(`Không thể truy cập api lấy số lượng đánh giá từng sao`);
    }

    const data =await response.json();

    return data;
}
  export async function getNumberOfStarDelivery() {
    const url:string=`http://localhost:8080/order-review/findTotalReviewDelivery`;
    const response = await fetchWithAuth(url);

    if(!response.ok){
        throw new Error(`Không thể truy cập api lấy số lượng đánh giá từng sao`);
    }

    const data =await response.json();

    return data;
}

