import CategoryModel from "../models/CategoryModel";

export async function getCategory(link :string) {
    const result:CategoryModel[] = [];

    const response = await fetch(link);
    if(!response.ok){
        throw new Error(`Không thể truy cập ${link}!`);
    }

    const data =await response.json();
    const responseData = data._embedded.categories;
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