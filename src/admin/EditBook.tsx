import React, { ChangeEvent, FormEvent, useEffect, useState } from "react"
import RequireAdmin from "./RequireAdmin";
import NumberFormat from "../layouts/utils/NumberFormat";
import getBase64 from "../layouts/utils/getBase64";
import CheckAndRefreshToken from "../layouts/utils/CheckTokenExpired";
import BookModel from "../models/BookModel";
import { getBookByBookId } from "../api/BookAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../layouts/utils/AuthContext";
import { getAllCategory, getCategoryByBook } from "../api/CategoryAPI";
import CategoryModel from "../models/CategoryModel";
import ImageModel from "../models/ImageModel";
import { getAllImagesByBook, getIconImageByBook } from "../api/ImageAPI";

const EditBook: React.FC = (props) => {
    const isLoggedIn = useAuth();
    const navigate = useNavigate();
    const bookIdString = useParams();
    const [editBook,setEditBook] = useState<BookModel|null>(null)
    const [notice,setNotice] = useState("");
    const [iconImage,setIconImage] = useState<ImageModel[]>([])
    const [imageList,setImageList] = useState<ImageModel[]>([])
    const [categoryOfBook,setCategoryOfBook] = useState<CategoryModel[]>([])
    let bookNumber = parseInt(bookIdString.bookId+'');

    // useEffect(() => {
    //     CheckAndRefreshToken();
    // }, []); // kiểm tra token hết thì lấy token mới

    // gọi api lấy thông tin sách
    useEffect(()=>{
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        // gọi api lấy thông tin sách
          getBookByBookId((bookNumber))
            .then(
                 book=>setEditBook(book)
            ).catch(
                 error=>{
                    alert("Lỗi không thể tìm thấy sách!");
                    console.error({error});
                 })

        // gọi api lấy ảnh của sách
        getAllImagesByBook(bookNumber)
            .then(images=>setImageList(images)
            ).catch(
                error=>{
                    alert("Lỗi không thể tải ảnh của sách!")
                    console.error({error});
                })

        // Lấy ảnh chính của sách
        getIconImageByBook(bookNumber)
                .then(icon=>setIconImage(icon)
                ).catch(
                    error=>{
                        alert("Lỗi không thể tải ảnh của sách!")
                        console.error({error});
        })

        // lấy danh sách thể loại của 1 cuốn sách
        getCategoryByBook(bookNumber)
                .then(category=>setCategoryOfBook(category)
                 ).catch(
                    error=>{
                        alert("Lỗi không thể tải ảnh của sách!")
                        console.error({error});
        })
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

            // handle Icon -> ''
            iconImage.map(icon=>setThumbnail(icon.imageData))

            // handle RelatedImage
            const handleRelatedImage = imageList.map(images=>images.imageData).filter((image):image is string => image!==undefined).slice(1);
            setRelatedImage(handleRelatedImage);

            // handle CategoryList
            const handleCategoryList = categoryOfBook.map(category=>category.categoryId.toString()).filter((category):category is string=>category!==undefined);
            setCategoryList(handleCategoryList)
        }
    },[categoryOfBook, editBook, iconImage, imageList])

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

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        CheckAndRefreshToken();
        const token = localStorage.getItem('accessToken')
        try{
            const response = await fetch("http://localhost:8080/admin/editBook",
                {
                    method:"PUT",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":`Bearer ${token}`
                    },
                    body:JSON.stringify({
                        bookId,
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
                        soldQuantity
                }
            )})

                console.log(response)
                if(response.ok){
                        alert("Đã sửa sách thành công!")
                            console.log("Đã sửa sách thành công!")
                        }else{
                            alert("Gặp lỗi trong quá trình sửa sách!")
                            console.log("Sách chưa được sửa!")
                }
             }
        catch(error){
            console.log("Lỗi sửa sách, ",error);
        }   
    }
    return( 
<div className="container">
    <div className="row justify-content-center">
        <div className="col-md-8">
            <h1 className="text-center mb-4">Chỉnh sửa sách</h1>
            <form onSubmit={handleSubmit} className="form">
                <input type="number" id="bookId" value={bookId} hidden readOnly />

                <div className="form-group">
                    <label htmlFor="bookName">Tên sách<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="text"
                        value={bookName}
                        onChange={e=>setBookName((e.target.value))}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="isbn">Isbn<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="text"
                        value={isbn}
                        onChange={e => setIsbn(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="listedPrice">Giá niêm yết <span style={{color:"red"}}> *</span></label>
                    <div className="input-group">
                        <input 
                            className="form-control"
                            type="number" value={listedPrice}
                            onChange={e => setListedPrice(parseFloat(e.target.value))}
                            min={0}
                            required
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">VND</span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="discountPercent">Phần trăm giảm giá</label>
                    <div className="input-group">
                        <input 
                            className="form-control"
                            min={0}
                            max={100}
                            type="number"
                            value={discountPercent}
                            onChange={e => setDiscountPercent(parseFloat(e.target.value))}
                            onBlur={handleDiscountPercent}
                            required
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                    <span style={{color:"red"}}>{noticeDiscountPercent}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="price">Giá bán (Giá niêm yết * Phần trăm giảm giá)<span style={{color:"red"}}> *</span></label>
                    <div className="input-group">
                         <span className="form-control">{NumberFormat(listedPrice*(1-discountPercent/100))}</span>
                        <div className="input-group-append">
                            <span className="input-group-text">VND</span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Số lượng<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(parseInt(e.target.value))}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Đã Bán<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="number"
                        value={soldQuantity}
                        onChange={e => setSoldQuantity(parseInt(e.target.value))}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Mô tả<span style={{color:"red"}}> *</span></label>
                    <textarea 
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Tác giả<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="text"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="averageRate">Tỉ lệ đánh giá<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        min={0}
                        max={5}
                        type="number"
                        value={averageRate}
                        onChange={e => setAverageRate(parseFloat(e.target.value))}
                        onBlur={handleAverageRate}
                        step={0.1}
                        required
                    />
                    <span style={{color:"red"}}>{noticeAverageRate}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="thumbnail">Ảnh chính:<span style={{color:"red"}}> *</span></label>
                    <input 
                        type="file"
                        id="thumbnail"
                        className="form-control"
                        accept="image/**"
                        onChange={handleThumbnailChange}
                    /><br/>
                    {thumbnail && <img src={thumbnail} alt="Ảnh chính" style={{width:"100px" , height:"100px"}}></img>}
                </div>

                <div className="form-group">
                    <label htmlFor="relatedImages">Ảnh liên quan<span style={{color:"red"}}> *</span></label>
                    <input 
                        type="file"
                        id="relatedImages"
                        className="form-control"
                        accept="image/**"
                        onChange={handleRelatedImagesChange}
                        multiple
                    /><br/>
                    <div className="related-images-preview">
                        {relatedImage?.map((image,index)=>(
                            <img key={index} src={image} alt={`Ảnh liên quan ${index+1}`} style={{width:"100px",height:"100px"}}></img>
                        ))}

                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="categoryList">Chọn thể loại<span style={{color:"red"}}> *</span></label>
                    <select 
                        id="categoryList"
                        multiple
                        className="form-control"
                        value={categoryList}
                        onChange={handleCategoryChange}
                        required
                    >
                        {categoryListAPI.map(temp => 
                            <option key={temp.categoryId} value={temp.categoryId} selected={categoryList?.includes(temp.categoryId.toString())}>
                                {temp.categoryName} 
                            </option>
                        )}
                    </select>
                </div>

                <p style={{ color: "red" }}>{notice}</p>
                <button type="submit" className="btn btn-success mt-2">Lưu</button>
                    
            </form>
        </div>
    </div>
</div>

    )
}

const EditBook_Admin=RequireAdmin(EditBook)
export default EditBook_Admin