/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {  useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getAllImagesByBook } from "../../../api/ImageAPI";
import { Link, useNavigate } from "react-router-dom";
import renderRating from "../../utils/StarRate";
import NumberFormat from "../../utils/NumberFormat";
import isAdmin from "../../utils/CheckCurrentRole";
import { useAuth } from "../../utils/AuthContext";
import AddBookToWishList from "../../../user/wishList/AddBookToWishList";
import { Button } from "react-bootstrap";
import useScrollToTop from "../../../hooks/ScrollToTop";

interface BookPropsInterface{
    book: BookModel;
}

const BookProps: React.FC<BookPropsInterface> = (props) => {
    useScrollToTop();

    const bookId = props.book.bookId;

    const {isLoggedIn} = useAuth();
    const [imageList,setImageList] = useState<ImageModel[]>([]);
    const [loadingData,setLoadingData] = useState(true);
    const [noticeError,setNoticeError] = useState(null);
    const navigate = useNavigate();
    const [showModal,setShowModal] = useState(false);
    const [noticeSubmit,setNoticeSubmit] = useState("")


    useEffect(()=>{
        getAllImagesByBook(bookId)
            .then(imageData => {
                setImageList(imageData);
                setLoadingData(false);
            })
            .catch(error=>{
                setLoadingData(false);
                setNoticeError(error.message)
                console.log(error.message)
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

    let imageData:string = "";
    if(imageList[0] && imageList[0].imageData){
        imageData = imageList[0].imageData;
    }

     const handleDelete=()=>{
            const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa!");
            if(!userConfirmed){
                return;
            }else{
                navigate(`/admin/deleteBook/${bookId}`);
            }
    }


    const handleHeartClick=()=>{
        if(!isLoggedIn){
            navigate("/login",{replace:true})
        }
       
        setShowModal(true);
    }

    const handleClose=()=>{
        setNoticeSubmit("")
        setShowModal(false);
    }

     return (
        <div className="col-md-3 mt-2">
            <div className="card">  
                <Link to={`books/${props.book.bookId}`}>
                    <img
                    src={imageData}
                    className="card-img-top"
                    alt={props.book.description}
                    style={{ height: '200px' }}
                />
                </Link>
                <div className="card-body">
                     <Link to={`books/${props.book.bookId}`} style={{textDecoration:'none'}}>
                       <h5 className="card-title">{props.book.bookName}</h5>
                    </Link>
                    <div className="price row">
                        <span className="listed-price col-6 text-end">
                            <del>{NumberFormat(props.book.listedPrice)}</del>
                            <sup>đ</sup>
                        </span>
                        <span className="discounted-price col-6 text-end">
                            <strong>{NumberFormat(props.book.price)} <sup>đ</sup></strong>
                        </span>
                    </div>

                    <div className="row mt-2" role="group">
                        <div className="rate col-6">
                            <span>{renderRating(props.book.averageRate?props.book.averageRate:0)} ({NumberFormat(props.book.soldQuantity)})</span>
                        </div>
                        <div className="col-6 text-end">
                            <Button onClick={handleHeartClick} value={props.book.bookId} className="btn btn-secondary btn-block me-2">
                                <i className="fas fa-heart"></i>
                            </Button>
                            <button className="btn btn-danger btn-block">
                                <i className="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    {isAdmin() &&  
                            (<div className="admin-button mt-2 text-end">
                            <Link to={`/admin/editBook/${bookId}`} className="btn btn-primary me-2">
                            <i className="fa fa-edit"></i></Link>
                                 
                            <button className="btn btn-danger"  onClick={handleDelete}>
                            <i className="fas fa-trash"></i></button>
                            </div>
                            )}
                </div>
            </div>

          <AddBookToWishList
                bookId={bookId}
                handleClose={handleClose}
                showModal={showModal}
                setNoticeSubmit={setNoticeSubmit}
                noticeSubmit={noticeSubmit}
          ></AddBookToWishList>

        </div>

    );
}
export default BookProps;