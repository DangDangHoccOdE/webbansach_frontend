class DeliveryModel{
    deliveryId:number;
    deliveryName:string;
    shippingFee:number;

    constructor(
        deliveryId:number,
        deliveryName:string,
        shippingFee:number
    ){
        this.deliveryId = deliveryId;
        this.deliveryName =deliveryName;
        this.shippingFee =shippingFee;
    }
}

export default DeliveryModel;