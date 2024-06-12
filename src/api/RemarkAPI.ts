import RemarkModel from "../models/RemarkModel";
import { my_request } from "./Request";

export async function getRemarkByBook(link:string): Promise<RemarkModel[]> {
    const result:RemarkModel[] = [];

    const response = await my_request(link);

    // get json book
    const responseData = response._embedded.remarks;

    for(const key in responseData){
            result.push({
                remarkId: responseData[key].remarkId,
                rate:responseData[key].rate,
                content: responseData[key].content
            });
    }

    return result;
}

export async function getAllRemarkByBook(bookId:number):Promise<RemarkModel[]> {
    const link:string = `http://localhost:8080/books/${bookId}/remarkList`;

    return getRemarkByBook(link);
}