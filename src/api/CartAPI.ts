import fetchWithAuth from "../layouts/utils/AuthService";
import CartModel from "../models/CartModel";

export async function showCart(userId:number) :Promise<CartModel|null>{
    const url:string = `http://localhost:8080/users/${userId}/cart`

    try{
        const response = await fetchWithAuth(url);
        if(!response.ok){
            throw new Error("Không thể truy cập api giỏ hàng")
        }
        const data = await response.json();
        if(data){
            return({
                cartId:data.cartId,
                quantity:data.quantity
            })
        }else{
            throw new Error("Giỏ hàng không tồn tại!")
        }
   
    }catch(error){
        console.log({error})
        return null;
    }
}

