/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import ImageModel from "../../../models/ImageModel";
import { getAllImagesByBook } from "../../../api/ImageAPI";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css' // import css to carousel
import useScrollToTop from "../../../hooks/ScrollToTop";
import { CircularProgress } from "@mui/material";

interface ProductImageProps{
    bookId: number;
}

const ProductImage: React.FC<ProductImageProps> = (props) => {
    const bookId = props.bookId;

    const [imageList,setImageList] = useState<ImageModel[]>([]);
    const [loadingData,setLoadingData] = useState(true);
    const [noticeError,setNoticeError] = useState(null);

    useScrollToTop();
    useEffect(()=>{
        getAllImagesByBook(bookId)
            .then(imageList => {
                setImageList(imageList);
                setLoadingData(false);
            })
            .catch(error=>{
                setLoadingData(false);
                setNoticeError(error.message)
            })
    },[bookId]
    );

    if(loadingData){
        return (
            <div className="text-center mt-5">
                <CircularProgress color="inherit" />
            </div>
          );
    }
    if (noticeError) {
        return <div className="alert alert-danger text-center" role="alert">{noticeError}</div>;
   }

    // tách imageList thành 2 phần rồi gộp lại
    const sortedImage = [
        ...imageList.filter(image => image.icon), // tạo 1 ds dựa trên imageList có icon
        ...imageList.filter(image => !image.icon), // tạo 1 ds dựa trên imageList k có icon
    ]
    return (
        <div className="row">
            <div className="col-12">
                <Carousel showArrows={true} showIndicators={true}>
                    {
                        sortedImage.map((image,index)=>(
                            <div key={index}>
                                 <img src={image.imageData} alt="Ảnh" style={{maxWidth:'250px'}}></img>
                            </div>
                        ))
                    }
                </Carousel>
            </div>
        </div>
      );
      
}
export default ProductImage;