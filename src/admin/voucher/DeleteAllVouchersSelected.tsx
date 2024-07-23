import { useLocation, useNavigate } from "react-router-dom"
import RequireAdmin from "../RequireAdmin"
import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";

const DeleteAllVouchersSelected:React.FC=()=>{
    const location = useLocation();
    const {selectedVouchers} = location.state as {
        selectedVouchers:number[]} || {selectedVouchers:[]}
        const navigate = useNavigate();

    useEffect(()=>{
        const deleteSelected= async()=>{
            const url:string = `http://localhost:8080/vouchers/deleteVouchersSelected`;
            try{
                const response = await fetchWithAuth(url,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify(selectedVouchers)
                })
                const data = await response.json();

                if(response){
                    toast.success(data.content);
                }else{
                    toast.error(data.content || "Lỗi không thể xóa voucher đã chọn!");
                }
            }catch(error){
                console.log({error})
                toast.error("Lỗi, không thể xóa voucher đã chọn!");
            }finally{
                navigate("/voucher/showAllVoucherAdmin")
            }
        }
        deleteSelected();
       
    },[selectedVouchers,navigate])
    return(
      null
    )
}

const DeleteAllVouchersSelected_Admin = RequireAdmin(DeleteAllVouchersSelected);
export default DeleteAllVouchersSelected_Admin;