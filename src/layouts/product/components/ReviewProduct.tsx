import React, { useEffect, useState } from "react";
import FeedbackModel from "../../../models/ReviewModel";
import {getAllReviewByBook } from "../../../api/ReviewAPI";
import UserInfo from "./UserInfo";
import renderRating from "../../utils/StarRate";
import useScrollToTop from "../../../hooks/ScrollToTop";

interface ReviewProductProps{
    bookId: number;
}

const ReviewProduct: React.FC<ReviewProductProps> = (props) => {
    const bookId = props.bookId;

    const [reviewList,setReviewList] = useState<FeedbackModel[]>([]);
    const [loadingData,setLoadingData] = useState(true);
    const [noticeError,setNoticeError] = useState(null);

    useScrollToTop();
    useEffect(()=>{
        getAllReviewByBook(bookId)
            .then(reviewList => {
                setReviewList(reviewList);
                setLoadingData(false);
            })
            .catch(error=>{
                setLoadingData(false);
                setNoticeError(error.message)
            })
    },[bookId]
    );

   

    if(loadingData){
        return(
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        )
    }

    if(noticeError){
        return(
            <div>
                <h1>Error: {noticeError}</h1>
            </div>
        )
    }

    return (
        <div className="container mt-2 mb-2 text-center">
            PHẦN ĐÁNH GIÁ
            {reviewList.map((review, index) => (
                <div key={review.reviewId || index} className="Feedback">
                    <UserInfo feedbackId={review.reviewId} />
                    <div className="row">
                        <div className="col-4 text-end">
                            <p>{renderRating((review.rate?review.rate:0))}</p>
                        </div>
                        <div className="col-8 text-start">
                            <h3>{review.content}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
}
export default ReviewProduct;