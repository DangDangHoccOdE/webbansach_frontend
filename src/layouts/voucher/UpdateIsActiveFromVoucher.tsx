import { toast } from "react-toastify";
import VoucherModel from "../../models/VoucherModel";

export const updateVoucher=async(vouchers:VoucherModel[]):Promise<VoucherModel[]>=>{
    const updateVouchers= vouchers.map(async(voucherItem)=>{
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
    return update;
}

const handleUpdateIsActiveFromVoucher=async(voucherId:number)=>{
  try{
      const url:string=`http://localhost:8080/vouchers/updateIsActive/${voucherId}`
      const response = await fetch(url,{
          method:"PUT",
          headers:{
              "Content-type":"application/json"
          }
      })
      const data = await response.json();
      if(response.ok){
          return data;
      }else
      if(!response.ok){
          toast.error("Lỗi, không thể cập nhật trạng thái voucher!")
          return null;
      }
  }catch(error){
      console.error({error})
      toast.error("Lỗi, không thể cập nhật trạng thái voucher!")
      return null;
  }
}