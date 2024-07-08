import fetchWithAuth from "../layouts/utils/AuthService";
import WishListModel from "../models/WishListModel";

export async function getIdWishListByUser(userId:number) {
    const url:string = `http://localhost:8080/wishList/showWishList/${userId}`;

    const response = await fetchWithAuth(url);

    if(!response.ok){
        throw new Error(`Không thể truy cập ${url} !`);
    }

    const result:number[] = await response.json();
    return result;
}

export async function getWishListById(wishListId:number):Promise<WishListModel|null> {
    const url:string = `http://localhost:8080/wish-list/${wishListId}`

    try{
        const response = await fetchWithAuth(url);

        const data = await response.json();

        if(!response.ok){
            throw new Error(`Không thể truy cập ${url} !`);
        }

        if(data){
            return{
                wishListId:data.wishListId,
                wishListName:data.wishListName
            }
        }else{
            throw new Error("Danh sách yêu thích không tồn tại!");
        }
    }catch(error){
        console.log("Lỗi tải danh sách yêu thích, ",{error});
        return null;
    }


}