class CartItemModel{
    cartItemId:number
    quantity:number

    constructor(cartItemId:number,  quantity:number){
        this.cartItemId=cartItemId;
        this.quantity =quantity;
    }
}

export default CartItemModel;