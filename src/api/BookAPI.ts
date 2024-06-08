import BookModel from "../models/BookModel";
import { my_request } from "./Request";

interface ResultInterface{
    resultBooks:BookModel[];
    totalPages :number;
    totalBooks: number;
}

export async function getBook(link:string):Promise<ResultInterface> {
    const result:BookModel[] = [];

    const response = await my_request(link);

    // get json book
    const responseData = response._embedded.books;

    // total pages
    const totalPages:number = response.page.totalPages;
    const totalBooks:number = response.page.totalElements;

    for(const key in responseData){
            result.push({
            bookId: responseData[key].bookId,
            bookName: responseData[key].bookName,
            price:responseData[key].price,
            listedPrice:responseData[key].listedPrice,
            description:responseData[key].description,
            author:responseData[key].author,
            quantity:responseData[key].quantity,
            averageRate:responseData[key].averageRate,
            });
    }

    return {resultBooks:result, totalPages: totalPages , totalBooks: totalBooks};
}

export async function getAllBook(currentPage:number):Promise<ResultInterface> {
    const url:string=`http://localhost:8080/books?sort=bookId,desc&size=8&page=${currentPage}`;

    return getBook(url);
}

export async function getThreeBooksLatest():Promise<ResultInterface> {
    const url:string = 'http://localhost:8080/books?sort=bookId,desc&page=0&size=3';

    return getBook(url);
}