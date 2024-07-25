import { useLocation, useNavigate } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import useScrollToTop from "../../hooks/ScrollToTop";
import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";

const AddVouchersToVoucherAvailable:React.FC=()=>{
    const navigate = useNavigate();
    const location= useLocation();
    const {selectedVouchers} = location.state as {
        selectedVouchers:number[]
    } || {selectedVouchers:[]}
    
    useScrollToTop();

    useEffect(()=>{
        const url:string=`http://localhost:8080/vouchers/addVouchersToVoucherAvailable`
        const handleAdd = async()=>{
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
                console.log(data)
                if(response.ok){
                    toast.success(data.content)
                }else{
                    toast.error(data.content || "Lỗi không thể thêm vào danh sách voucher có sẵn!")
                }
            }catch(error){
                console.log({error});
                toast.error("Lỗi không thể thêm vào danh sách voucher có sẵn!");
            }finally{
                navigate("/voucher/showAllVoucherAdmin",{replace:true});
            }
        }
        handleAdd();
    },[selectedVouchers,navigate])
    return(
        null
    )
}

const AddVouchersToVoucherAvailable_Admin = RequireAdmin(AddVouchersToVoucherAvailable);
export default AddVouchersToVoucherAvailable_Admin;