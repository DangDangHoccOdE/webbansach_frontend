class CategoryModel{
    categoryId: number;
    categoryName: string;
    bookQuantity:number

    constructor(   categoryId: number,
        categoryName: string,
        bookQuantity:number){
            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.bookQuantity = bookQuantity;
        }
}

export default CategoryModel;