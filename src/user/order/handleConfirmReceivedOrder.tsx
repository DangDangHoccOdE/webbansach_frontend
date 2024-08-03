import { toast } from "react-toastify";
import fetchWithAuth from "../../layouts/utils/AuthService";

const confirmReceivedOrder=async(orderId:number):Promise<boolean>=>{
    const url:string=`http://localhost:8080/order/confirmReceivedOrder/${orderId}`
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
          toast.success("Xác nhận đơn hàng thành công")
          return true;
        }else{
        toast.error(data.content || "Lỗi, không thể xác nhận đơn hàng")
        return false;
      }
    }catch(error){
        console.error({error})
        return false;
    }
}

export default confirmReceivedOrder;