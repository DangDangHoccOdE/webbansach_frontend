import fetchWithAuth from "../layouts/utils/AuthService";
import CartItemModel from "../models/CartItemModel";

export async function getAllCartItemByUser(userId:number) :Promise<CartItemModel[]|null>{
    const url:string = `http://localhost:8080/cart-items/findCartItemsByUserId/${userId}?page=0&size=10&sort=createdAt&direction=desc`
    const result:CartItemModel[] = []
    try{
        const response = await fetchWithAuth(url);
        if(!response.ok){
            throw new Error("Không thể truy cập api giỏ hàng")
        }
        const data = await response.json();
        const responseData = data.content;
        if(data){
            for(const key in responseData){
                result.push({
                    cartItemId:responseData[key].cartItemId,
                    quantity:responseData[key].quantity,
                    createAt:responseData[key].createAt
                })
            }
            return result;
        }else{
            throw new Error("Giỏ hàng không tồn tại!")
        }
   
    }catch(error){
        console.log({error})
        return null;
    }
}

export async function getCartItemById(cartItemId:number) :Promise<CartItemModel|null>{
    const url:string = `http://localhost:8080/cart-items/${cartItemId}`
    try{
        const response = await fetchWithAuth(url);
        if(!response.ok){
            throw new Error("Không thể truy cập api giỏ hàng")
        }
        const data = await response.json();
        if(data){
                return({
                    cartItemId:data.cartItemId,
                    quantity:data.quantity,
                    createAt:data.createAt
                })    
        }else{
            throw new Error("Giỏ hàng không tồn tại!")
        }
   
    }catch(error){
        console.log({error})
        return null;
    }
}

