class PaymentModel{
    paymentId:number;
    paymentName:string;
    price:number;

    constructor(    paymentId:number,
        paymentName:string,
        price:number){
        this.paymentId = paymentId;
        this.paymentName = paymentName;
        this.price = price;
    }
}

export default PaymentModel;