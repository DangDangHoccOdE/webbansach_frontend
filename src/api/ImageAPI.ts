import ImageModel from "../models/ImageModel";

export async function getImage(link:string) {
    const result:ImageModel[] = [];

    const response = await fetch(link);

    if(!response.ok){
        throw new Error(`Không thể truy cập ${link}!`);
    }

    const data = await response.json();
    const responseData = data._embedded.images;

    for(const key in responseData){
        result.push({
            imageId:responseData[key].imageId,
            icon:responseData[key].icon,
            imageData:responseData[key].imageData,
        });
    }
    
    return result;
}

export async function getAllImagesByBook(bookId:number): Promise<ImageModel[]> {
    const url:string = `http://localhost:8080/images/search/findByBook_BookId?bookId=${bookId}&sort=imageId,desc`;

    return getImage(url);
}

export async function getIconImageByBook(bookId:number):Promise<ImageModel|null> {
    const url:string= `http://localhost:8080/images/search/findByBook_BookIdAndIsIcon?bookId=${bookId}&isIcon=true`   ;
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`Không thể truy cập ${url}!`);
    }
    try{
        const data = await response.json();
        const responseData = data._embedded.images;

        return({
            imageId:responseData[0].imageId,
            icon:responseData[0].icon,
            imageData:responseData[0].imageData,
        })
    }catch(error){
        return null;
    }
}

