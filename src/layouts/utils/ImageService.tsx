import { getIconImageByBook } from "../../api/ImageAPI";
import BookModel from "../../models/BookModel";
import ImageModel from "../../models/ImageModel";

export async function getAllIconImage(bookList:BookModel[]):Promise<ImageModel[]> {
    if(bookList.length>0){
        const fetchImageList = bookList.map(async (book:BookModel)=>{
            const response = await getIconImageByBook(book.bookId);
            return response;
        })

        const imageListResults = await Promise.all(fetchImageList);
        const imageValid = imageListResults.filter(image=>image!==null) as ImageModel[]
        return imageValid;
    }
    return [];
}