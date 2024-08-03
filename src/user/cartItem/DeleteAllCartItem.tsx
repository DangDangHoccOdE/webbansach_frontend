
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";

export const deleteAllCartItemsIsChoose = async(allCartItemIsChoose:number[]):Promise<boolean> => {
        const url:string = `http://localhost:8080/cart-items/deleteAllCartItemsIsChoose`;

        try{
                const response = await fetchWithAuth(url,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify(
                        allCartItemIsChoose
                    )
                });
                const data = await response.json();
                if(response.ok){
                    toast.success(data.content);
                    return true
                }else{
                    toast.error(data.content || "Lỗi không thể xóa sách giỏ hàng");
                    return false;
                }
            }catch(error){
                console.log({error})
                return false;
            }
}

