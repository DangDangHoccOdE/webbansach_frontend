import fetchWithAuth from "../layouts/utils/AuthService";
import BookModel from "../models/BookModel";
import { getIconImageByBook } from "./ImageAPI";

interface ResultInterface{
    resultBooks:BookModel[];
    totalPages :number;
    totalBooks: number;
}

export async function getBook(link:string):Promise<ResultInterface> {
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

    const result:BookModel[] = filerLoop(responseData);

    let newBookList = await fetchImageOfBooks(result);

    return {resultBooks:newBookList, totalPages: totalPages , totalBooks: totalBooks};
}

const filerLoop=(loop:any)=>{ // Tạo function cho đỡ bị lặp code
    const filer:BookModel[] = [];

    for(const key in loop){
        filer.push({
        bookId: loop[key].bookId,
        bookName: loop[key].bookName,
        price:loop[key].price,
        isbn:loop[key].isbn,
        listedPrice:loop[key].listedPrice,
        description:loop[key].description,
        author:loop[key].author,
        quantity:loop[key].quantity,
        averageRate:loop[key].averageRate,
        soldQuantity:loop[key].soldQuantity,
        discountPercent:loop[key].discountPercent,
        pageNumber:loop[key].pageNumber,
        language:loop[key].language,
        publishingYear:loop[key].publishingYear
        });
    }

        return filer;
}
export async function getAllBook(currentPage:number):Promise<ResultInterface> {
    const size:number = 8; // Giả sử số sách môi trang là 8
    const url:string=`http://localhost:8080/books?sort=bookId,desc&size=${size}&page=${currentPage}`;

    return getBook(url);
}

export async function searchBook(keyBookFind?:string,idCate?:number,filter?:number,size?:number,page?:number):Promise<ResultInterface> {
    const optionShow = `size=${size}&page=${page}`

    if(keyBookFind){
        keyBookFind = keyBookFind.trim();
    }

    // endpoint mặc định
    let endpoint:string = `http://localhost:8080/books?sort=bookId,desc&`+optionShow;

    let filterEndpoint = '';
    if(filter===1){
        filterEndpoint = "sort=bookName,asc";  // Sắp xếp tên sách A-Z
    }else if(filter===2){
        filterEndpoint = "sort=bookName,desc"; // Sắp xếp tên sách Z-A
    }else if(filter === 3){
        filterEndpoint= "sort=price,asc"; // Sắp xếp mức giá tăng dần
    }else if(filter ===4){
        filterEndpoint = "sort=price,desc"; // Sắp xếp mức giá giảm dần
    }else if(filter === 5){ 
        filterEndpoint = "sort=soldQuantity,desc"; // Sắp ếp theo số lượng đã bán giảm dần
    }

    // Nếu có từ khóa tìm kiếm và không có lọc thể loại
    if(keyBookFind!==""){
        endpoint = `http://localhost:8080/books/search/findByBookNameContaining?bookName=${keyBookFind}&`+optionShow+"&"+filterEndpoint;
    }

    // Nếu id Category !== undifined
    if(idCate!==undefined){
        // Nếu không có từ khóa tim kiếm và có lọc thể loại
        if(keyBookFind === '' && idCate > 0){
            endpoint = `http://localhost:8080/books/search/findByCategoryList_categoryId?categoryId=${idCate}&` + optionShow +"&"+filterEndpoint
        }else if(keyBookFind !== '' && idCate > 0){ // Nếu có từ khóa tìm kiếm và lọc thể loại
            endpoint = `http://localhost:8080/books/search/findByBookNameContainingAndCategoryList_categoryId?bookName=${keyBookFind}&categoryId=${idCate}&` + optionShow +"&"+ filterEndpoint
        }

        // Chỉ có lọc filter
        if(keyBookFind === '' && (idCate ===0 || typeof(idCate) === "string") && filter){
            endpoint = `http://localhost:8080/books?`+optionShow+"&"+filterEndpoint
        }
        
    }

    return getBook(endpoint)

}

export async function getBookByBookId(bookId:number): Promise<BookModel | null> {
    const link = `http://localhost:8080/books/${bookId}`;
    
    try{
        const response = await fetch(link);

        if(!response.ok){
            throw new Error("Gặp lỗi trong quá trình gọi API Lấy sách!");
        }

        const bookData = await response.json();
        const image = await getIconImageByBook(bookData.bookId);

        if(!image){
            throw new Error("Lỗi tải ảnh")
        }
      
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
                thumbnail:image.imageData
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
    const link:string=`http://localhost:8080/books/getBookFromWishList/${wishListId}?page=${currentPage}&size=8`;

    const response = await fetchWithAuth(link);

    if(!response.ok){
        throw new Error(`Không thể truy cập ${link}!`);
    }

         const data =await response.json();

        // get json book
        const responseData = data.content;

        // total pages
        const totalPages:number = data.totalPages;
        const totalBooks:number = data.totalElements;

        const result:BookModel[] = filerLoop(responseData);

    let newBookList = await fetchImageOfBooks(result);

    return {resultBooks:newBookList, totalPages: totalPages , totalBooks: totalBooks};
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

        const image = await getIconImageByBook(bookData.bookId);

        if(!image){
            throw new Error("Lỗi tải ảnh")
        }

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
                thumbnail:image.imageData
            }
        }else{
            throw new Error("Sách không tồn tại!")
        }

    }catch(error){
        console.log("Error: ",error);
        return null;
    }

}


export async function getBooksOfOrders(orderId:number):Promise<BookModel[]> {
    const url:string=`http://localhost:8080/order/getBooksOfOrder/${orderId}`
    const response = await fetchWithAuth(url);

    if(!response.ok){
        throw new Error(`Không thể truy cập api lấy sách trong đơn hàng!`);
    }

         const data =await response.json();

         const result:BookModel[] = filerLoop(data);
    let newBookList = await fetchImageOfBooks(result);

    return newBookList;
}

const fetchImageOfBooks=async(books:any)=>{
    let newBookList = await Promise.all(books.map(async (book: any) => {
        // Trả về quyển sách
        const thumbnail = await getIconImageByBook(book.bookId);
        return {
           ...book,
           thumbnail: thumbnail ? thumbnail.imageData : null,
        };
     }));

     return newBookList;
}

export async function getNumberOfBook(): Promise<number> {
    const url: string = `http://localhost:8080/books/search/countBy`;
     try {
        const response = await fetchWithAuth(url);
        const data = await response.json();
        if (data) {
           return data;
        }
     } catch (error) {
        throw new Error("Lỗi không gọi được endpoint lấy tổng sách\n" + error);
     }
     return 0;
  }


  export async function get5BestSellerBooks(): Promise<BookModel[]> {
    const url:string=`http://localhost:8080/books?sort=soldQuantity,desc&size=5`;   
    let bookList = await getBook(url);
 
    // Use Promise.all to wait for all promises in the map to resolve
    let newBookList = await fetchImageOfBooks(bookList.resultBooks);
    return newBookList;
 }

 export async function getHotBook(): Promise<ResultInterface> {
    // Xác định endpoint
    const endpoint: string = "http://localhost:8080/books?sort=averageRate,desc&size=4";
 
    return getBook(endpoint);
 }
 
 export async function getNewBook(): Promise<ResultInterface> {
    // Xác định endpoint
    const endpoint: string = "http://localhost:8080/books?sort=bookId,desc&size=4";
 
    return getBook(endpoint);
 }