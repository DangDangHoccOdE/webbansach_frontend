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
                discountPercent:responseData[key].discountPercent
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
                discountPercent:bookData.discountPercent
            }
        }else{
            throw new Error("Sách không tồn tại!")
        }

    }catch(error){
        console.log("Error: ",error);
        return null;
    }


    
}