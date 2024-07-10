/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import ImageModel from "../../../models/ImageModel";
import { getAllImagesByBook } from "../../../api/ImageAPI";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css' // import css to carousel
import useScrollToTop from "../../../hooks/ScrollToTop";

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
        return(
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        )
    }

    if(noticeError){
        return(
            <div>
                <h1>Error: {noticeError}</h1>
            </div>
        )
    }

    return (
        <div className="row">
            <div className="col-12">
                <Carousel showArrows={true} showIndicators={true}>
                    {
                        imageList.map((image,index)=>(
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