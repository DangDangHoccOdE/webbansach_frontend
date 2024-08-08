import ReviewModel from "../models/ReviewModel";

interface ResultInterface{
    resultReviews:ReviewModel[];
    totalPages :number;
    totalReviews: number;
}

export async function getReviewByBook(link:string): Promise<ResultInterface> {
    const result:ReviewModel[] = [];

    const response = await fetch(link);

    if(!response.ok){
        throw new Error(`Không thể truy cập api lấy đánh giá!`);
    }

    const data =await response.json();
    // get json reviews
    const responseData = data._embedded.reviews;

    // total pages
    const totalPages:number = data.page.totalPages;
    const totalReviews:number = data.page.totalElements;

    for(const key in responseData){
            result.push({
                reviewId: responseData[key].reviewId,
                rate:responseData[key].rate,
                content: responseData[key].content,
                date:responseData[key].date,
                imageOne: responseData[key].imageOne,
                imageTwo:  responseData[key].imageTwo,
                imageThree:  responseData[key].imageThree,
                imageFour:  responseData[key].imageFour,
                imageFive:  responseData[key].imageFive,
                video:responseData[key].video
            });
    }

    return {resultReviews:result, totalPages: totalPages, totalReviews:totalReviews};
}

export async function getAllReviewsByRateAndBookId(rate:number,bookId:number,currentPage:number):Promise<ResultInterface> {
    const size:number=5;
    let url:string=`http://localhost:8080/reviews/search/findByBook_BookId?bookId=${bookId}&size=${size}&sort=date,desc&page=${currentPage}`;
    if(1<=rate && rate<=5){
        url = `http://localhost:8080/reviews/search/findByRateAndBook_BookId?rate=${rate}&bookId=${bookId}&sort=date,desc&page=${currentPage}&size=${size}`;
    }

    return getReviewByBook(url);
}

export async function getNumberOfReviewByBookId(bookId:number):Promise<number> {
    const link:string = `http://localhost:8080/books/${bookId}/reviewList`;

    const response = await fetch(link);

    if(!response.ok){
        throw new Error(`Không thể truy cập truy cập api lấy số lượng đánh giá!`);
    }

    const data =await response.json();
    // get json book
    const responseData = data._embedded.reviews as ReviewModel[];


    return responseData.length;
}

export async function getNumberOfStar(bookId:number) {
    const url:string=`http://localhost:8080/review/getNumberOfStarReview/${bookId}`;
    const response = await fetch(url);

    if(!response.ok){
        throw new Error(`Không thể truy cập api lấy số lượng đánh giá từng sao`);
    }

    const data =await response.json();

    return data;
}