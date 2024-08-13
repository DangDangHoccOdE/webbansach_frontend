class OrderReviewModal{
    orderReviewId:number;
    deliveryRate:number;
    shopRate:number;
    constructor(    orderReviewId:number,
        deliveryRate:number,
        shopRate:number){
            this.orderReviewId = orderReviewId;
            this.deliveryRate = deliveryRate;
            this.shopRate = shopRate;
        }
}

export default OrderReviewModal;