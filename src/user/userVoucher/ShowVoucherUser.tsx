import { useEffect, useState } from "react";
import VoucherModel from "../../models/VoucherModel";
import { showAllVouchers_User } from "../../api/VoucherAPI";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { useAuth } from "../../layouts/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import VouchersProps from "../../layouts/voucher/VouchersProps";
import handleUpdateIsActiveFromVoucher from "../../layouts/voucher/HandleUpdateIsActiveFromVoucher";

const ShowVoucherUser =()=>{
    const [isLoading,setIsLoading] = useState(false);
    const [allVouchers,setAllVouchers] = useState<VoucherModel[]>([])
    const [notice,setNotice] = useState("");
    const userId = getUserIdByToken();
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!isLoggedIn || userId===undefined){
            navigate("/login",{replace:true})   
            return;         
        }
        const getVouchers = async()=>{
            setIsLoading(true);
            try{
                const fetchVouchers = await showAllVouchers_User(userId)
                if(fetchVouchers.length===0){
                    setNotice("Bạn hiện chưa có voucher nào.");
                }
                if(fetchVouchers){
                    // let counter = 0;
                    const updateVouchers= fetchVouchers.map(async(voucherItem)=>{
                        const nowDate = new Date();
                        nowDate.setDate(nowDate.getDate()-1);
                        const expiredDate = new Date(voucherItem.expiredDate);
                        if(expiredDate<nowDate && voucherItem.isActive){
                          const voucher =  await handleUpdateIsActiveFromVoucher(voucherItem.voucherId) // Cập nhật lại trạng thái voucher khi hết hạn
                          return {...voucherItem,isActive:voucher.isActive};                    
                        }
                        return voucherItem;
                    })
                    const update = await Promise.all(updateVouchers);
                    setAllVouchers(update)
                }
            }catch(error){
                console.log({error});
            }finally{
                setIsLoading(false);
            }

        }
        getVouchers();
    },[isLoggedIn, navigate, userId])

    return(
            <div className="container">
            <h1 className="mt-4 mb-4">Kho Voucher</h1>
            {isLoading && <div className="text-center"><div className="spinner-border" role="status"></div></div>} 
            <div className="d-flex justify-content-center mb-2">
                <label htmlFor="findVoucher"className="form-label me-2">Mã Voucher</label>
                <input type="text" id="findVoucher" className="form-control-sm me-2" placeholder="Nhập mã voucher của bạn vào đây"></input>
                <button type="submit" className="btn btn-secondary">Lưu</button>
            </div>
           <VouchersProps key={1} notice={notice} showQuantity={false} vouchers={allVouchers} showSaveVoucher={false}/>            
        </div>
)      
}

export default ShowVoucherUser;