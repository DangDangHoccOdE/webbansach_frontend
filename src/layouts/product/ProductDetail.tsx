import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { CircularProgress, Container, Grid, Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import { getNumberOfReviewByBookId } from "../../api/ReviewAPI";
import { AddShoppingCart, RemoveShoppingCart } from "@mui/icons-material";

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
  const bookIdSelected:number[] = [bookIdNumber];

  const [book, setBook] = useState<BookModel | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [noticeError, setNoticeError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [categoryOfBook, setCategoryOfBook] = useState<CategoryModel[]>([]);
  const [numberOfReview, setNumberOfReview] = useState(0);
  const navigate = useNavigate();

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

  useEffect(() => {
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

      getNumberOfReviewByBookId(book.bookId) // Lấy số lượng đánh giá
        .then(star => {
          setNumberOfReview(star);
        }).catch(error => {
          console.error(error.message);
        });
    }
  }, [book]);

  const handlePurchase = () => {
    if(book){
      navigate("/order/createOrder", { state: { selectedItems:bookIdSelected, 
        total: book?.price * quantity, 
        bookVoucher:null, 
        shipVoucher:null,
        totalProduct:quantity,
        isBuyNow:true,} });
      }
  };

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
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        {/* Product Image Section */}
        <Grid item xs={12} md={6}>
          <ProductImage bookId={bookIdNumber} />
        </Grid>

        {/* Product Info and Purchase Section */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {book.bookName}
              </Typography>
              <div className="d-flex align-items-center mb-3">
                {renderRating(book.averageRate || 0)}
                <Typography variant="body2" color="textSecondary" className="ms-2">
                  {book.averageRate} | {SoldQuantityFormat(book.soldQuantity)} Đã bán | {SoldQuantityFormat(numberOfReview)} Đánh giá
                </Typography>
              </div>
              <div className="d-flex align-items-center mb-3">
                {book.discountPercent > 0 && (
                  <del className="me-3 text-secondary">
                    <Typography variant="body1">{NumberFormat(book.listedPrice)} đ</Typography>
                  </del>
                )}
                <Typography variant="h5" className="text-danger">
                  {NumberFormat(book.price)} đ
                </Typography>
              </div>
              <p className="mb-3">Chính Sách Trả Hàng: Trả hàng 15 ngày - <span className="text-muted">Đổi ý miễn phí</span></p>
              <div className="d-flex align-items-center mb-3">
                <IconButton color="secondary" onClick={reduceQuantity}>
                  <RemoveShoppingCart />
                </IconButton>
                <input type="number" className="form-control text-center" value={quantity} onChange={handleQuantity} min={1} max={book.quantity} />
                <IconButton color="secondary" onClick={increaseQuantity}>
                  <AddShoppingCart />
                </IconButton>
              </div>
              <div className="text-center mb-3">
                <Typography variant="h6">Tạm Tính: {NumberFormat(quantity * book.price)} đ</Typography>
              </div>
              <div className="d-grid gap-2">
                <Button variant="contained" color="error" onClick={handlePurchase}>
                  Mua ngay
                </Button>
                <AddCartItem bookId={bookIdNumber} quantity={quantity} isIcon={false} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>Chi tiết sản phẩm</Typography>
              <table className="table table-bordered">
                <tbody>
                  <tr><td>Thể loại:</td><td>{categoryOfBook.map(c => c.categoryName).join(', ')}</td></tr>
                  <tr><td>Ngôn ngữ:</td><td>{book.language}</td></tr>
                  <tr><td>Năm xuất bản:</td><td>{book.publishingYear}</td></tr>
                  <tr><td>Số trang:</td><td>{book.pageNumber}</td></tr>
                  <tr><td>Tình trạng kho:</td><td>{book.quantity}</td></tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Description */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>Mô tả sản phẩm</Typography>
              <div dangerouslySetInnerHTML={{ __html: book.description }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>Đánh giá của khách hàng</Typography>
          <ReviewProduct bookId={bookIdNumber} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetail;