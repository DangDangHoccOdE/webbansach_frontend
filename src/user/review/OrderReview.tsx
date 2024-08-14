import { Button, Card, Form, Image, Modal } from "react-bootstrap";
import useScrollToTop from "../../hooks/ScrollToTop";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookModel from "../../models/BookModel";
import ImageModel from "../../models/ImageModel";
import ReviewOrderStar from "../../layouts/utils/ReviewOrderStar";
import { Camera, CameraVideo } from "react-bootstrap-icons";
import getBase64 from "../../layouts/utils/GetBase64";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ReviewModel from "../../models/ReviewModel";
import OrderReviewModal from "../../models/OrderReviewModel";

interface ReviewOrderProps{
    handleClose:()=>void;
    showModal:boolean;
    books:BookModel[],
    imageOfBooks:ImageModel[],
    reviews:ReviewModel[]|null
    orderId:number,
    onReviewSubmit:()=>void
    orderReview:OrderReviewModal|null
}

const OrderReview:React.FC<ReviewOrderProps>=({handleClose,reviews,showModal,books,imageOfBooks,orderId,onReviewSubmit,orderReview})=>{
    useScrollToTop();
    const navigate = useNavigate();
    const isLoggedIn = useAuth();
    const [productRating,setProductRating] = useState(5);
    const [deliveryRating,setDeliveryRating] = useState(5);
    const [shopRating,setShopRating] = useState(5);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [notice,setNotice] = useState('')
    const [mapImagesOfBook,setMapImagesOfBook] = useState<Map<number,string[]>>(new Map());
    const [mapVideoOfBook,setMapVideoOfBook] = useState<Map<number,string>>(new Map());
    const [mapContentsOfBook,setMapContentsOfBook] = useState<Map<number,string>>(new Map());
    const [mapStarsOfBook,setMapStarsOfBook] = useState<Map<number,number>>(()=>{

        const initialMap = new Map<number,number>();
        books.forEach(book=>initialMap.set(book.bookId,5));
        return initialMap;
    })

    // Kiểm tra xem có dữ liệu reviews từ trang khác gửi về k => Phần sửa đánh giá
    useEffect(() => {
        if(reviews){
            setMapImagesOfBook((prev)=>{
                const newMap = new Map(prev);
                reviews.forEach((review, index) => {
                    const images = [];
                    
                    if(review.imageOne)  images.push(review.imageOne)
                    if(review.imageTwo)  images.push(review.imageTwo)
                    if(review.imageThree)  images.push(review.imageThree)
                    if(review.imageFour) images.push(review.imageFour)
                    if(review.imageFive)  images.push(review.imageFive)
                    if(images.length>0)
                        newMap.set(books[index].bookId, images)
                    }
                );
                return newMap;
            });
    
            setMapContentsOfBook((prev)=>{
                const newMap = new Map(prev);
                reviews.forEach((review, index) => {
                    if(review.content)
                        newMap.set(books[index].bookId, review.content)
            });
                return newMap;
            });
            
            setMapVideoOfBook((prev)=>{
                const newMap = new Map(prev);
                reviews.forEach((review, index) => {
                    if(review.video)
                        newMap.set(books[index].bookId, review.video)  
                }
                    
                );
                return newMap;
            });

        }

        if(orderReview){
            setShopRating(orderReview.shopRate)
            setDeliveryRating(orderReview.deliveryRate)
        }
    }, [books, orderReview, reviews]);


     if (!isLoggedIn ) {
       navigate("/login", { replace: true });
       return null;
    }
     
    const handleProductRatingChange=(newRating:number,bookId:number)=>{ // Chỉnh sửa số sao
        setProductRating(newRating)
        setMapStarsOfBook((prev)=>{
            const newMap = new Map(prev);
            newMap.set(bookId,newRating);
            return newMap;
        })

    } 
    
    const handleDeliveryRatingChange=(newRating:number)=>{ // Chỉnh sửa số vận chuyển
        setDeliveryRating(newRating)
    }  
    
    const handleShopRatingChange=(newRating:number)=>{ // Chỉnh sửa số đánh giá sao cửa hàng
        setShopRating(newRating)
    }

    const mapToObject = (map:Map<number,any>)=>{ // chuyển map thành object
        return Array.from(map).reduce((obj, [key,value])=>{
            obj[key] = value;
            return obj;
        }, {} as {[key:number] :any});
    }

    const handleSubmit=async(e:FormEvent)=>{
        e.preventDefault();

        let url:string=`http://localhost:8080/review/addReviewOrder/${orderId}`
        if(reviews && orderReview){
            url=`http://localhost:8080/review/editReviewOrder/${orderId}`
        }
            try{
                const response = await fetchWithAuth(url,{
                    method:reviews && orderReview ? "PUT":"POST",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify({
                        productRating,
                        shopRating,
                        deliveryRating,
                        mapStarsOfBook:mapToObject(mapStarsOfBook),
                        mapImagesOfBook:mapToObject(mapImagesOfBook),
                        mapContentsOfBook:mapToObject(mapContentsOfBook),
                        mapVideoOfBook:mapToObject(mapVideoOfBook),
                        date:format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
                    })

                })

                const data = await response.json();
                if(response.ok){
                    toast.success(data.content)
                    onReviewSubmit();
                }else{
                    toast.error(data.content || "Lỗi, không thể tải bình luận")
                }
            }catch(error){
                console.error({error})
                toast.error("Lỗi, không thể tải bình luận")
            }
        
       handleClose();
    }

    const addImage=async (e:ChangeEvent<HTMLInputElement>,bookId:number)=>{ // Xử lý đăng tải ảnh
        if(e.target.files){
            if(e.target.files.length>5){
                setNotice("Vui lòng chọn tối đa 5 ảnh")
                return;
            }
            setNotice("")
            const files = Array.from(e.target.files);
            const base64Images = await Promise.all(
                files.map(async (file)=>{
                    try{
                        return await getBase64(file);;
                    }catch(error){
                        console.error("Lỗi khi chuyển đổi dữ liệu sang base64",error);
                        return null;
                    }
                })
            
            )       
        
            setMapImagesOfBook((prev)=>{
                const newMap = new Map(prev); // Tạo map mới từ map cũ
                newMap.set(bookId,base64Images.filter(img=>img!=null) as string[]) // set thêm giá trị
                return newMap;
            })
        };
    }

    const addVideo=async(e:ChangeEvent<HTMLInputElement>,bookId:number)=>{ // Xử lý đăng tải video
        if(e.target.files){
            const video = e.target.files[0]
            try{
                const base64Video = await getBase64(video);

                 if(base64Video){
                    setMapVideoOfBook((prev)=>{
                        const newMap = new Map(prev);
                        newMap.set(bookId,base64Video);
                        return newMap;
                    })
                 }

            }catch(error){
                 console.error('Lỗi khi chuyển đổi sang base64:', error);
                 return null;
            }    
        };
    }

    const handleReviewContent=async(e:ChangeEvent<HTMLInputElement>,bookId:number)=>{ // Xử lý đăng nội dung đánh giá
        setMapContentsOfBook((prev)=>{
            const newMap = new Map(prev);
            newMap.set(bookId,e.target.value);
            return newMap;
        })
    }

    const handleImageClick=(bookId:number)=>{  // Khi click vào thì mở ra thẻ input ẩn
        if (imageInputRef.current) {
            imageInputRef.current.dataset.bookId=bookId.toString(); // dataset để hàm addImage biết add ảnh nào vào sách nào
            imageInputRef.current.click();
          }   
    }

    const handleVideoClick = (bookId:number) => {
        if (videoInputRef.current) {
            videoInputRef.current.dataset.bookId=bookId.toString();
            videoInputRef.current.click();
          }     
     };

      
    return(
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
                        <Card key={index} className="mb-4">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                <Image 
                                    src={imageOfBooks[index].imageData} 
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
                                        <ReviewOrderStar initialRating={reviews ? reviews[index].rate : productRating} onRatingChange={(newRating)=>handleProductRatingChange(newRating,book.bookId)}></ReviewOrderStar>
                                    </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Đánh giá của bạn</Form.Label>
                                        <Form.Control
                                            value={mapContentsOfBook.get(book.bookId)}
                                            as="textarea"
                                            rows={3}
                                            placeholder="Hãy chia sẻ đánh giá của bạn về sản phẩm"
                                            onChange={(e:ChangeEvent<HTMLInputElement>)=>handleReviewContent(e,book.bookId)}/>
                                    </Form.Group>
                                </Form>
                                  
                                <div className="mb-3">
                                    <Button variant="outline-secondary" className="me-2" onClick={()=>handleImageClick(book.bookId)}>
                                    <Camera /> Thêm hình ảnh
                                    </Button>
                                    <Form.Control
                                        type="file"
                                        ref={imageInputRef}
                                        onChange={(event:ChangeEvent<HTMLInputElement>)=>{
                                            const bookId = Number(event.currentTarget.dataset.bookId)
                                            addImage(event,bookId)}}
                                        style={{display:"none"}}
                                        accept="image/*"multiple
                                        ></Form.Control>

                                    <Button variant="outline-secondary" onClick={()=>handleVideoClick(book.bookId)}>
                                    <CameraVideo /> Thêm video
                                    </Button>
                                    <Form.Control
                                        type="file"
                                        ref={videoInputRef}
                                        onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                                            const bookId = Number(e.currentTarget.dataset.bookId);
                                            addVideo(e,bookId)
                                        }}
                                        style={{display:"none"}}
                                        accept="video/*"></Form.Control>

                                    {
                                        mapImagesOfBook.get(book.bookId) && (
                                            <div className="mt-2">
                                                {mapImagesOfBook.get(book.bookId)!.map((image,idx)=>(
                                                    <Image key={idx} 
                                                            src={image}
                                                             alt={`Ảnh ${idx + 1}`}
                                                              className="me-2 mb-2" 
                                                              style={{maxWidth:"50px", maxHeight:"100px"}}/>
                                                ))}
                                            </div>
                                        )
                                    }

                                    {
                                        mapVideoOfBook.get(book.bookId) && (
                                            <div>
                                                {
                                                    <video src={mapVideoOfBook.get(book.bookId)} controls className="mt-2" style={{maxWidth:"50px"}}></video>
                                            }
                                            </div>
                                        )
                                    }
                                </div>
                           </Card.Body>
                        </Card>
                        )
                        
                }

                        <h5 className="mb-3">Về dịch vụ</h5>
                        <Form>
                            <Form.Group className="mb-3">
                            <div className="d-flex justify-content-start align-items-center">
                            <Form.Label className="me-5">Dịch vụ shop</Form.Label>
                                <ReviewOrderStar onRatingChange={handleShopRatingChange} initialRating={shopRating}/>
                            </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                            <div className="d-flex justify-content-start align-items-center">
                            <Form.Label className="me-2">Dịch vụ vận chuyển</Form.Label>
                                <ReviewOrderStar onRatingChange={handleDeliveryRatingChange} initialRating={deliveryRating}/>
                            </div>
                            </Form.Group>
                        </Form>
        </Modal.Body>
        {notice && <p style={{color:"red"}} className="text-center">{notice}</p>}
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Trở lại
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
            Gửi đánh giá
        </Button>
        </Modal.Footer>
        </Modal>
    )
}

export default OrderReview;