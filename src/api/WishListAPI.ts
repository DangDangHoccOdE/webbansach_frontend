import fetchWithAuth from "../layouts/utils/AuthService";
import WishListModel from "../models/WishListModel";

export async function getWishListByUser(userId:number) {
    const url:string = `http://localhost:8080/users/${userId}/wishList`;

    const result:WishListModel[] = [];
    const response = await fetchWithAuth(url);

    const data = await response.json();
    if(!response.ok){
        throw new Error(`Không thể truy cập ${url} !`);
    }

    const responseData = data._embedded.wishLists;

    for(const key in responseData){
        result.push({
            wishListId:responseData[key].wishListId,
            wishListName:responseData[key].wishListName,
        })
    }

    return result;
}