class ReviewModel{ 
    reviewId:number;
    rate:number;
    content?:string;
    date:string;
    imageOne?:string;
    imageTwo?:string;
    imageThree?:string;
    imageFour?:string;
    imageFive?:string;
    video?:string;

    constructor( reviewId:number,
        rate:number,
        content:string,
        date:string,
        imageOne:string,
        imageTwo:string,
        imageThree:string,
        imageFour:string,
        imageFive:string,
        video:string
){
            this.reviewId = reviewId;
            this.rate = rate;
            this.content = content;
            this.date = date;
            this.imageOne = imageOne;
            this.imageTwo = imageTwo;
            this.imageThree = imageThree;
            this.imageFour = imageFour;
            this.imageFive = imageFive;
            this.video = video;
    }
}
export default ReviewModel;