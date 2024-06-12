import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getOneImageByBook } from "../../../api/ImageAPI";

interface BookProps{
    book:BookModel;
}

const CarouselItem:React.FC<BookProps>=(props)=>{
    const bookId = props.book.bookId;

    const [loadingData,setLoadingData] = useState(false);
    const [noticeError,setNoticeError] = useState(null);
    const [imageList,setImageList] = useState<ImageModel[]>([]);

    useEffect(()=>{
        getOneImageByBook(bookId)
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
      if(imageList[0] && imageList[0].imageData){
        dataLink= imageList[0].imageData;
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