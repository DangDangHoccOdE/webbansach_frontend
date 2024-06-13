import UserModel from "../models/UserModel";

export async function getUser(link:string): Promise<UserModel|null> {
    try{
        const response = await fetch(link);

        if(!response.ok){
            throw new Error("Gặp lỗi trong quá trình gọi API Lấy thông tin người đánh giá!");
        }

        // get json user
        const userData = await response.json();
    
        if(userData){
            return{
                userId:userData.useId,
                firstName:userData.firstName,
                lastName:userData.lastName,
                userName:userData.userName,
                phoneNumber:userData.phoneNumber,
                password:userData.password,
                sex:userData.sex,
                email:userData.email,
                deliveryAddress:userData.deliveryAddress,
                purchaseAddress:userData.purchaseAddress,
            }
        }else{
            throw new Error("Người dùng không tồn tại!")
        }
    }catch(error){
        console.log("Error: ",error);
        return null;
    }
}

export async function getUserByRemark(remarkId:number):Promise<UserModel|null> {
    const url:string=`http://localhost:8080/remarks/${remarkId}/user`

    return getUser(url);
}