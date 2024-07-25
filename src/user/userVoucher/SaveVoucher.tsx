import { useNavigate } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";
import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import useScrollToTop from "../../hooks/ScrollToTop";

interface VoucherProps{
    voucherId:number,
}
const SaveVoucher:React.FC<VoucherProps>=(props)=>{
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const userId = getUserIdByToken();
    useScrollToTop();

    const handleSaveVoucher=async(voucherId:number)=>{
        if(!isLoggedIn){
            navigate("/login")
            return;
        }
        const url:string=`http://localhost:8080/vouchers/saveVoucherByUser`
        try{
          const response = await fetchWithAuth(url,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
            },
            body:JSON.stringify({
              userId:userId,
              voucherId:voucherId
            })
          })
          const data = await response.json();
          if(response.ok){
            toast.success(data.content);
          }else{
            toast.error(data.content || "Không thể lưu voucher !")
          }
        }catch(error){
          console.log({error});
          toast.error("Lỗi, không thể lưu voucher !")
        }
      }

    useEffect(()=>{
      
    })
   
    return(
        <div className="col-2 mt-5">
        <button className="btn btn-outline-secondary" type="button" onClick={()=>handleSaveVoucher(props.voucherId)}>
            Lưu
        </button>
     </div>
    )
}

export default SaveVoucher;