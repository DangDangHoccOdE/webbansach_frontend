class BookModel{
    bookId: number;
    bookName?:string ; // can be null
    price:number;
    isbn:string;
    listedPrice:number;
    description:string;
    author:string;
    quantity:number;
    averageRate:number;
    soldQuantity:number;
    discountPercent:number;
    thumbnail?:string;
    categoryList?:string[];
    relatedImage?:string[];
    pageNumber:number;
    publishingYear:number;
    language:string;
    constructor(bookId: number,
        bookName:string ,
        price:number,
        isbn:string,
        listedPrice:number,
        description:string,
        author:string,
        quantity:number,
        averageRate:number,    
        soldQuantity:number,
        discountPercent:number,
        pageNumber:number,
        publishingYear:number,
        language:string,
        thumbnail?:string,
        categoryList?:string[],
        relatedImage?:string[],
        ){
            this.bookId = bookId;
            this.bookName = bookName
            this.price = price;
            this.isbn = isbn;
            this.listedPrice = listedPrice;
            this.description = description;
            this.author = author;
            this.quantity = quantity;
            this.averageRate = averageRate;
            this.soldQuantity = soldQuantity;
            this.discountPercent = discountPercent;
            this.thumbnail = thumbnail;
            this.categoryList = categoryList;
            this.relatedImage = relatedImage;
            this.pageNumber = pageNumber;
            this.publishingYear = publishingYear;
            this.language = language;
        }
}

export default BookModel;