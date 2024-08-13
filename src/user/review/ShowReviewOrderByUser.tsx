import { useCallback, useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrderReviewByOrder } from "../../api/OrderReviewAPI";
import ReviewModel from "../../models/ReviewModel";
import { getReviewByOrderReview } from "../../api/ReviewAPI";
import { getBooksOfOrders } from "../../api/BookAPI";
import { getAllIconImage } from "../../layouts/utils/ImageService";
import BookModel from "../../models/BookModel";
import ImageModel from "../../models/ImageModel";
import { Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import renderRating from "../../layouts/utils/StarRate";
import ReviewOrder from "./ReviewOrder";
import OrderReviewModal from "../../models/OrderReviewModel";
import useScrollToTop from "../../hooks/ScrollToTop";

interface ReviewUserProps{
    orderId:number
    handleClose:()=>void
    showModal:boolean,
}
const ShowReviewOrderByUser:React.FC<ReviewUserProps>=({orderId,handleClose,showModal})=>{
    useScrollToTop();
    const navigate=useNavigate()
    const {isLoggedIn} = useAuth();
    const [orderReview,setOrderReview] = useState<OrderReviewModal|null>(null)
    const [reviews,setReviews] = useState<ReviewModel[]>([])
    const [isLoading,setIsLoading] = useState(false);
    const [books,setBooks] = useState<BookModel[]>([]);
    const [imageBooks,setImageBooks] = useState<ImageModel[]>([]);
    const [showModalEditReview,setShowModalEditReview] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchData = useCallback(async()=>{
        // const fetchOrderReview = async()=>{ // Gọi api để lẩy ra đánh giá shop, delivery,...
            setIsLoading(true)
            try{
                  // Lấy thông tin đơn hàng, order details, books, và images cùng lúc
        const [fetchOrderReview,fetchBooks] = await Promise.all([
            getOrderReviewByOrder(orderId),
            getBooksOfOrders(orderId),
          ]);
      
          if (!fetchBooks) {
            navigate("/error-404", { replace: true });
            return;
          }

          setOrderReview(fetchOrderReview); // Đánh giá về đơn hàng
          setBooks(fetchBooks);

          if(fetchBooks){
            const dataImages =  await getAllIconImage(fetchBooks)
            setImageBooks(dataImages);

          }

          if (fetchOrderReview) {
            const reviewsData = await getReviewByOrderReview(fetchOrderReview.orderReviewId); // hàm này để lấy ra cái review của từng sách trong đơn 
            setReviews(reviewsData);
          }
        } catch (error) {
          console.error({ error });
          navigate("/error-404", { replace: true });
        }finally{
            setIsLoading(false)
        }
    },[navigate, orderId])

    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login",{replace:true});
            return;
        }

      fetchData();
    }, [fetchData, isLoggedIn, navigate,refreshTrigger]);

    const handleEditReview=()=>{
        setShowModalEditReview(true)
    };

    const handleCloseModalEditReview=()=>{
        setShowModalEditReview(false);
    }

    const handleSubmitEditReview=()=>{
        setRefreshTrigger(prev=>prev+1); // Gọi lại hàm để cập nhật giao diện
    }

    if(isLoading){
        return(
            null
        )
    }


    return( 
        orderReview && 
        <Modal
            show={showModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>Đánh giá sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                {
                    books.map((book,index)=>
                        <>
                        <Card key={book.bookId} className="mb-4">
                            <Card.Body key={index}>
                                <div className="d-flex align-items-center mb-3">
                                <Image 
                                    src={imageBooks[index].imageData} 
                                    alt="Ảnh sách" 
                                    width={60} 
                                    height={80} 
                                    className="me-3"
                                />
                                <h5 className="mb-0">{book.bookName}</h5>
                                </div>

                                <Form>
                                    <Form.Group className="mb-3">
                                    <div className="d-flex justify-content-start">
                                        <Form.Label className="me-3">Chất lượng sản phẩm</Form.Label>
                                        <Form.Label>{renderRating(reviews[index].rate)}</Form.Label>
                                    </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                    <div className="d-flex justify-content-start">
                                        <Form.Label className="me-1">Thời gian: </Form.Label>
                                        <Form.Label>{(reviews[index].date.replace("T"," ").substring(0,16))}</Form.Label>
                                    </div>
                                    </Form.Group>

                                    <Form.Label className="mb-3">
                                        <Form.Label className="me-1">Đánh giá của bạn: </Form.Label>
                                        <Form.Label>
                                            {reviews[index].content}
                                        </Form.Label>

                                    </Form.Label>
                                </Form>
                    
                        
                            <Row>
                                {reviews[index].imageOne && (
                                    <Col xs={1} className="me-3">
                                    <img src={reviews[index].imageOne} alt="*" style={{width:"50px",height:"50px"}}/>
                                    </Col>
                                )}
                                {reviews[index].imageTwo && (
                                    <Col xs={1} className="me-3">
                                    <img src={reviews[index].imageTwo} alt="*" style={{width:"50px",height:"50px"}}/>
                                    </Col>
                                )}
                                {reviews[index].imageThree && (
                                    <Col xs={1} className="me-3">
                                    <img src={reviews[index].imageThree} alt="*" style={{width:"50px",height:"50px"}}/>
                                    </Col>
                                )}
                                {reviews[index].imageFour && (
                                    <Col xs={1} className="me-3">
                                    <img src={reviews[index].imageFour} alt="*" style={{width:"50px",height:"50px"}}/>
                                    </Col>
                                )}
                                {reviews[index].imageFive && (
                                    <Col xs={1} className="me-3">
                                    <img src={reviews[index].imageFive} alt="*" style={{width:"50px",height:"50px"}}/>
                                    </Col>
                                )}
                                {reviews[index].video && (
                                    <Col xs={1} className="me-3">
                                    <video src={reviews[index].video} controls style={{width:"50px",height:"50px"}}/>
                                    </Col>
                                )}
                                </Row>
                            </Card.Body>
                            </Card>
                        </>
                    )          
                }
            
            
                        <h5 className="mb-3">Về dịch vụ</h5>
                        <Form>
                            <Form.Group className="mb-3">
                            <div className="d-flex justify-content-start align-items-center">
                            <Form.Label className="me-5">Dịch vụ shop</Form.Label>
                                {renderRating(orderReview.shopRate)}
                            </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                            <div className="d-flex justify-content-start align-items-center">
                            <Form.Label className="me-2">Dịch vụ vận chuyển</Form.Label>
                                 {renderRating(orderReview.deliveryRate)}                   
                             </div>
                            </Form.Group>
                        </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleEditReview}>
                Sửa đánh giá
        </Button>
            <ReviewOrder books={books} 
                        handleClose={handleCloseModalEditReview} 
                        imageOfBooks={imageBooks}
                        orderId={orderId} 
                        showModal={showModalEditReview} 
                        onReviewSubmit={handleSubmitEditReview}
                        reviews={reviews}
                        orderReview={orderReview}/>
        </Modal.Footer>
        </Modal>
    )
}

export default ShowReviewOrderByUser;