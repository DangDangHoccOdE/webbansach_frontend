class PaymentModel{
    paymentId:number;
    paymentName:string;

    constructor(    paymentId:number,
        paymentName:string){
        this.paymentId = paymentId;
        this.paymentName = paymentName;
    }
}

export default PaymentModel;