import React, { useEffect, useState } from "react";
import FeedbackModel from "../../../models/ReviewModel";
import {getAllReviewByBook } from "../../../api/ReviewAPI";
import UserInfo from "./UserInfo";
import renderRating from "../../utils/StarRate";
import useScrollToTop from "../../../hooks/ScrollToTop";
import BookModel from "../../../models/BookModel";
import { getBookByBookId } from "../../../api/BookAPI";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Border } from "react-bootstrap-icons";

interface ReviewProductProps{
    bookId: number;
}

const ReviewProduct: React.FC<ReviewProductProps> = (props) => {
    const bookId = props.bookId;

    const [reviewList,setReviewList] = useState<FeedbackModel[]>([]);
    const [loadingData,setLoadingData] = useState(true);
    const [notice,setNotice] = useState("");
    const [book,setBook] = useState<BookModel|null>(null)
    const navigate = useNavigate();

    useScrollToTop();
    useEffect(()=>{
        getAllReviewByBook(bookId)
            .then(reviewList => {
                setReviewList(reviewList);
                if(reviewList.length===0){
                    setNotice("Chưa có đánh giá nào")
                }else{
                    setNotice("");
                }
                setLoadingData(false);
            })
            .catch(error=>{
                setLoadingData(false);
                console.error(error.message)
                setNotice("Đã có lỗi xảy ra")
            })

        getBookByBookId(bookId)
            .then(book=>{
                setBook(book);
                setLoadingData(false);
            }).catch(error=>{
                navigate("/");
                console.error(error.message)
                setNotice("Đã có lỗi xảy ra")
            })
    },[bookId, navigate]
    );

   

    if (loadingData) {
        return (
          <div className="text-center mt-5">
              <CircularProgress color="inherit" />
          </div>
        );
      }
    
      if (notice) {
           return <div className="alert alert-danger text-center" role="alert">{notice}</div>;
      }
    
    return (
            book &&           
            <div className="container mt-2 mb-2 text-center">
                <div className="border-white">
                    <div>{book?.averageRate} trên 5</div>
                    {renderRating(book?.averageRate)}

                    <button type="button">Tất cả</button>
                    <button type="button">5 Sao</button>
                    <button type="button">4 Sao</button>
                    <button type="button">3 Sao</button>
                    <button type="button">2 Sao</button>
                    <button type="button">1 Sao</button>
                </div>
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
      
    )
    
}
export default ReviewProduct;