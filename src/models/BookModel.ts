class BookModel{
    bookId: number;
    bookName?:string ; // can be null
    price:number;
    listedPrice:number;
    description:string;
    author:string;
    quantity:number;
    averageRate?:number;
    soldQuantity:number;
    discountPercent:number;
    thumbnail?:string;
    categoryList?:string[];
    relatedImage?:string[];

    constructor(bookId: number,
        bookName:string ,
        price:number,
        listedPrice:number,
        description:string,
        author:string,
        quantity:number,
        averageRate:number,    
        soldQuantity:number,
        discountPercent:number,
        thumbnail?:string,
        categoryList?:string[],
        relatedImage?:string[]){
            this.bookId = bookId;
            this.bookName = bookName
            this.price = price;
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
        }
}

export default BookModel;