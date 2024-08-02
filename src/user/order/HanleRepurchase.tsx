import { toast } from "react-toastify";
import fetchWithAuth from "../../layouts/utils/AuthService";

const repurchase=async(orderId:number)=>{
    const url:string=`http://localhost:8080/order/repurchase/${orderId}`
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
          toast.success("Đã tạo lại đơn hàng thành công")
          return data;
        }else{
        toast.error(data.content || "Lỗi, không thể mua lại đơn hàng")
      }
    }catch(error){
        console.error({error})
    }
}

export default repurchase;