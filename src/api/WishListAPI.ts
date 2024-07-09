import fetchWithAuth from "../layouts/utils/AuthService";
import WishListModel from "../models/WishListModel";

export async function getWishListByUserId(userId:number):Promise<WishListModel[]|null> {
    const url:string = `http://localhost:8080/wishList/showWishList/${userId}`

    try{
        const response = await fetchWithAuth(url);
        const result:WishListModel[] = [];
        const data = await response.json();

        if(!response.ok){
            throw new Error(`Không thể truy cập ${url} !`);
        }

        const responseData = data.wishLists;
        if(data){
            for(const key in responseData){
                result.push({
                    wishListId:responseData[key].wishListId,
                    wishListName:responseData[key].wishListName,
                    quantity:responseData[key].quantity
                })
            }

            return result;
        }else{
            throw new Error("Danh sách yêu thích không tồn tại!");
        }
    }catch(error){
        console.log("Lỗi tải danh sách yêu thích, ",{error});
        return null;
    }


}
