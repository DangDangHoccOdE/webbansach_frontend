import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookByBookId } from "../../api/BookAPI";
import BookModel from "../../models/BookModel";
import ProductImage from "./components/ProductImage";
import renderRating from "../utils/StarRate";
import NumberFormat from "../utils/NumberFormat";
import useScrollToTop from "../../hooks/ScrollToTop";
import ReviewProduct from "./components/ReviewProduct";
import AddCartItem from "../../user/cartItem/AddCartItem";
import SoldQuantityFormat from "../utils/SoldQuantityFormat";
import CategoryModel from "../../models/CategoryModel";
import { getCategoryByBook } from "../../api/CategoryAPI";
import { CircularProgress } from "@mui/material";

const ProductDetail: React.FC = () => {
  useScrollToTop();
  const { bookId } = useParams();
  let bookIdNumber = 0;

  try {
    bookIdNumber = parseInt(bookId + '');
    if (Number.isNaN(bookIdNumber)) {
      bookIdNumber = 0;
    }
  } catch (error) {
    bookIdNumber = 0;
    console.error("Error: ", error);
  }

  const [book, setBook] = useState<BookModel | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [noticeError, setNoticeError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [categoryOfBook, setCategoryOfBook] = useState<CategoryModel[]>([]);

  const handleQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    const quantityNow = parseInt(event.target.value);
    const inventoryNumber = book && book.quantity ? book.quantity : 0;
    if (!isNaN(quantityNow) && quantityNow >= 1 && quantityNow <= inventoryNumber) {
      setQuantity(quantityNow);
    }
  };

  const increaseQuantity = () => {
    const quantityNow = book && book.quantity ? book.quantity : 0;
    if (quantity < quantityNow) {
      setQuantity(quantity + 1);
    }
  };

  const reduceQuantity = () => {
    if (quantity >= 2) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    getBookByBookId(bookIdNumber)
      .then(book => {
        setBook(book);
        setLoadingData(false);
      })
      .catch(error => {
        setLoadingData(false);
        setNoticeError(error.message);
      });

  }, [bookId, bookIdNumber]);

  useEffect(()=>{
    if (book) {
      getCategoryByBook(book.bookId)
        .then(category => {
          setCategoryOfBook(category);
          setLoadingData(false);
        })
        .catch(error => {
          setLoadingData(false);
          setNoticeError(error.message);
        });
    }
  },[book])

  const handlePurchase = () => {
    // Xử lý khi người dùng nhấn "Mua ngay"
  }

  if (loadingData) {
    return (
      <div className="text-center mt-5">
          <CircularProgress color="inherit" />
      </div>
    );
  }

  if (noticeError) {
       return <div className="alert alert-danger text-center" role="alert">{noticeError}</div>;
  }

  if (!book) {
    return <div className="alert alert-warning text-center" role="alert">Sách không tồn tại!</div>;
  }

  return (
<div className="container mt-5" style={{ backgroundColor: '#f8f9fa', border: '1px solid gray' }}>
      <div className="border border-white" style={{ padding: '1rem' }}>
      <div className="row">
        {/* Product Image Section */}
        <div className="col-lg-4">
          <ProductImage bookId={bookIdNumber} />
        </div>
  
        {/* Product Info and Purchase Section */}
        <div className="col-lg-8">
          <div className="row">
            <div className="col-8">
              <div className="product-info">
                <h1 className="product-title">{book.bookName}</h1>
                <div className="product-meta">
                  <div className="product-rating">
                    <span className="ml-2">{book.averageRate}</span>
                    {renderRating(book.averageRate || 0)}
                  </div>
                  <span className="product-sales">Đã bán: {SoldQuantityFormat(book.soldQuantity)}</span>
                </div>
                <div className="border border-secondary" style={{ backgroundColor: '#f8f9fa', padding: '0.5rem' }}>                    <div className="d-flex justify-content-start align-items-center">
                    {book.discountPercent > 0 && (
                      <del className="me-3" style={{ color: "gray" }}>
                        {NumberFormat(book.listedPrice)} đ
                      </del>
                    )}
                    <h2 className="product-price" style={{ color: "red" }}>
                      {NumberFormat(book.price)} đ
                    </h2>
                  </div>
                </div>
                <span>Chính Sách Trả Hàng 
                      <span>Trả hàng 15 ngày </span>
                      <span style={{color:"grey"}}>Đổi ý miễn phí</span>
                  </span>
              </div>
            </div>
  
            <div className="col-4">
              {/* Purchase Options */}
              <div className="purchase-options mt-4">
                <div className="mb-2">Số lượng</div>
                <div className="d-flex align-items-center">
                  <button className="btn btn-outline-secondary me-2" onClick={reduceQuantity}>-</button>
                  <input type="number" className="form-control text-center" value={quantity} onChange={handleQuantity} min={1} max={book.quantity} />
                  <button className="btn btn-outline-secondary ms-2" onClick={increaseQuantity}>+</button>
                </div>
                {book.price && (
                  <div className="mt-2 text-center">
                    Số tiền tạm tính: <br />
                    <h4>{NumberFormat(quantity * book.price)} đ</h4>
                  </div>
                )}
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-danger mt-3" onClick={handlePurchase}>Mua ngay</button>
                  <AddCartItem bookId={bookIdNumber} quantity={quantity} isIcon={false} />
                </div>
              </div>
            </div>
          </div>
  
          {/* Product Details */}
          <div className="product-details mt-5">
            <h3>Chi tiết sản phẩm</h3>
            <table className="table">
              <tbody>
                <tr><td>Thể loại:</td><td>{categoryOfBook.map(c => c.categoryName).join(', ')}</td></tr>
                <tr><td>Ngôn ngữ:</td><td>{book.language}</td></tr>
                <tr><td>Năm xuất bản:</td><td>{book.publishingYear}</td></tr>
                <tr><td>Số trang:</td><td>{book.pageNumber}</td></tr>
                <tr><td>Tình trạng kho:</td><td>{book.quantity}</td></tr>
              </tbody>
            </table>
          </div>
  
          {/* Product Description */}
          <div className="product-description mt-5">
            <h3>Mô tả sản phẩm</h3>
            <div dangerouslySetInnerHTML={{ __html: book.description }} />
          </div>
        </div>
      </div>
  
      {/* Reviews Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h2>Đánh giá của khách hàng</h2>
          <ReviewProduct bookId={bookIdNumber} />
        </div>
      </div>
    </div>
  </div>
  )
}
  
export default ProductDetail;
