import CategoryModel from "../models/CategoryModel";
import { my_request } from "./Request";

export async function getCategory(link :string) {
    const result:CategoryModel[] = [];

    const response = await my_request(link);

    const responseData = response._embedded.categories;
    for(const key in responseData){
        result.push({
            categoryId: responseData[key].categoryId,
            categoryName: responseData[key].categoryName
        })
    }

    return result;
}

export async function getAllCategory():Promise<CategoryModel[]> {
    const url:string = "http://localhost:8080/category?sort=categoryId,asc";
    return getCategory(url);
}

export async function getCategoryByBook(bookId:number):Promise<CategoryModel[]> {
    const url:string = `http://localhost:8080/books/${bookId}/categoryList?sort=categoryId,asc`;
    return getCategory(url);
}