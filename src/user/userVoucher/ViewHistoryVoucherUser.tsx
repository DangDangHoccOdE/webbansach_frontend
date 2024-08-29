import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import VoucherModel from "../../models/VoucherModel";
import { useNavigate } from "react-router-dom";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { getVoucherQuantityFromVoucherUser, showAllVouchers_User } from "../../api/VoucherAPI";
import VouchersProps from "../../layouts/voucher/VouchersProps";

const ViewHistoryVoucherUser=()=>{
    const {isLoggedIn} = useAuth();
    const [vouchers,setVouchers] = useState<VoucherModel[]>([]);
    const navigate = useNavigate();
    const userId = getUserIdByToken();
    const [isLoading,setIsLoading] = useState(false)
    const [voucherQuantity,setVoucherQuantity] = useState<Map<number,number>>(new Map());
    const [notice,setNotice] = useState("");

    useEffect(()=>{
        if(!isLoggedIn || !userId){
            navigate("/login",{replace:true});
            return
        }

        setIsLoading(true)
        Promise.all([showAllVouchers_User("",userId),getVoucherQuantityFromVoucherUser(userId)])
            .then(([responseVoucher,responseMapQuantity])=>{
                // Lọc ra những voucher nào hết hạn hoặc đã sử dụng
                const voucherFilter = responseVoucher.filter(v=>(responseMapQuantity?.get(v.voucherId)??0) <= 0 || !v.isActive)
                if(voucherFilter.length===0){
                    setNotice("Danh sách voucher trống!");
                }
                setNotice("")
                setVouchers(voucherFilter);
                if(!responseMapQuantity){
                    navigate("/error-404",{replace:true});
                    return;
                }
                setVoucherQuantity(responseMapQuantity);
            })
            .catch(error=>{
                console.error(error)
                navigate("/error-404",{replace:true})
            })
            .finally(
                ()=>setIsLoading(false)
            )
    },[isLoggedIn, navigate, userId])

    if(!isLoggedIn){
        return null;
    }

    if(isLoading){
        return(
            <div className="text-center mt-3">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Đang tải...</span>
            </div>
        </div>
        )
    } 

    return(
        <div>
            <h1 className="text-center mt-3 mb-3">Lịch Sử Voucher</h1>
            <VouchersProps notice={notice} showQuantity={voucherQuantity} showSaveVoucher={false} vouchers={vouchers} showRelateHistoryVoucher={true}/>
        </div>
    )
}

export default ViewHistoryVoucherUser;