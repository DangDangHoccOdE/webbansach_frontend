import { useLocation, useNavigate } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";

const GiftVouchersToUsers:React.FC=()=>{
    const location = useLocation();
    const {selectedVouchers} = location.state as {
        selectedVouchers:number[],
    } || {selectedVouchers:[]}
    const navigate = useNavigate();

    useEffect(()=>{
        const handleGift =async()=>{
            const url:string=`http://localhost:8080/vouchers/giftVouchersToUsers`;
            console.log(JSON.stringify(selectedVouchers))
            try{
                const response  = await fetchWithAuth(url,
                    {
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                        },
                        body:JSON.stringify(selectedVouchers)
                    }
                )

                const data = await response.json();
                if(response.ok){
                    toast.success(data.content);
                }else{
                    toast.error(data.content || "Lỗi, không thể tặng voucher!");
                }
             }catch(error){
                console.log({error})
                toast.error("Lỗi, không thể tặng voucher!")
             }finally{
                navigate("/voucher/showAllVoucherAdmin");
             }
            }

            handleGift();
        },[selectedVouchers,navigate]
    )
    return(
       null
    )
}

const GiftVouchersToUsers_Admin = RequireAdmin(GiftVouchersToUsers);
export default GiftVouchersToUsers_Admin;