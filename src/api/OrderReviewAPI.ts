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
