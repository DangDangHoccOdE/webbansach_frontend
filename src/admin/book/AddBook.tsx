import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import getBase64 from "../../layouts/utils/GetBase64";
import CategoryModel from "../../models/CategoryModel";
import { getAllCategory } from "../../api/CategoryAPI";
import fetchWithAuth from "../../layouts/utils/AuthService";
import NumberFormat from "../../layouts/utils/NumberFormat";
import RequireAdmin from "../RequireAdmin";
import useScrollToTop from "../../hooks/ScrollToTop";
import { toast } from "react-toastify";


const BookForm: React.FC = (props) => {
    useScrollToTop();
    const [thumbnail,setThumbnail] = useState<string|null>(null);
    const [relatedImage,setRelatedImage] = useState<string[]|null>([])
    const [categoryIsChoose,setCategoryIsChoose] = useState<string[]>([])

    // page number
    const [noticePageNumber,setNoticePageNumber] = useState("");
    const handlePageNumber = ()=>{
        if(book.pageNumber === 0 ){
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
        if(book.listedPrice === 0 ){
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
        if(book.quantity === 0 ){
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
        if(book.publishingYear === 0 ){
            setNoticePublishingYear("Năm xuất bản không thể bằng 0!")
            return true;
        }else if(book.publishingYear > date.getFullYear()){
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
        if(book.averageRate < 0 || book.averageRate>5){
            setNoticeAverageRate("Chỉ được đánh giá từ 1 đến 5 sao!")
            return;
        }else{
            setNoticeAverageRate("");
        }
    }

    // discount percent
    const [noticeDiscountPercent,setNoticeDiscountPercent] = useState("");
    const handleDiscountPercent = () =>{
        if(book.discountPercent<0 || book.discountPercent>100){
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
            if(e.target.files.length>5){
                setNotice("Vui lòng chọn tối đa 5 ảnh")
                return;
            }
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
    const [categoryList,setCategoryList] = useState<CategoryModel[]>([])
    const [notice,setNotice] = useState("")
    useEffect(()=>{
        getAllCategory()
            .then(
                result=> setCategoryList(result)
            ).catch(
                error=> {setNotice("Không thể lấy được danh sách thể loại!")
                        console.log("Không thể lấy được danh sách thể loại! ",error)
                })
    },[])

    const handleCategoryChange=(e:ChangeEvent<HTMLSelectElement>)=>{
        const selectOption = Array.from(e.target.selectedOptions).map(otp=>otp.value)
        setCategoryIsChoose(selectOption);
    }   

    const [book, setBook] = useState({
        bookId:0,
        bookName:'',
        isbn:'',
        price:0,
        listedPrice:0,
        description:'',
        quantity:0,
        author:'',
        averageRate:0,
        soldQuantity:0,
        discountPercent:0,
        pageNumber:0,
        language:'',
        publishingYear:0,
        thumbnail:thumbnail,
        relatedImage:relatedImage,
        categoryList:categoryIsChoose
    })

        useEffect(()=>{
            const priceUpdate = book.listedPrice *  (1-book.discountPercent/100);
            setBook(prevBook=>({...prevBook,price:priceUpdate,relatedImage,categoryList:categoryIsChoose,thumbnail}));
        },[relatedImage,categoryIsChoose,thumbnail,book.listedPrice,book.discountPercent])

        // Reset File
        const inputFile = useRef<any>();
        const inputMultipleFile = useRef<any>();
        const handleReset = () => {
            if (inputFile.current) {
                inputFile.current.value = "";
            }
            if (inputMultipleFile.current) {
                inputMultipleFile.current.value = "";
            }
        };
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
            const response = await fetchWithAuth("http://localhost:8080/books/addBook",
                {
                    method:"POST",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":`Bearer ${token}`
                    },
                    body:JSON.stringify(book)
                }
            )
                if(response.ok){
                    setNotice("")
                         toast.success("Đã thêm sách thành công!")
                            setBook({
                                bookId:0,
                                bookName:'',
                                isbn:'',
                                price:0,
                                listedPrice:0,
                                description:'',
                                quantity:0,
                                author:'',
                                averageRate:0,
                                thumbnail:"",
                                categoryList:[],
                                discountPercent:0,
                                relatedImage:[],
                                soldQuantity:0,
                                pageNumber:0,
                                language:'',
                                publishingYear:0,
                            })
                            setCategoryIsChoose([]);
                            setRelatedImage([]);
                            setThumbnail('');
                            handleReset();
                            console.log("Đã thêm sách thành công!")
                        }else{
                            toast.error("Gặp lỗi trong quá trình thêm sách!")
                            console.log("Sách chưa được thêm!")
                }
    
    }
    return (
        <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Thêm sách mới</h2>
                <form onSubmit={handleSubmit}>
                  <input type="number" id="bookId" value={book.bookId} hidden readOnly />
      
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="bookName" className="form-label">
                        <i className="fas fa-book me-2"></i>Tên sách<span className="text-danger"> *</span>
                      </label>
                      <input 
                        className="form-control"
                        type="text"
                        id="bookName"
                        value={book.bookName}
                        onChange={e => setBook({ ...book, bookName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="isbn" className="form-label">
                        <i className="fas fa-barcode me-2"></i>ISBN<span className="text-danger"> *</span>
                      </label>
                      <input 
                        className="form-control"
                        type="text"
                        id="isbn"
                        value={book.isbn}
                        onChange={e => setBook({ ...book, isbn: e.target.value })}
                        required
                      />
                    </div>
                  </div>
      
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="listedPrice" className="form-label">
                        <i className="fas fa-tag me-2"></i>Giá niêm yết <span className="text-danger"> *</span>
                      </label>
                      <div className="input-group">
                        <input 
                          className="form-control"
                          type="number"
                          id="listedPrice"
                          value={book.listedPrice}
                          onChange={e => setBook({ ...book, listedPrice: parseFloat(e.target.value) })}
                          min={0}
                          onBlur={handleListPrice}
                          required
                        />
                        <span className="input-group-text">VND</span>
                      </div>
                      <small className="text-danger">{noticeListedPrice}</small>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="discountPercent" className="form-label">
                        <i className="fas fa-percent me-2"></i>Phần trăm giảm giá
                      </label>
                      <div className="input-group">
                        <input 
                          className="form-control"
                          type="number"
                          id="discountPercent"
                          min={0}
                          max={100}
                          value={book.discountPercent}
                          onChange={e => setBook({ ...book, discountPercent: parseFloat(e.target.value) })}
                          onBlur={handleDiscountPercent}
                          required
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      <small className="text-danger">{noticeDiscountPercent}</small>
                    </div>
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      <i className="fas fa-money-bill-wave me-2"></i>Giá bán (Giá niêm yết * Phần trăm giảm giá)<span className="text-danger"> *</span>
                    </label>
                    <div className="input-group">
                      <span className="form-control">{NumberFormat(book.listedPrice*(1-book.discountPercent/100))}</span>
                      <span className="input-group-text">VND</span>
                    </div>
                  </div>
      
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="quantity" className="form-label">
                        <i className="fas fa-cubes me-2"></i>Số lượng<span className="text-danger"> *</span>
                      </label>
                      <input 
                        className="form-control"
                        type="number"
                        id="quantity"
                        value={book.quantity}
                        onChange={e => setBook({ ...book, quantity: parseInt(e.target.value) })}
                        required
                        onBlur={handleQuantity}
                      />
                      <small className="text-danger">{noticeQuantity}</small>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="soldQuantity" className="form-label">
                        <i className="fas fa-shopping-cart me-2"></i>Đã Bán<span className="text-danger"> *</span>
                      </label>
                      <input 
                        className="form-control"
                        type="number"
                        id="soldQuantity"
                        value={book.soldQuantity}
                        onChange={e => setBook({ ...book, soldQuantity: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      <i className="fas fa-align-left me-2"></i>Mô tả<span className="text-danger"> *</span>
                    </label>
                    <textarea 
                      className="form-control"
                      id="description"
                      value={book.description}
                      onChange={e => setBook({ ...book, description: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>
      
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="author" className="form-label">
                        <i className="fas fa-user-edit me-2"></i>Tác giả<span className="text-danger"> *</span>
                      </label>
                      <input 
                        className="form-control"
                        type="text"
                        id="author"
                        value={book.author}
                        onChange={e => setBook({ ...book, author: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="pageNumber" className="form-label">
                        <i className="fas fa-file-alt me-2"></i>Số trang<span className="text-danger"> *</span>
                      </label>
                      <input 
                        className="form-control"
                        type="number"
                        id="pageNumber"
                        min={0}
                        step={1}
                        value={book.pageNumber}
                        onChange={e => setBook({ ...book, pageNumber:parseInt(e.target.value) })}
                        required
                        onBlur={handlePageNumber}
                      />
                      <small className="text-danger">{noticePageNumber}</small>
                    </div>
                  </div>
      
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="language" className="form-label">
                        <i className="fas fa-language me-2"></i>Ngôn ngữ<span className="text-danger"> *</span>
                      </label>
                      <input 
                        className="form-control"
                        type="text"
                        id="language"
                        value={book.language}
                        onChange={e => setBook({ ...book, language: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="publishingYear" className="form-label">
                        <i className="fas fa-calendar-alt me-2"></i>Năm xuất bản<span className="text-danger"> *</span>
                      </label>
                      <input 
                        className="form-control"
                        type="number"
                        id="publishingYear"
                        min={0}
                        value={book.publishingYear}
                        onChange={e => setBook({ ...book, publishingYear: parseInt(e.target.value) })}
                        required
                        onBlur={handlePublishingYear}
                      />
                      <small className="text-danger">{noticePublishingYear}</small>
                    </div>
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="averageRate" className="form-label">
                      <i className="fas fa-star me-2"></i>Tỉ lệ đánh giá<span className="text-danger"> *</span>
                    </label>
                    <input 
                      className="form-control"
                      type="number"
                      id="averageRate"
                      min={0}
                      max={5}
                      step={0.1}
                      value={book.averageRate}
                      onChange={e => setBook({...book, averageRate:parseFloat(e.target.value)})}
                      onBlur={handleAverageRate}
                      required
                    />
                    <small className="text-danger">{noticeAverageRate}</small>
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="thumbnail" className="form-label">
                      <i className="fas fa-image me-2"></i>Ảnh chính<span className="text-danger"> *</span>
                    </label>
                    <input 
                      type="file"
                      id="thumbnail"
                      className="form-control"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      required
                      ref={inputFile}
                    />
                    {thumbnail && (
                      <img src={thumbnail} alt="Ảnh chính" className="mt-2 img-thumbnail" style={{width: "100px", height: "100px", objectFit: "cover"}} />
                    )}
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="relatedImages" className="form-label">
                      <i className="fas fa-images me-2"></i>Ảnh liên quan<span className="text-danger"> *</span>
                    </label>
                    <input 
                      type="file"
                      id="relatedImages"
                      className="form-control"
                      accept="image/*"
                      onChange={handleRelatedImagesChange}
                      multiple
                      required
                      ref={inputMultipleFile}
                    />
                    <div className="related-images-preview mt-2 d-flex flex-wrap">
                      {relatedImage?.map((image, index) => (
                        <img key={index} src={image} alt={`Ảnh liên quan ${index+1}`} className="img-thumbnail me-2 mb-2" style={{width: "100px", height: "100px", objectFit: "cover"}} />
                      ))}
                    </div>
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="categoryList" className="form-label">
                      <i className="fas fa-list me-2"></i>Chọn thể loại<span className="text-danger"> *</span>
                    </label>
                    <select 
                      id="categoryList"
                      multiple
                      className="form-select"
                      value={categoryIsChoose}
                      onChange={handleCategoryChange}
                      required
                      style={{height: "150px"}}
                    >
                      {categoryList.map(temp => (
                        <option key={temp.categoryId} value={temp.categoryId}>
                          {temp.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
      
                  {notice && <div className="alert alert-danger mb-3" role="alert">{notice}</div>}
                  
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="fas fa-save me-2"></i>Lưu sách
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
}

const BookForm_Admin=RequireAdmin(BookForm)
export default BookForm_Admin