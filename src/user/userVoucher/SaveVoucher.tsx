import { useNavigate } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";
import { useEffect, useState } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import useScrollToTop from "../../hooks/ScrollToTop";
import { showAllVouchers_User } from "../../api/VoucherAPI";

interface VoucherProps{
    voucherId:number,
}
const SaveVoucher:React.FC<VoucherProps>=(props)=>{
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const userId = getUserIdByToken();
    const [isVoucherSaved,setIsVoucherSaved] = useState(false)
    useScrollToTop();

    useEffect(()=>{ // Lấy ra voucher của user => Check xem voucherId đã nằm trong voucher này chưa để hiển thị đã lưu hay lưu
            if(!isLoggedIn || userId===undefined){
              navigate("/login",{replace:true})   
              return;         
            }
          const getVouchers = async()=>{
              try{
                  const fetchVouchers = await showAllVouchers_User(userId,'')
                  if(fetchVouchers){
                        const check =  fetchVouchers.some(voucher=>voucher.voucherId === props.voucherId);
                        setIsVoucherSaved(check);
                  }
              }catch(error){
                  console.log({error});
              }
          }
          getVouchers();
    },[isLoggedIn, navigate, props.voucherId, userId,isVoucherSaved])

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
            setIsVoucherSaved(true);
          }else{
            toast.error(data.content || "Không thể lưu voucher !")
          }
        }catch(error){
          console.log({error});
          toast.error("Lỗi, không thể lưu voucher !")
        }
      }

   
    return(
        <div className="col-2 mt-5">
          {isVoucherSaved ? 
              <div>
                    <button className="btn btn-outline-primary" type="button" disabled>
                        Đã Lưu
                    </button>
              </div> : 
              <div>
                  <button className="btn btn-outline-secondary" type="button" onClick={()=>handleSaveVoucher(props.voucherId)}>
                        Lưu
                    </button>
              </div>  
        }
      
     </div>
    )
}

export default SaveVoucher;