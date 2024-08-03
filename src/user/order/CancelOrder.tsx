import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";

const cancelOrder=async(orderId:number)=>{

        const url:string=`http://localhost:8080/order/cancelOrder/${orderId}`
            try{
              const response = await fetchWithAuth(url,{
                method:"PUT",
                  headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
                  }
              })
    
              const data = await response.json();
              if(response.ok){
                  toast.success(data.content)
                  return true;
                }else{
                toast.error(data.content || "Lỗi, không thể hủy đơn")
                return false;
              }
            }catch(error){
                console.error({error})
                return false;
            }
}

export default cancelOrder;