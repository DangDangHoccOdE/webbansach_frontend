class OrderDetailModel{
    orderDetailId:number;
    price:number;
    quantity:number;
    bookId:number

    constructor( orderDetailId:number,
        price:number,
        quantity:number,
        bookId:number){
        this.orderDetailId = orderDetailId;
        this.price=price;
        this.quantity=quantity;
        this.bookId=bookId;
    }
}

export default OrderDetailModel;