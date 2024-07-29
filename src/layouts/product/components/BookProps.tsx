/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getIconImageByBook } from "../../../api/ImageAPI";
import { Link, useNavigate } from "react-router-dom";
import renderRating from "../../utils/StarRate";
import NumberFormat from "../../utils/NumberFormat";
import isAdmin from "../../utils/CheckCurrentRole";
import AddBookToWishList from "../../../user/wishList/AddBookToWishList";
import { Button } from "react-bootstrap";
import useScrollToTop from "../../../hooks/ScrollToTop";
import AddCartItem from "../../../user/cartItem/AddCartItem";
import { useAuth } from "../../../context/AuthContext";
import DiscountBadge from "../../utils/DiscountBadge";
import SoldQuantityFormat from "../../utils/SoldQuantityFormat";

interface BookPropsInterface {
    book: BookModel;
}

const BookProps: React.FC<BookPropsInterface> = (props) => {
    useScrollToTop();

    const bookId = props.book.bookId;

    const { isLoggedIn } = useAuth();
    const [iconOfBook, setIconOfBook] = useState<ImageModel | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [noticeError, setNoticeError] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [noticeSubmit, setNoticeSubmit] = useState("");

    useEffect(() => {
        getIconImageByBook(bookId)
            .then(imageData => {
                setIconOfBook(imageData);
                setLoadingData(false);
            })
            .catch(error => {
                setLoadingData(false);
                setNoticeError(error.message);
                console.log(error.message);
            });
    }, [bookId]);

    if (loadingData) {
        return (
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        );
    }

    if (noticeError) {
        return (
            <div>
                <h1>Error: {noticeError}</h1>
            </div>
        );
    }

    let imageData: string = "";
    if (iconOfBook && iconOfBook.imageData) {
        imageData = iconOfBook.imageData;
    }

    const handleDelete = () => {
        const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa!");
        if (!userConfirmed) {
            return;
        } else {
            navigate(`/admin/deleteBook/${bookId}`);
        }
    }

    const handleHeartClick = () => { // Thêm vào danh sách yêu thích
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
        }

        setShowModal(true);
    }

    const handleClose = () => { // Đóng danh sách
        setNoticeSubmit("");
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
                    <DiscountBadge discount={props.book.discountPercent} />
                </Link>
                <div className="card-body">
                    <Link to={`books/${props.book.bookId}`} style={{ textDecoration: 'none' }}>
                        <h5 className="card-title">{props.book.bookName}</h5>
                    </Link>
                    <div className="price row">
                        {
                            props.book.discountPercent ?  
                        <span className="listed-price col-6 text-end">
                            <del>{NumberFormat(props.book.listedPrice)}</del>
                            <sup>đ</sup>
                        </span> : null
                        }
                       
                        <span className="discounted-price col text-end">
                            <strong style={{color:"red"}}>{NumberFormat(props.book.price)} <sup>đ</sup></strong>
                        </span>
                    </div>

                    <div className="row mt-2 align-items-center" role="group">
                        <div className="col-7">
                            <span>{renderRating(props.book.averageRate ? props.book.averageRate : 0)}</span>
                            <p style={{fontSize:"12px"}}> (Đã bán {SoldQuantityFormat(props.book.soldQuantity)})</p>
                        </div>
                        <div className="col-5 text-end">
                            <Button onClick={handleHeartClick} className="btn btn-secondary btn-block me-2">
                                <i className="fas fa-heart"></i>
                            </Button>
                            <AddCartItem bookId={bookId} quantity={1} isIcon={true} />  {/* Xử lý thêm sách */ }
                        </div>
                    </div>
                    {isAdmin() &&
                        (<div className="admin-button mt-2 text-end">
                            <Link to={`/admin/editBook/${bookId}`} className="btn btn-primary me-2">
                                <i className="fa fa-edit"></i></Link>

                            <button className="btn btn-danger" onClick={handleDelete}>
                                <i className="fas fa-trash"></i></button>
                        </div>
                        )}
                </div>
            </div>
            <AddBookToWishList // Xử lý thêm sách vào ds yêu thích
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
