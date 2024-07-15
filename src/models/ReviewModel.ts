class ReviewModel{ 
    reviewId:number;
    rate:number;
    content:string;

    constructor( reviewId:number,
        rate:number,
        content:string,){
            this.reviewId = reviewId;
            this.rate = rate;
            this.content = content;

    }
}
export default ReviewModel;