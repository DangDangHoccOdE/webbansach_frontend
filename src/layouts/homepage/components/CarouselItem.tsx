import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getIconImageByBook } from "../../../api/ImageAPI";
import useScrollToTop from "../../../hooks/ScrollToTop";

interface BookProps{
    book:BookModel;
}

const CarouselItem:React.FC<BookProps>=(props)=>{
  useScrollToTop();
    const bookId = props.book.bookId;

    const [loadingData,setLoadingData] = useState(false);
    const [noticeError,setNoticeError] = useState(null);
    const [imageList,setImageList] = useState<ImageModel|null>(null);

    useEffect(()=>{
      getIconImageByBook(bookId)
            .then(imageData => {
                    setImageList(imageData);
                    setLoadingData(false)}
                )
            .catch(error=>{
                setLoadingData(false);
                setNoticeError(error.message);
            })
    },[bookId])

    if (loadingData) {
        return( <h1>Đang tải dữ liệu</h1>);
      }
    
      if (noticeError) {
        return <h1>Error: {noticeError}</h1>;
      }

      let dataLink:string="";
      if(imageList && imageList.imageData){
        dataLink= imageList.imageData;
      }
    

    return(
        <div className="row align-items-center">
            <div className="col-5 text-center">
              <img src={dataLink} className="float-end" style={{width:'150px'}} alt=".." />
            </div>
            <div className="col-7">
              <h5>{props.book.bookName}</h5>
            </div>
          </div>
    )
}

export default CarouselItem;