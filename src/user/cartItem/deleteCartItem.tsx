
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";

export const deleteCartItem =async (cartItemId:number):Promise<boolean> => {
        const url:string = `http://localhost:8080/cart-items/deleteCartItem/${cartItemId}`;

            try{
                const response = await fetchWithAuth(url,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
                const data = await response.json();
                if(response.ok){
                    toast.success(data.content);
                    return true;
                }else{
                    toast.error(data.content || "Lỗi không thể xóa sách giỏ hàng");
                    return false;
                }
            }catch(error){
                console.log({error})
                return false;
            }
}

