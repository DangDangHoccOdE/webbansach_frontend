import Category from "../models/CategoryModel";
import { my_request } from "./Request";

export async function getCategory(link :string) {
    const result:Category[] = [];

    const respones = await my_request(link);

    const responseData = respones._embedded.categories;
    for(const key in responseData){
        result.push({
            categoryId: responseData[key].categoryId,
            categoryName: responseData[key].categoryName
        })
    }

    return result;
}

export async function getAllCategory() {
    const url:string = "http://localhost:8080/category?sort=categoryId,asc";

    return getCategory(url);
}