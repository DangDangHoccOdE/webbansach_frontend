class CartItemModel{
    cartItemId:number
    quantity:number
    createAt:string

    constructor(cartItemId:number,  quantity:number,createAt:string){
        this.cartItemId=cartItemId;
        this.quantity =quantity;
        this.createAt = createAt;
    }
}

export default CartItemModel;