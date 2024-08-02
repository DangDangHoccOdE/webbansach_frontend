import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CancelOrder=()=>{
    const navigate = useNavigate();
    const {orderId} = useParams(); 

    useEffect(()=>{
        console.log("de")
        const handleCancelOrder=async()=>{
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
              console.log(data)
              if(response.ok){
                  toast.success(data.content)
                  navigate("/user/showOrder")
              }else{
                toast.error(data.content || "Lỗi, không thể hủy đơn")
              }
            }catch(error){
                console.error({error})
            }finally{
                navigate("/user/showOrder")
            }

          }
          handleCancelOrder();
        },[navigate, orderId])

        return(
            null
        )
}

export default CancelOrder;