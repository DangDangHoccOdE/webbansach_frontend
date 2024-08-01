import fetchWithAuth from "../layouts/utils/AuthService";
import BookModel from "../models/BookModel";

interface ResultInterface{
    resultBooks:BookModel[];
    totalPages :number;
    totalBooks: number;
}

export async function getBook(link:string):Promise<ResultInterface> {
    const result:BookModel[] = [];

    const response = await fetch(link);

    if(!response.ok){
        throw new Error(`Không thể truy cập ${link}!`);
    }

         const data =await response.json();

        // get json book
        const responseData = data._embedded.books;

        // total pages
        const totalPages:number = data.page.totalPages;
        const totalBooks:number = data.page.totalElements;

        for(const key in responseData){
                result.push({
                bookId: responseData[key].bookId,
                bookName: responseData[key].bookName,
                price:responseData[key].price,
                isbn:responseData[key].isbn,
                listedPrice:responseData[key].listedPrice,
                description:responseData[key].description,
                author:responseData[key].author,
                quantity:responseData[key].quantity,
                averageRate:responseData[key].averageRate,
                soldQuantity:responseData[key].soldQuantity,
                discountPercent:responseData[key].discountPercent,
                pageNumber:responseData[key].pageNumber,
                language:responseData[key].language,
                publishingYear:responseData[key].publishingYear
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

export async function findBook(bookName:string,categoryId : number):Promise<ResultInterface> {
    let url:string=`http://localhost:8080/books?sort=bookId,desc&size=8&page=0`;

    if(bookName!=='' && categoryId===0){
        url = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookId,desc&size=8&page=0&bookName=${bookName}`
    }else if(bookName==='' && categoryId>0){
        url = `http://localhost:8080/books/search/findByCategoryList_categoryId?sort=bookId,desc&size=8&page=0&categoryId=${categoryId}`
    }else if(bookName!=='' && categoryId>0){
        url = `http://localhost:8080/books/search/findByBookNameContainingAndCategoryList_categoryId?sort=bookId,desc&size=8&page=0&bookName=${bookName}&categoryId=${categoryId}`
    }

    return getBook(url);
}

export async function getBookByBookId(bookId:number): Promise<BookModel | null> {
    const link = `http://localhost:8080/books/${bookId}`;
    
    try{
        const response = await fetch(link);

        if(!response.ok){
            throw new Error("Gặp lỗi trong quá trình gọi API Lấy sách!");
        }

        const bookData = await response.json();

        if(bookData){
            return{
                bookId: bookData.bookId,
                bookName: bookData.bookName,
                price:bookData.price,
                isbn:bookData.isbn,
                listedPrice:bookData.listedPrice,
                description:bookData.description,
                author:bookData.author,
                quantity:bookData.quantity,
                averageRate:bookData.averageRate,
                soldQuantity:bookData.soldQuantity,
                discountPercent:bookData.discountPercent,
                language:bookData.language,
                pageNumber:bookData.pageNumber,
                publishingYear:bookData.publishingYear,
            }
        }else{
            throw new Error("Sách không tồn tại!")
        }

    }catch(error){
        console.log("Error: ",error);
        return null;
    }


    
}

export async function getBookListByWishList(wishListId:number,currentPage:number):Promise<ResultInterface> {
    const link:string=`http://localhost:8080/books/search/findByWishLists_WishListId?wishListId=${wishListId}&page=${currentPage}&size=8`;

    return getBook(link);
}

export async function getBookListByCategory(categoryId:number,currentPage:number):Promise<ResultInterface> {
    const link:string=`http://localhost:8080/books/search/findByCategoryList_categoryId?categoryId=${categoryId}&page=${currentPage}&size=8`;

    return getBook(link);
}

export async function getBookByCartItem(cartItemId:number):Promise<BookModel|null> {
    const url:string = `http://localhost:8080/cart-items/${cartItemId}/books`
    try{
        const response = await fetchWithAuth(url);

        if(!response.ok){
            throw new Error("Gặp lỗi trong quá trình gọi API Lấy sách!");
        }

        const bookData = await response.json();

        if(bookData){
            return{
                bookId: bookData.bookId,
                bookName: bookData.bookName,
                price:bookData.price,
                isbn:bookData.isbn,
                listedPrice:bookData.listedPrice,
                description:bookData.description,
                author:bookData.author,
                quantity:bookData.quantity,
                averageRate:bookData.averageRate,
                soldQuantity:bookData.soldQuantity,
                discountPercent:bookData.discountPercent,
                language:bookData.language,
                pageNumber:bookData.pageNumber,
                publishingYear:bookData.publishingYear,
                
            }
        }else{
            throw new Error("Sách không tồn tại!")
        }

    }catch(error){
        console.log("Error: ",error);
        return null;
    }

}


export async function getBooksOfOrders(userId:number):Promise<BookModel[]> {
    const result:BookModel[] = [];
    const url:string=`http://localhost:8080/order/getBooksOfOrder/${userId}`
    const response = await fetchWithAuth(url);

    if(!response.ok){
        throw new Error(`Không thể truy cập api lấy sách trong đơn hàng!`);
    }

         const data =await response.json();

        for(const key in data){
                result.push({
                bookId: data[key].bookId,
                bookName: data[key].bookName,
                price:data[key].price,
                isbn:data[key].isbn,
                listedPrice:data[key].listedPrice,
                description:data[key].description,
                author:data[key].author,
                quantity:data[key].quantity,
                averageRate:data[key].averageRate,
                soldQuantity:data[key].soldQuantity,
                discountPercent:data[key].discountPercent,
                pageNumber:data[key].pageNumber,
                language:data[key].language,
                publishingYear:data[key].publishingYear
                });
    }
    return result;
}