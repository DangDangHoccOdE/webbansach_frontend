
class OrderModel{
    orderId:number;
    date:Date;
    deliveryAddress:string;
    deliveryStatus?:string;
    orderStatus?:string;
    paymentCost:number;
    purchaseAddress?:string;
    shippingFee:number;
    totalPrice:number;
    totalProduct:number;
    noteFromUser:string;
    userId:number;
    cartItems:number[];
    paymentMethod:string;
    deliveryMethod:string;

    constructor(    orderId:number,
        date:Date,
        deliveryAddress:string,
        deliveryStatus:string,
        orderStatus:string,
        paymentCost:number,
        purchaseAddress:string,
        shippingFee:number,
        totalPrice:number,
        totalProduct:number,
        noteFromUser:string,
        userId:number,
        cartItems:number[],
        paymentMethod:string,
        deliveryMethod:string,){
            this.orderId = orderId;
            this.date =date;
            this.deliveryAddress =deliveryAddress;
            this.deliveryStatus = deliveryStatus;
            this.orderStatus = orderStatus;
            this.paymentCost = paymentCost;
            this.purchaseAddress = purchaseAddress;
            this.shippingFee = shippingFee;
            this.totalPrice = totalPrice;
            this.totalProduct = totalProduct;
            this.noteFromUser = noteFromUser;
            this.userId = userId;
            this.cartItems = cartItems;
            this.paymentMethod = paymentMethod;
            this.deliveryMethod = deliveryMethod
        }
}

export default OrderModel;