import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import RequireAdmin from "./RequireAdmin";
import { getAllCategory } from "../api/CategoryAPI";
import CategoryModel from "../models/CategoryModel";
import NumberFormat from "../layouts/utils/NumberFormat";
import getBase64 from "../layouts/utils/getBase64";
import fetchWithAuth from "../layouts/utils/AuthService";

const BookForm: React.FC = (props) => {
    const [thumbnail,setThumbnail] = useState<string|null>(null);
    const [relatedImage,setRelatedImage] = useState<string[]|null>([])
    const [categoryIsChoose,setCategoryIsChoose] = useState<string[]>([])

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
    
        const token = localStorage.getItem('accessToken')
        const response = await fetchWithAuth("http://localhost:8080/admin/addBook",
            {
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify(book)
            }
        )
            console.log(response)
            if(response.ok){
                     alert("Đã thêm sách thành công!")
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
                        })
                        setCategoryIsChoose([]);
                        setRelatedImage([]);
                        setThumbnail('');
                        handleReset();
                        console.log("Đã thêm sách thành công!")
                    }else{
                        alert("Gặp lỗi trong quá trình thêm sách!")
                        console.log("Sách chưa được thêm!")
            }
        
    }
    return( 
<div className="container">
    <div className="row justify-content-center">
        <div className="col-md-8">
            <h1 className="text-center mb-4">Thêm sách</h1>
            <form onSubmit={handleSubmit} className="form">
                <input type="number" id="bookId" value={book.bookId} hidden readOnly />

                <div className="form-group">
                    <label htmlFor="bookName">Tên sách<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="text"
                        value={book.bookName}
                        onChange={e => setBook({ ...book, bookName: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="isbn">Isbn<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="text"
                        value={book.isbn}
                        onChange={e => setBook({ ...book, isbn: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="listedPrice">Giá niêm yết <span style={{color:"red"}}> *</span></label>
                    <div className="input-group">
                        <input 
                            className="form-control"
                            type="number" value={book.listedPrice}
                            onChange={e => setBook({ ...book, listedPrice: parseFloat(e.target.value) })}
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
                            value={book.discountPercent}
                            onChange={e => setBook({ ...book, discountPercent: parseFloat(e.target.value) })}
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
                         <span className="form-control">{NumberFormat(book.listedPrice*(1-book.discountPercent/100))}</span>
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
                        value={book.quantity}
                        onChange={e => setBook({ ...book, quantity: parseInt(e.target.value) })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Đã Bán<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="number"
                        value={book.soldQuantity}
                        onChange={e => setBook({ ...book, soldQuantity: parseInt(e.target.value) })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Mô tả<span style={{color:"red"}}> *</span></label>
                    <textarea 
                        className="form-control"
                        value={book.description}
                        onChange={e => setBook({ ...book, description: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Tác giả<span style={{color:"red"}}> *</span></label>
                    <input 
                        className="form-control"
                        type="text"
                        value={book.author}
                        onChange={e => setBook({ ...book, author: e.target.value })}
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
                        value={book.averageRate}
                        onChange={e => setBook({...book,averageRate:parseFloat(e.target.value)})}
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
                        required ref={inputFile}
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
                        required ref={inputMultipleFile}
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
                        value={categoryIsChoose}
                        onChange={handleCategoryChange}
                        required
                    >
                        {categoryList.map(temp => 
                            <option key={temp.categoryId} value={temp.categoryId}>
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

const BookForm_Admin=RequireAdmin(BookForm)
export default BookForm_Admin