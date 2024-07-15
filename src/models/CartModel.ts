class CartModel{
    cartId:number
    quantity:number

    constructor(cartId:number,  quantity:number){
        this.cartId=cartId;
        this.quantity =quantity;
    }
}

export default CartModel;