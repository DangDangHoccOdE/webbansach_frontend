import ImageModel from "../models/ImageModel";
import { my_request } from "./Request";

export async function getImage(link:string) {
    const result:ImageModel[] = [];

    const response = await my_request(link);
    const responseData = response._embedded.images;

    for(const key in responseData){
        result.push({
            imageId:responseData[key].imageId,
            imageName:responseData[key].imageName,
            isIcon:responseData[key].isIcon,
            link:responseData[key].link,
            imageData:responseData[key].imageData,
        });
    }
    
    return result;
}

export async function getAllImagesByBook(bookId:number): Promise<ImageModel[]> {
    const url:string = `http://localhost:8080/books/${bookId}/imageList`;

    return getImage(url);
}

export async function getOneImageByBook(bookId:number):Promise<ImageModel[]> {
    const url:string= `http://localhost:8080/books/${bookId}/imageList?sort=imageId,,asc&pazge=0&size=1`   ;
    
    return getImage(url);
}

