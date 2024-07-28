import VoucherModel from "../../models/VoucherModel";
import handleUpdateIsActiveFromVoucher from "./HandleUpdateIsActiveFromVoucher";

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
    const voucherValid = update.filter(voucher=>voucher.isActive===true) as VoucherModel[];
    return voucherValid;
}