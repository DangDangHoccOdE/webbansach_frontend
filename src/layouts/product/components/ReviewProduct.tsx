import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getAllReviewsByRateAndBookId, getNumberOfStar } from "../../../api/ReviewAPI";
import renderRating, { formatStartRate } from "../../utils/StarRate";
import useScrollToTop from "../../../hooks/ScrollToTop";
import BookModel from "../../../models/BookModel";
import { getBookByBookId } from "../../../api/BookAPI";
import { CircularProgress, Grid, Card, CardContent, Typography, Button, Box, Stack, Avatar } from "@mui/material";
import UserModel from "../../../models/UserModel";
import { getUserByReviewId } from "../../../api/UserAPI";
import ReviewModel from "../../../models/ReviewModel";
import SoldQuantityFormat from "../../utils/SoldQuantityFormat";
import { toast } from "react-toastify";
import { Pagination } from "../../utils/Pagination";
import { checkRoleAdmin } from "../../utils/JwtService";
import HideSourceIcon from '@mui/icons-material/HideSource';
import { faFaceSmileBeam, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import handleHideReview from "../../../admin/review/handleHideReview";
interface ReviewProductProps {
  bookId: number;
  setIsRefresh:Dispatch<SetStateAction<boolean>>
}

const ReviewProduct: React.FC<ReviewProductProps> = (props) => {
  const bookId = props.bookId;

  const [reviewList, setReviewList] = useState<ReviewModel[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [book, setBook] = useState<BookModel | null>(null);
  const [listUserReview, setListUserReview] = useState<UserModel[]>([]);
  const [numberOfStar, setNumberOfStar] = useState(0);
  const [numberOfOneStar, setNumberOfOneStar] = useState(0);
  const [numberOfTwoStar, setNumberOfTwoStar] = useState(0);
  const [numberOfThreeStar, setNumberOfThreeStar] = useState(0);
  const [numberOfFourStar, setNumberOfFourStar] = useState(0);
  const [numberOfFiveStar, setNumberOfFiveStar] = useState(0);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0);
  const isAdmin = checkRoleAdmin();
  const [isUpdate,setIsUpdate] = useState(false);

  useScrollToTop();

  useEffect(() => {
    const fetchAllReview = async () => { // lấy ra danh sách các review
      try {
        const allReview = await getAllReviewsByRateAndBookId(numberOfStar, bookId,currentPage-1);
        const filterReviewShow = (allReview.resultReviews).filter(review=>!review.isHide) as ReviewModel[]
        setReviewList(filterReviewShow);
        setTotalPages(allReview.totalPages)
        const getAllUser = allReview.resultReviews.map(async (review) => {
          const dataUser = await getUserByReviewId(review.reviewId);
          return dataUser;
        });
        const updateListUser = (await Promise.all(getAllUser)).filter((user) => user !== null) as UserModel[];
        setListUserReview(updateListUser);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi, không thể tải được đánh giá");
      }
    };
    fetchAllReview();

    getBookByBookId(bookId) // Lấy ra quyển sách đánh giá
      .then((book) => {
        setBook(book);
        setLoadingData(false);
      })
      .catch((error) => {
        console.error(error.message);
      });

      getNumberOfStar(bookId)
      .then((data) => {
        setNumberOfOneStar(data[1]);
        setNumberOfTwoStar(data[2]);
        setNumberOfThreeStar(data[3]);
        setNumberOfFourStar(data[4]);
        setNumberOfFiveStar(data[5]);
        setLoadingData(false);
      })
      .catch((error) => {
        console.error(error.message);
      });

  }, [bookId, currentPage, numberOfStar,isUpdate]);

  if (loadingData) {
    return (
      <div className="text-center mt-5">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  const handleFilterStarReview = (star: number) => { // khi người dùng xem đánh giá qua từng sao
    setNumberOfStar(star);
  };

  const pagination = (pageCurrent: number)=>{
    setCurrentPage(pageCurrent);
  }

  const deleteReview=async(reviewId:number)=>{
    const adminConfirm = window.confirm("Bạn có chắc muốn ẩn đánh giá này!")
    if(!adminConfirm){
      return
    }else{
      const isComplete = await handleHideReview(reviewId);
      if(isComplete){
          setIsUpdate(prev=>!prev);
          props.setIsRefresh(prev=>!prev)
      }
    }
  }


  return (
    book && (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Card variant="outlined">
          <CardContent>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Typography variant="h6">{formatStartRate(book?.averageRate)} trên 5</Typography>
                {renderRating(book?.averageRate)}
              </Grid>
              <Grid item>
                <Button variant={numberOfStar === 0 ? "contained" : "outlined"} onClick={() => handleFilterStarReview(0)}>
                  Tất cả
                </Button>
              </Grid>
              <Grid item>
                <Button variant={numberOfStar === 5 ? "contained" : "outlined"} onClick={() => handleFilterStarReview(5)}>
                  5 Sao ({SoldQuantityFormat(numberOfFiveStar)})
                </Button>
              </Grid>
              <Grid item>
                <Button variant={numberOfStar === 4 ? "contained" : "outlined"} onClick={() => handleFilterStarReview(4)}>
                  4 Sao ({SoldQuantityFormat(numberOfFourStar)})
                </Button>
              </Grid>
              <Grid item>
                <Button variant={numberOfStar === 3 ? "contained" : "outlined"} onClick={() => handleFilterStarReview(3)}>
                  3 Sao ({SoldQuantityFormat(numberOfThreeStar)})
                </Button>
              </Grid>
              <Grid item>
                <Button variant={numberOfStar === 2 ? "contained" : "outlined"} onClick={() => handleFilterStarReview(2)}>
                  2 Sao ({SoldQuantityFormat(numberOfTwoStar)})
                </Button>
              </Grid>
              <Grid item>
                <Button variant={numberOfStar === 1 ? "contained" : "outlined"} onClick={() => handleFilterStarReview(1)}>
                  1 Sao ({SoldQuantityFormat(numberOfOneStar)})
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {listUserReview && reviewList.length > 0 ? (
          reviewList.map((review, index) => (
            <Card key={review.reviewId || index} variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    {listUserReview[index] && (
                      <>
                      {  
                      listUserReview[index].avatar===null?
                           <i className="fas fa-user"></i>
                           : <Avatar alt={listUserReview[index]?.firstName?.toUpperCase()} src={listUserReview[index].avatar}   sx={{ width: 30, height: 30 }} />
                  
              }
                        <Typography>{listUserReview[index].firstName}</Typography>
                      </>
                    )}
                    <Typography>{renderRating(review.rate ? review.rate : 0)}</Typography>
                    <Typography>{review.date.replace("T", " ").substring(0, 16)}</Typography>
                    <Typography>{review.content}</Typography>
                    <Stack direction="row" spacing={2}>
                        {review.imageOne && <img src={review.imageOne} alt="*" style={{width:"50px",height:"50px"}}/>}
                        {review.imageTwo && <img src={review.imageTwo} alt="*" style={{width:"50px",height:"50px"}} />}
                        {review.imageThree && <img src={review.imageThree} alt="*" style={{width:"50px",height:"50px"}} />}
                        {review.imageFour && <img src={review.imageFour} alt="*" style={{width:"50px",height:"50px"}}/>}
                        {review.imageFive && <img src={review.imageFive} alt="*" style={{width:"50px", height:"50px"}} />}
                        {review.video &&   <video src={review.video} controls style={{width:"50px",height:"50px"}}/>}
                    </Stack>
                  </Grid>
                 
                </Grid>
                <Grid item sx={{mt:2}}>
                    <>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box display="flex" alignItems="center">
                            <FontAwesomeIcon icon={faThumbsUp} style={{ marginRight: '8px' }} />
                            {/* Thêm các nội dung khác ở đây nếu có */}
                        </Box>
                        {isAdmin && (
                            <Button 
                                onClick={() => deleteReview(review.reviewId)} 
                                variant="outlined" 
                                color="error" 
                                endIcon={<HideSourceIcon />}
                            >
                                Ẩn
                            </Button>
                        )}
                    </Box>
                    </>
                  </Grid>
                 
              </CardContent>
            </Card>
          ))
        ) : (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FontAwesomeIcon icon={faFaceSmileBeam} size="2x" />
            <Typography>Chưa có đánh giá nào</Typography>
          </Box>
        )}

        {
            reviewList.length>0 &&  
            <Box sx={{mt:2}}>
                <Pagination currentPage={currentPage} totalPages={totalPages} pagination={pagination}/>
            </Box>

        }
      </Box>
     
    )
  );
};

export default ReviewProduct;