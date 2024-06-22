/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookByBookId } from "../../api/BookAPI";
import BookModel from "../../models/BookModel";
import ProductImage from "./components/ProductImage";
import RemarkProduct from "./components/RemarkProduct";
import renderRating from "../utils/StarRate";
import NumberFormat from "../utils/NumberFormat";

const ProductDetail: React.FC = () => {

    const {bookId} = useParams(); // Get bookId from url;
    let bookIdNumber = 0;
    try{
        bookIdNumber = parseInt(bookId+'');

        if(Number.isNaN(bookIdNumber)){
            bookIdNumber =0;
        }
    }catch(error){
        bookIdNumber = 0;
        console.error("Error: ",error);
    }

    const [book, setBook] = useState<BookModel|null>(null)
    const [loadingData,setLoadingData] = useState(true);
    const [noticeError,setNoticeError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleQuantity = (event: ChangeEvent<HTMLInputElement>) => {
        const quantityNow = parseInt(event.target.value);
        const inventoryNumber = book&&book.quantity?book.quantity:0;
        if(!isNaN(quantityNow) && quantityNow>=1 && quantityNow<=inventoryNumber){
            setQuantity(quantityNow);
        }
    }

    const increaseQuantity = () => {
        const quantityNow = book && book.quantity?book.quantity:0;
        if(quantity< quantityNow){
             setQuantity(quantity+1);
        }
    }

    const reduceQuantity = () => {
        if(quantity>=2){
            setQuantity(quantity-1);
        }
    }

    const handlePurchase=()=>{

    }

    const addToCard=()=>{

    }

    useEffect(()=>{
        getBookByBookId(bookIdNumber)
            .then(book => {
                setBook(book);
                setLoadingData(false);
            })
            .catch(error=>{
                setLoadingData(false);
                setNoticeError(error.message)
            })
    },[bookId, bookIdNumber]
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

    if(!book){
        return(
            <div>
                <h1>Sách không tồn tại !</h1>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="row mt-4 mb-4">
                <div className="col-4">
                    <ProductImage bookId={bookIdNumber}/>
                </div>
                <div className="col-8">
                    <div className="row">
                        <div className="col-8">
                            <h1>{book.bookName}</h1>
                            <h4>{renderRating(book.averageRate?book.averageRate:0)}</h4>
                            <h5 className="text-end">Đã bán: {NumberFormat(book.soldQuantity)}</h5>
                            <h4>{NumberFormat(book.price)} đ</h4>
                            <hr/>
                                <div dangerouslySetInnerHTML={{__html:book.description}}/>
                            <hr/>
                        </div>
                        <div className="col-4">
                            <div>
                                <div className="mb-2">Số lượng</div>
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-outline-secondary me-2" onClick={increaseQuantity}>+</button>
                                    <input className="form-control text-center" type="number" min={1} value={quantity} onChange={handleQuantity}></input>
                                    <button className="btn btn-outline-secondary ms-2" onClick={reduceQuantity}>-</button>
                                </div>
                                {
                                    book.price && (
                                        <div className="mt-2 text-center">Số tiền tạm tính: <br/>
                                            <h4>{NumberFormat(quantity * book.price)} đ</h4>
                                        </div>
                                    )
                                }
                            <div className="d-grid grap-2">
                                <button type="button" className="btn btn-danger mt-3" onClick={handlePurchase}>Mua ngay</button>
                                <button type="button" className="btn btn-outline-secondary mt-2" onClick={addToCard}>Thêm vào giỏ hàng</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4 mb-4">
                <RemarkProduct bookId={bookIdNumber}/>              
            </div>
        </div>
    );
}
export default ProductDetail;