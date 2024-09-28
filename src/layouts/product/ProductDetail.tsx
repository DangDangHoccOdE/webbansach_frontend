import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookByBookId, getBookListByCategory } from "../../api/BookAPI";
import BookModel from "../../models/BookModel";
import ProductImage from "./components/ProductImage";
import renderRating, { formatStartRate} from "../utils/StarRate";
import NumberFormat from "../utils/NumberFormat";
import useScrollToTop from "../../hooks/ScrollToTop";
import ReviewProduct from "./components/ReviewProduct";
import AddCartItem from "../../user/cartItem/AddCartItem";
import SoldQuantityFormat from "../utils/SoldQuantityFormat";
import CategoryModel from "../../models/CategoryModel";
import { getCategoryByBook } from "../../api/CategoryAPI";
import { CircularProgress, Container, Grid ,Typography, Button, IconButton, Box, Paper, Table, TableBody, TableRow, TableCell, TextField, Divider} from "@mui/material";
import { getNumberOfReviewByBookId } from "../../api/ReviewAPI";
import { AddShoppingCart, RemoveShoppingCart } from "@mui/icons-material";
import BookProps from "./components/BookProps";

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
  const [bookRelate,setBookRelate] = useState<BookModel[]>([])
  const [isRefresh,setIsRefresh] = useState(false);
 
  const handleQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    const quantityNow = parseInt(event.target.value);
    const inventoryNumber = book && book.quantity ? book.quantity : 0;
    if (!isNaN(quantityNow) && quantityNow >= 1 && quantityNow <= inventoryNumber) {
      setQuantity(quantityNow);
    }
  };

  const increaseQuantity = () => {
    const quantityNow = book && book.quantity ? (book.quantity-book.soldQuantity) : 0;
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
  }, [isRefresh, bookIdNumber]);

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

  useEffect(()=>{  // Lấy đại diện các sách liên quan theo thể loại đầu tiên của cuốn sách
    if(categoryOfBook.length>0){
      const currentPage:number =0;
      const categoryId:number=categoryOfBook[0].categoryId;
        getBookListByCategory(categoryId,currentPage)
            .then(bookList=>{
                  const bookRelated:BookModel[] = bookList.resultBooks.filter(book=>book.bookId!==bookIdNumber) 
                  setBookRelate(bookRelated);
            }).catch(error=>{
              console.error({error})
            })
    }
  },[bookIdNumber, categoryOfBook])

  const handlePurchase = () => {
    if(book){
      navigate("/order/orderSummary", { state: { selectedItems:bookIdSelected, 
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
     <Paper elevation={3} >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImage bookId={bookIdNumber} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 ,position:"relative"}}>
            {
              book.quantity === book.soldQuantity && 
              <Box sx={{ position: 'absolute', 
                top:6, 
                right: 8, 
                backgroundColor: 'red', 
                color: 'white', 
                padding: '1px 6px', 
                borderRadius: '4px',
                fontSize: '0.2rem'}}>
                <Typography >
                    Hết hàng
                </Typography>
              </Box>
              
            }
            <Typography variant="h4" gutterBottom>{book.bookName}</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              {renderRating(book.averageRate || 0)}
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {formatStartRate(book.averageRate)} | {SoldQuantityFormat(book.soldQuantity)} Đã bán | {SoldQuantityFormat(numberOfReview)} Đánh giá
              </Typography>
            </Box>
            <Box display="flex" alignItems="baseline" mb={2}>
              {book.discountPercent > 0 && (
                <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through', mr: 2 }}>
                  {NumberFormat(book.listedPrice)} đ
                </Typography>
              )}
              <Typography variant="h5" color="error"> 
                {NumberFormat(book.price)} đ 
              </Typography>
              {
                book.discountPercent>0 &&  
                <Box 
                sx={{ 
                  backgroundColor: '#d32f2f', 
                  color: '#fff', 
                  padding: '1px 4px', 
                  borderRadius: '2px',
                  fontWeight: 'bold',
                  fontSize:"0.75rem",
                  ml:2
                }}
              >
                - {book.discountPercent}% GIẢM
              </Box>
              }
           
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" mb={2}>
              Chính Sách Trả Hàng: Trả hàng 15 ngày - <span style={{ color: 'text.secondary' }}>Đổi ý miễn phí</span>
            </Typography>
            <Typography variant="body2" mb={2}>
              Còn lại trong kho: {book.quantity - book.soldQuantity} sản phẩm
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <IconButton color="primary" onClick={reduceQuantity}>
                <RemoveShoppingCart />
              </IconButton>
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantity}
                inputProps={{ min: 1, max: book.quantity, style: { textAlign: 'center' } }}
                sx={{ width: '60px', mx: 1 }}
              />
              <IconButton color="primary" onClick={increaseQuantity}>
                <AddShoppingCart />
              </IconButton>
            </Box>
            <Typography variant="h6" mb={2}>
              Tạm Tính: {NumberFormat(quantity * book.price)} đ
            </Typography>
            <Box display="flex" gap={2}>
              <Button disabled={book.soldQuantity === book.quantity?true:false} variant="contained" color="error" onClick={handlePurchase} fullWidth>
                Mua ngay
              </Button>
              <AddCartItem isDisabled={book.soldQuantity === book.quantity?true:false}  bookId={bookIdNumber} quantity={quantity} isIcon={false} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>Chi tiết sản phẩm</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Thể loại:</TableCell>
                  <TableCell>{categoryOfBook.map(c => c.categoryName).join(', ')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ngôn ngữ:</TableCell>
                  <TableCell>{book.language}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Năm xuất bản:</TableCell>
                  <TableCell>{book.publishingYear}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Số trang:</TableCell>
                  <TableCell>{book.pageNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tình trạng kho:</TableCell>
                  <TableCell>{book.quantity - book.soldQuantity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nhà xuất bản:</TableCell>
                  <TableCell>{book.author}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>Mô tả sản phẩm</Typography>
            <div dangerouslySetInnerHTML={{ __html: book.description }} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>Đánh giá của khách hàng</Typography>
            <ReviewProduct bookId={bookIdNumber} setIsRefresh={setIsRefresh}/>   {/* Đánh giá của khách hàng */}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>Sản phẩm liên quan</Typography>
            <Grid container spacing={2}>
              {bookRelate.slice(0, 8).map((book) => (
                <Grid item xs={12} sm={6} md={3} key={book.bookId}>
                  <BookProps book={book} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      </Paper>
  </Container>
);
}

export default ProductDetail;