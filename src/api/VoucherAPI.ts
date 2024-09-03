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
                describe:responseData[key].describe,
                isAvailable:responseData[key].isAvailable,
                typeVoucher:responseData[key].typeVoucher,
                minimumSingleValue:responseData[key].minimumSingleValue,
                maximumOrderDiscount:responseData[key].maximumOrderDiscount
            })
        }
        return voucher;
    }catch(error){
        return [];
    }
    
}

export async function showAllVouchers_Admin(voucherName:string,condition:string) :Promise<VoucherModel[]>{
    let url:string=`http://localhost:8080/vouchers`;
    if(voucherName!=='' && condition===''){
        url=`http://localhost:8080/vouchers/search/findByCodeContaining?code=${voucherName}`
    }else 
    if((voucherName===''||voucherName!=='') && condition==='Tất cả voucher'){
        url=`http://localhost:8080/vouchers/search/findByCodeContaining?code=${voucherName}`
    }
    else if((voucherName===''||voucherName!=='')  && condition==='Voucher hết hạn'){
        url=`http://localhost:8080/vouchers/search/findByCodeContainingAndIsActive?code=${voucherName}&isActive=false`
    }
    else if((voucherName===''||voucherName!=='')  && condition==='Voucher còn hạn'){
        url=`http://localhost:8080/vouchers/search/findByCodeContainingAndIsActive?code=${voucherName}&isActive=true`
    }
    else if((voucherName===''||voucherName!=='')  && condition==='Voucher nằm trong danh sách voucher có sẵn'){
        url=`http://localhost:8080/vouchers/search/findByCodeContainingAndIsAvailable?code=${voucherName}&isAvailable=true`
    }
    else if((voucherName===''||voucherName!=='')  && condition==='Voucher không nằm trong danh sách voucher có sẵn'){
        url=`http://localhost:8080/vouchers/search/findByCodeContainingAndIsAvailable?code=${voucherName}&isAvailable=false`
    }
    return showAllVouchers(url);
}

export async function showVouchersAvailable() :Promise<VoucherModel[]>{
    const url:string = `http://localhost:8080/vouchers/search/findByIsAvailableAndIsActive?isAvailable=true&isActive=true`;
    const voucher:VoucherModel[] = [];

    try{
        const response = await fetch(url)
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
                describe:responseData[key].describe,
                isAvailable:responseData[key].isAvailable,
                typeVoucher:responseData[key].typeVoucher,
                minimumSingleValue:responseData[key].minimumSingleValue,
                maximumOrderDiscount:responseData[key].maximumOrderDiscount,
            })
        }
        return voucher;
    }catch(error){
        return [];
    }
}

export async function showAllVouchers_User(code:string,userId:number) :Promise<VoucherModel[]|null>{
    let url:string;
    if(code===''){
        url=`http://localhost:8080/vouchers/showVoucherByUserId/${userId}`;
    }else{
        url=`http://localhost:8080/vouchers/findVoucherByVoucherCodeAndUserId/${code}/${userId}`;
    }

    const voucher:VoucherModel[] = [];

    try{
        const response = await fetchWithAuth(url)
        if(!response){
            throw new Error("Gặp lỗi trong quá trình tải voucher!")
        }
        const data = await response.json();
        if(response.ok){
            for(const key in data){
                voucher.push({
                    voucherId:data[key].voucherId,
                    code:data[key].code,
                    discountValue:data[key].discountValue,
                    expiredDate:data[key].expiredDate,
                    isActive:data[key].isActive,
                    quantity:data[key].quantity,
                    voucherImage:data[key].voucherImage,
                    describe:data[key].describe,
                    isAvailable:data[key].isAvailable,
                    typeVoucher:data[key].typeVoucher,
                    minimumSingleValue:data[key].minimumSingleValue,
                    maximumOrderDiscount:data[key].maximumOrderDiscount,
                })
            }
            return voucher;
        }else{
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }
    }catch(error){
        return null;
    }
}

export async function getVoucherQuantityFromVoucherUser(userId:number) :Promise<Map<number,number>|null>{
    let url:string=`http://localhost:8080/user-voucher/search/findByUser_UserId?userId=${userId}`;

    const userVoucher:Map<number,number> = new Map();

    try{
        const response = await fetchWithAuth(url)
        if(!response){
            throw new Error("Gặp lỗi trong quá trình tải voucher!")
        }
        const data = await response.json();

        const responseData = data._embedded.userVouchers
        if(response.ok){
            for(const key in responseData){
                userVoucher.set(
                    responseData[key].id.voucherId,responseData[key].quantity
                )
            }
        }
        return userVoucher;
    }catch(error){
        console.error(error)
        return null;
    }
}

export async function findVoucherByCodeContaining(code:string) {
    const url:string=`http://localhost:8080/vouchers/search/findByCodeContaining?code=${code}`;

    return getVoucher(url);
}

export async function getVoucherById(voucherId:number) {
    const url:string= `http://localhost:8080/vouchers/${voucherId}`

    return getVoucher(url);
}

export async function getVoucher(url:string):Promise<VoucherModel|null>{

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
            describe:data.describe,
            isAvailable:data.isAvailable,
            typeVoucher:data.typeVoucher,
            minimumSingleValue:data.minimumSingleValue,
            maximumOrderDiscount:data.maximumOrderDiscount,
        })
    }catch(error){
        console.log({error})
        return null;
    }
}

export async function getVoucherFromOrder(orderId:number):Promise<VoucherModel[]>{
    const url:string=`http://localhost:8080/orders/${orderId}/vouchers`;

    return showAllVouchers(url);
}