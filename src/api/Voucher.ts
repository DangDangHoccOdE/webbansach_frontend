import fetchWithAuth from "../layouts/utils/AuthService"
import VoucherModel from "../models/VoucherModel";

export async function showAllVouchers(url:string) :Promise<VoucherModel[]>{
    const voucher:VoucherModel[] = [];

    try{
        const response = await fetchWithAuth(url)
        if(!response){
            throw new Error("Gặp lỗi trong quá trình tải voucher!")
        }
        const data = await response.json();
        const responseData = data._embedded.vouchers;
        for(const key in responseData){
            voucher.push({
                voucherId:responseData[key].voucherId,
                code:responseData[key].code,
                discountValue:responseData[key].discountValue,
                expiredDate:responseData[key].expiredDate,
                isActive:responseData[key].isActive,
                quantity:responseData[key].quantity,
                voucherImage:responseData[key].voucherImage,
                describe:responseData[key].describe
            })
        }
        return voucher;
    }catch(error){
        return [];
    }
    
}

export async function showAllVouchers_Admin() :Promise<VoucherModel[]>{
    const url:string=`http://localhost:8080/vouchers`;
    return showAllVouchers(url);
}

export async function getVoucherById(voucherId:number):Promise<VoucherModel|null>{
    const url:string= `http://localhost:8080/vouchers/${voucherId}`

    try{
        const response = await fetchWithAuth(url);
        if(!response){
            throw new Error("Không thể lấy được voucher!");
        }
        const data =await response.json();
        return({
            voucherId:data.voucherId,
            code:data.code,
            discountValue:data.discountValue,
            expiredDate:data.expiredDate,
            isActive:data.isActive,
            quantity:data.quantity,
            voucherImage:data.voucherImage,
            describe:data.describe
        })
    }catch(error){
        console.log({error})
        return null;
    }
}
