class BookModel{
    bookId: number;
    bookName?:string ; // can be null
    price:number;
    listedPrice:number;
    description:string;
    author:string;
    quantity:number;
    averageRate?:number;

    constructor(bookId: number,
        bookName:string ,
        price:number,
        listedPrice:number,
        description:string,
        author:string,
        quantity:number,
        averageRate:number){
            this.bookId = bookId;
            this.bookName = bookName
            this.price = price;
            this.listedPrice = listedPrice;
            this.description = description;
            this.author = author;
            this.quantity = quantity;
            this.averageRate = averageRate;
        }
}

export default BookModel;