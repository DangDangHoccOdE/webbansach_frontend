import React, { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import BookModel from "../../models/BookModel";
import ImageModel from "../../models/ImageModel";
import CategoryModel from "../../models/CategoryModel";
import { getBookByBookId } from "../../api/BookAPI";
import { getAllImagesByBook, getIconImageByBook } from "../../api/ImageAPI";
import { getAllCategory, getCategoryByBook } from "../../api/CategoryAPI";
import getBase64 from "../../layouts/utils/GetBase64";
import fetchWithAuth from "../../layouts/utils/AuthService";
import NumberFormat from "../../layouts/utils/NumberFormat";
import RequireAdmin from "../RequireAdmin";
import useScrollToTop from "../../hooks/ScrollToTop";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";


const EditBook: React.FC = () => {
    const isLoggedIn = useAuth();
    const navigate = useNavigate();
    const bookIdString = useParams();
    const [editBook,setEditBook] = useState<BookModel|null>(null)
    const [notice,setNotice] = useState("");
    const [iconImage,setIconImage] = useState<ImageModel|null>(null)
    const [imageList,setImageList] = useState<ImageModel[]>([])
    const [categoryOfBook,setCategoryOfBook] = useState<CategoryModel[]>([])
    const [pageNumber,setPageNumber] = useState(0)
    const [publishingYear,setPublishingYear] = useState(0)
    const [language,setLanguage] = useState('')
    const [isLoading,setIsLoading] = useState(true);
    let bookNumber = parseInt(bookIdString.bookId+'');

    useScrollToTop();

    // gọi api lấy thông tin sách
    useEffect(()=>{
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        setIsLoading(true);
        // gọi api lấy thông tin sách
          getBookByBookId((bookNumber))
            .then(
                 book=>setEditBook(book)
            ).catch(
                 error=>{
                    toast.error("Lỗi không thể tìm thấy sách!");
                    console.error({error});
                 })

        // gọi api lấy ảnh của sách
        getAllImagesByBook(bookNumber)
            .then(images=>setImageList(images)
            ).catch(
                error=>{
                    toast.error("Lỗi không thể tải ảnh của sách!")
                    console.error({error});
                })

        // Lấy ảnh chính của sách
        getIconImageByBook(bookNumber)
                .then(icon=>setIconImage(icon)
                ).catch(
                    error=>{
                        toast.error("Lỗi không thể tải ảnh của sách!")
                        console.error({error});
        })

        // lấy danh sách thể loại của 1 cuốn sách
        getCategoryByBook(bookNumber)
                .then(category=>setCategoryOfBook(category)
                 ).catch(
                    error=>{
                        toast.error("Lỗi không thể tải ảnh của sách!")
                        console.error({error});
        })
        setIsLoading(false);
    },[bookNumber, isLoggedIn, navigate])


    const [bookId,setBookId] = useState(0)
    const [bookName,setBookName] = useState<string|undefined>("")
    const [isbn,setIsbn] = useState("")
    const [price,setPrice] = useState(0)
    const [listedPrice,setListedPrice] = useState(0)
    const [description,setDescription] = useState("")
    const [discountPercent,setDiscountPercent] = useState(0)
    const [quantity,setQuantity] = useState(0)
    const [author,setAuthor] = useState("")
    const [averageRate,setAverageRate] = useState<number>(0)
    const [soldQuantity,setSoldQuantity] = useState(0)
    const [thumbnail,setThumbnail] = useState<string|null|undefined>("");
    const [relatedImage,setRelatedImage] = useState<string[]|null|undefined>(null)
    const [categoryList,setCategoryList] = useState<string[]|undefined>([])

    useEffect(()=>{
        if(editBook){
            setBookId(editBook.bookId);
            setBookName(editBook.bookName);
            setIsbn(editBook.isbn);
            setPrice(editBook.price);
            setListedPrice(editBook.listedPrice);
            setDescription(editBook.description);
            setDiscountPercent(editBook.discountPercent);
            setQuantity(editBook.quantity);
            setAuthor(editBook.author);
            setAverageRate(editBook.averageRate);
            setSoldQuantity(editBook.soldQuantity);
            setPageNumber(editBook.pageNumber);
            setPublishingYear(editBook.publishingYear);
            setLanguage(editBook.language);

            // handle Icon -> ''
            if(iconImage){
                setThumbnail(iconImage.imageData)
            }

            // handle RelatedImage
            const handleRelatedImage = imageList.map(images=>images.imageData).filter((image):image is string => image!==undefined).slice(1);
            setRelatedImage(handleRelatedImage);

            // handle CategoryList
            const handleCategoryList = categoryOfBook.map(category=>category.categoryId.toString()).filter((category):category is string=>category!==undefined);
            setCategoryList(handleCategoryList)
        }
    },[categoryOfBook, editBook, iconImage, imageList])

      // page number
      const [noticePageNumber,setNoticePageNumber] = useState("");
      const handlePageNumber = ()=>{
          if(pageNumber === 0 ){
              setNoticePageNumber("Số trang sách không thể bằng 0!")
              return true;
          }else{
              setNoticePageNumber("");
              return false;
          }
      }
  
      // Listed price
      const [noticeListedPrice,setNoticeListedPrice] = useState("");
      const handleListPrice = ()=>{
          if(listedPrice === 0 ){
              setNoticeListedPrice("Giá niêm yết phải lớn hơn 0!")
              return true;
          }else{
              setNoticeListedPrice("");
              return false;
          }
      }  
      
      // Listed price
      const [noticeQuantity,setNoticeQuantity] = useState("");
      const handleQuantity = ()=>{
          if(quantity === 0 ){
             setNoticeQuantity("Số lượng phải lớn hơn 0!")
              return true;
          }else{
              setNoticeQuantity("");
              return false;
          }
      }
  
      // publishing year
      const [noticePublishingYear,setNoticePublishingYear] = useState("");
      const handlePublishingYear = ()=>{
        const date = new Date();
          if(publishingYear === 0 ){
              setNoticePublishingYear("Năm xuất bản không thể bằng 0!")
              return true;
          }else if(publishingYear > date.getFullYear()){
            setNoticePublishingYear("Năm xuất bản không thể lớn hơn năm hiện tại!")
            return true;
        }else{
              setNoticePublishingYear("");
              return false;
          }
      }
  

    // averageRate
    const [noticeAverageRate,setNoticeAverageRate] = useState("");
    const handleAverageRate = ()=>{
        if(averageRate < 0 || averageRate>5){
            setNoticeAverageRate("Chỉ được đánh giá từ 1 đến 5 sao!")
            return;
        }else{
            setNoticeAverageRate("");
        }
    }

    // discount percent
    const [noticeDiscountPercent,setNoticeDiscountPercent] = useState("");
    const handleDiscountPercent = () =>{
        if(discountPercent<0 || discountPercent>100){
            setNoticeDiscountPercent("Chỉ được giảm giá từ 0 đến 100 phần trăm!")
            return;
        }else{
            setNoticeDiscountPercent("")
        }
    }

    // convert file to string
    const handleThumbnailChange=async (e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){
            const fileChoose = e.target.files[0];
            if(fileChoose){
                try{
                    const base64Thumbnail = await getBase64(fileChoose);
                     setThumbnail(base64Thumbnail);
                }catch(error){
                     console.error('Lỗi khi chuyển đổi sang base64:', error);
                     return null;
                }
            }
        }
    }

    // RelateImageChange
    const handleRelatedImagesChange=async (e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){
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
             setRelatedImage(base64Images.filter( (img)=>img!==null) as string[]);
        };
    }

    // get list Category
    const [categoryListAPI,setCategoryListAPI] = useState<CategoryModel[]>([])
    useEffect(()=>{
        getAllCategory()
            .then(
                result=> setCategoryListAPI(result)
            ).catch(
                error=> {setNotice("Không thể lấy được danh sách thể loại!")
                        console.log("Không thể lấy được danh sách thể loại! ",error)
                })
    },[])

    const handleCategoryChange=(e:ChangeEvent<HTMLSelectElement>)=>{
        const selectOption = Array.from(e.target.selectedOptions).map(otp=>otp.value)
        setCategoryList(selectOption);
    }   

    // update price
    useEffect(()=>{
        const updatePrice = listedPrice*(1-discountPercent/100);
        setPrice(updatePrice);
    },[listedPrice,discountPercent])

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

             // Kiểm tra lại các điều kiện
             const isPageNumberInvalid = handlePageNumber();
             const isPublishingYearInvalid = handlePublishingYear();  
             const isListPriceInvalid = handleListPrice();
             const isQuantityInvalid = handleQuantity();
  
     
             // Nếu bất kỳ điều kiện nào không thỏa mãn, ngăn chặn submit
             if (isPageNumberInvalid || isPublishingYearInvalid || isListPriceInvalid || isQuantityInvalid) {
              setNotice("Lỗi, vui lòng kiểm tra lại thông tin !")
                 return;
             }
        const token = localStorage.getItem('accessToken')
        try{
            const response = await fetchWithAuth(`http://localhost:8080/books/editBook/${bookId}`,
                {
                    method:"PUT",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":`Bearer ${token}`
                    },
                    body:JSON.stringify({
                        bookName,
                        isbn,
                        price,
                        listedPrice,
                        description,
                        quantity,
                        author,
                        averageRate,
                        thumbnail,
                        categoryList,
                        discountPercent,
                        relatedImage,
                        soldQuantity,
                        pageNumber,
                        language,
                        publishingYear
                }
            )})

                if(response.ok){
                    setNotice("")
                    toast.success("Đã sửa sách thành công!")
                            console.log("Đã sửa sách thành công!")
                        }else{
                            toast.error("Gặp lỗi trong quá trình sửa sách!")
                            console.log("Sách chưa được sửa!")
                            setIsLoading(false);
                }
             }
        catch(error){
            console.log("Lỗi sửa sách, ",error);
            setIsLoading(false);
        }finally{
            setIsLoading(false);
        }
    }
    return( 
<div className="container mt-5">
    <div className="row justify-content-center">
        <div className="col-lg-10">
            <h1 className="text-center mb-4">Chỉnh sửa sách</h1>
            {isLoading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input type="number" id="bookId" value={bookId} hidden readOnly />

                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0"><i className="fas fa-info-circle me-2"></i>Thông tin cơ bản</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="bookName" className="form-label">
                                    <i className="fas fa-book me-2"></i>Tên sách<span className="text-danger">*</span>
                                </label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    id="bookName"
                                    value={bookName}
                                    onChange={e => setBookName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="isbn" className="form-label">
                                    <i className="fas fa-barcode me-2"></i>ISBN<span className="text-danger">*</span>
                                </label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    id="isbn"
                                    value={isbn}
                                    onChange={e => setIsbn(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="author" className="form-label">
                                    <i className="fas fa-user-edit me-2"></i>Tác giả<span className="text-danger">*</span>
                                </label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    id="author"
                                    value={author}
                                    onChange={e => setAuthor(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="language" className="form-label">
                                    <i className="fas fa-language me-2"></i>Ngôn ngữ<span className="text-danger">*</span>
                                </label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    id="language"
                                    value={language}
                                    onChange={e => setLanguage(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0"><i className="fas fa-dollar-sign me-2"></i>Giá cả</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label htmlFor="listedPrice" className="form-label">Giá niêm yết<span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input 
                                        className="form-control"
                                        type="number"
                                        id="listedPrice"
                                        value={listedPrice}
                                        onChange={e => setListedPrice(parseFloat(e.target.value))}
                                        min={0}
                                        onBlur={handleListPrice}
                                        required
                                    />
                                    <span className="input-group-text">VND</span>
                                </div>
                                <small className="text-danger">{noticeListedPrice}</small>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="discountPercent" className="form-label">Phần trăm giảm giá</label>
                                <div className="input-group">
                                    <input 
                                        className="form-control"
                                        type="number"
                                        id="discountPercent"
                                        value={discountPercent}
                                        onChange={e => setDiscountPercent(parseFloat(e.target.value))}
                                        min={0}
                                        max={100}
                                        onBlur={handleDiscountPercent}
                                        required
                                    />
                                    <span className="input-group-text">%</span>
                                </div>
                                <small className="text-danger">{noticeDiscountPercent}</small>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="price" className="form-label">Giá bán</label>
                                <div className="input-group">
                                    <span className="form-control">{NumberFormat(listedPrice*(1-discountPercent/100))}</span>
                                    <span className="input-group-text">VND</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0"><i className="fas fa-book-open me-2"></i>Chi tiết sách</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="quantity" className="form-label">Số lượng<span className="text-danger">*</span></label>
                                <input 
                                    className="form-control"
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    onChange={e => setQuantity(parseInt(e.target.value))}
                                    onBlur={handleQuantity}
                                    required
                                />
                                <small className="text-danger">{noticeQuantity}</small>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="soldQuantity" className="form-label">Đã bán<span className="text-danger">*</span></label>
                                <input 
                                    className="form-control"
                                    type="number"
                                    id="soldQuantity"
                                    value={soldQuantity}
                                    onChange={e => setSoldQuantity(parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="pageNumber" className="form-label">Số trang<span className="text-danger">*</span></label>
                                <input 
                                    className="form-control"
                                    type="number"
                                    id="pageNumber"
                                    min={0}
                                    step={1}
                                    value={pageNumber}
                                    onChange={e => setPageNumber(parseInt(e.target.value))}
                                    onBlur={handlePageNumber}
                                    required
                                />
                                <small className="text-danger">{noticePageNumber}</small>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="publishingYear" className="form-label">Năm xuất bản<span className="text-danger">*</span></label>
                                <input 
                                    className="form-control"
                                    type="number"
                                    id="publishingYear"
                                    min={0}
                                    value={publishingYear}
                                    onChange={e => setPublishingYear(parseInt(e.target.value))}
                                    onBlur={handlePublishingYear}
                                    required
                                />
                                <small className="text-danger">{noticePublishingYear}</small>
                            </div>
                            <div className="col-12">
                                <label htmlFor="description" className="form-label">Mô tả<span className="text-danger">*</span></label>
                                <textarea 
                                    className="form-control"
                                    id="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={3}
                                    required
                                ></textarea>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="averageRate" className="form-label">Tỉ lệ đánh giá<span className="text-danger">*</span></label>
                                <input 
                                    className="form-control"
                                    type="number"
                                    id="averageRate"
                                    min={0}
                                    max={5}
                                    step={0.1}
                                    value={averageRate}
                                    onChange={e => setAverageRate(parseFloat(e.target.value))}
                                    onBlur={handleAverageRate}
                                    required
                                />
                                <small className="text-danger">{noticeAverageRate}</small>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="categoryList" className="form-label">Thể loại<span className="text-danger">*</span></label>
                                <select 
                                    id="categoryList"
                                    multiple
                                    className="form-select"
                                    value={categoryList}
                                    onChange={handleCategoryChange}
                                    required
                                >
                                    {categoryListAPI.map(temp => (
                                        <option key={temp.categoryId} value={temp.categoryId}>
                                            {temp.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-warning text-dark">
                        <h5 className="mb-0"><i className="fas fa-images me-2"></i>Hình ảnh</h5>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="thumbnail" className="form-label">Ảnh chính<span className="text-danger">*</span></label>
                            <input 
                                type="file"
                                id="thumbnail"
                                className="form-control"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />
                            {thumbnail && (
                                <div className="mt-2">
                                    <img src={thumbnail} alt="Ảnh chính" className="img-thumbnail" style={{width: "100px", height: "100px"}} />
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="relatedImages" className="form-label">Ảnh liên quan<span className="text-danger">*</span></label>
                            <input 
                                type="file"
                                id="relatedImages"
                                className="form-control"
                                accept="image/*"
                                onChange={handleRelatedImagesChange}
                                multiple
                            />
                            <div className="mt-2 d-flex flex-wrap gap-2">
                                {relatedImage?.map((image, index) => (
                                    <img key={index} src={image} alt={`Ảnh liên quan ${index+1}`} className="img-thumbnail" style={{width: "100px", height: "100px"}} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {notice && <div className="alert alert-danger" role="alert">{notice}</div>}

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">
                        <i className="fas fa-save me-2"></i>Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
    )
}

const EditBook_Admin=RequireAdmin(EditBook)
export default EditBook_Admin