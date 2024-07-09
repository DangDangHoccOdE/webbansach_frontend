class WishListModel{
    wishListId:number;
    wishListName:string;
    quantity:number

    constructor(wishListId:number,wishListName:string,quantity:number){
        this.wishListId = wishListId;
        this.wishListName = wishListName;
        this.quantity=quantity
    }

}

export default WishListModel;