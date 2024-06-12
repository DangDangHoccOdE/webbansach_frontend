class CategoryModel{
    categoryId: number;
    categoryName: string;

    constructor(   categoryId: number,
        categoryName: string){
            this.categoryId = categoryId;
            this.categoryName = categoryName;
        }
}

export default CategoryModel;