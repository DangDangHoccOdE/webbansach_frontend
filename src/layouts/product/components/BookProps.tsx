/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getAllImagesByBook } from "../../../api/ImageAPI";

interface BookPropsInterface{
    book: BookModel;
}

const BookProps: React.FC<BookPropsInterface> = (props) => {

    const bookId = props.book.bookId;

    const [imageList,setImageList] = useState<ImageModel[]>([]);
    const [loadingData,setLoadingData] = useState(true);
    const [noticeError,setNoticeError] = useState(null);

    useEffect(()=>{
        getAllImagesByBook(bookId)
            .then(imageData => {
                setImageList(imageData);
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

    let imageData:string = "";
    if(imageList[0] && imageList[0].imageData){
        imageData = imageList[0].imageData;
    }

    return (
        <div className="col-md-3 mt-2">
            <div className="card">  
                    <img
                    src={imageData}
                    className="card-img-top"
                    alt={props.book.description}
                    style={{ height: '200px' }}
                />
                <div className="card-body">
                    <h5 className="card-title">{props.book.bookName}</h5>
                    <p className="card-text">{props.book.description}</p>
                    <div className="price">
                        <span className="listed-price">
                            <del>{props.book.listedPrice}</del>
                        </span>
                        <span className="discounted-price">
                            <strong>{props.book.price}</strong>
                        </span>
                    </div>
                    <div className="row mt-2" role="group">
                        <div className="col-6">
                            <a href="#" className="btn btn-secondary btn-block">
                                <i className="fas fa-heart"></i>
                            </a>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-danger btn-block">
                                <i className="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BookProps;