import RemarkModel from "../models/RemarkModel";

export async function getRemarkByBook(link:string): Promise<RemarkModel[]> {
    const result:RemarkModel[] = [];

    const response = await fetch(link);

    if(!response.ok){
        throw new Error(`Không thể truy cập ${link}!`);
    }

    const data =await response.json();
    // get json book
    const responseData = data._embedded.remarks;


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