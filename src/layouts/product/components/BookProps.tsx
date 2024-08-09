/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getIconImageByBook } from "../../../api/ImageAPI";
import { Link, useNavigate } from "react-router-dom";
import NumberFormat from "../../utils/NumberFormat";
import isAdmin from "../../utils/CheckCurrentRole";
import AddBookToWishList from "../../../user/wishList/AddBookToWishList";
import useScrollToTop from "../../../hooks/ScrollToTop";
import AddCartItem from "../../../user/cartItem/AddCartItem";
import { useAuth } from "../../../context/AuthContext";
import SoldQuantityFormat from "../../utils/SoldQuantityFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Badge, Button, Card } from "react-bootstrap";
import renderRating from "../../utils/StarRate";

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
            navigate(`/books/deleteBook/${bookId}`);
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
        <Card className="h-100 shadow-sm">
        <Link to={`/books/${bookId}`}>
            <Card.Img 
                variant="top" 
                src={imageData} 
                alt={props.book.description} 
                style={{ height: '200px', objectFit: 'cover' }} 
            />
            {props.book.discountPercent > 0 && (
                <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                    -{props.book.discountPercent}%
                </Badge>
            )}
        </Link>
        <Card.Body className="d-flex flex-column">
            <Link to={`/books/${bookId}`} className="text-decoration-none">
                <Card.Title className="text-truncate">{props.book.bookName}</Card.Title>
            </Link>
            <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        {props.book.discountPercent > 0 && (
                            <span className="text-muted text-decoration-line-through me-2">
                                {NumberFormat(props.book.listedPrice)}đ
                            </span>
                        )}
                        <span className="text-danger fw-bold">
                            {NumberFormat(props.book.price)}đ
                        </span>
                    </div>
                    <div>{renderRating(props.book.averageRate || 0)}</div>
                </div>
                <small className="text-muted">Đã bán {SoldQuantityFormat(props.book.soldQuantity)}</small>
                <div className="d-flex justify-content-between mt-3">
                    <Button variant="outline-secondary" size="sm" onClick={handleHeartClick}>
                        <FontAwesomeIcon icon={faHeart} />
                    </Button>
                    <AddCartItem bookId={bookId} quantity={1} isIcon={true} />
                </div>
            </div>
            {isAdmin() && (
                <div className="d-flex justify-content-end mt-3">
                    <Link to={`/books/editBook/${bookId}`} className="btn btn-outline-primary btn-sm me-2">
                        <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </div>
            )}
        </Card.Body>
        <AddBookToWishList
            bookId={bookId}
            handleClose={handleClose}
            showModal={showModal}
            setNoticeSubmit={setNoticeSubmit}
            noticeSubmit={noticeSubmit}
        />
    </Card>
);
}

export default BookProps;
