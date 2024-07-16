import fetchWithAuth from "../layouts/utils/AuthService";
import CartItemModel from "../models/CartItemModel";

export async function getAllCartItemByUser(userId:number) :Promise<CartItemModel[]|null>{
    const url:string = `http://localhost:8080/users/${userId}/cartItems`
    const result:CartItemModel[] = []
    try{
        const response = await fetchWithAuth(url);
        if(!response.ok){
            throw new Error("Không thể truy cập api giỏ hàng")
        }
        const data = await response.json();
        const responseData = data._embedded.cartItems;
        if(data){
            for(const key in responseData){
                result.push({
                    cartItemId:responseData[key].cartItemId,
                    quantity:responseData[key].quantity
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

