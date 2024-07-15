import ReviewModel from "../models/ReviewModel";
import FeedbackModel from "../models/ReviewModel";

export async function getReviewByBook(link:string): Promise<ReviewModel[]> {
    const result:FeedbackModel[] = [];

    const response = await fetch(link);

    if(!response.ok){
        throw new Error(`Không thể truy cập ${link}!`);
    }

    const data =await response.json();
    // get json book
    const responseData = data._embedded.reviews;


    for(const key in responseData){
            result.push({
                reviewId: responseData[key].reviewId,
                rate:responseData[key].rate,
                content: responseData[key].content
            });
    }

    return result;
}

export async function getAllReviewByBook(bookId:number):Promise<FeedbackModel[]> {
    const link:string = `http://localhost:8080/books/${bookId}/reviewList`;

    return getReviewByBook(link);
}