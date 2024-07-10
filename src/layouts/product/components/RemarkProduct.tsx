import React, { useEffect, useState } from "react";
import RemarkModel from "../../../models/RemarkModel";
import { getAllRemarkByBook } from "../../../api/RemarkAPI";
import UserInfo from "./UserInfo";
import renderRating from "../../utils/StarRate";
import useScrollToTop from "../../../hooks/ScrollToTop";

interface RemarkProductProps{
    bookId: number;
}

const RemarkProduct: React.FC<RemarkProductProps> = (props) => {
    const bookId = props.bookId;

    const [remarkList,setRemarkList] = useState<RemarkModel[]>([]);
    const [loadingData,setLoadingData] = useState(true);
    const [noticeError,setNoticeError] = useState(null);

    useScrollToTop();
    useEffect(()=>{
        getAllRemarkByBook(bookId)
            .then(remarkList => {
                setRemarkList(remarkList);
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
        <div className="container mt-2 mb-2 text-center">
            PHẦN ĐÁNH GIÁ
            {remarkList.map((remark, index) => (
                <div key={remark.remarkId || index} className="remark">
                    <UserInfo remarkId={remark.remarkId} />
                    <div className="row">
                        <div className="col-4 text-end">
                            <p>{renderRating((remark.rate?remark.rate:0))}</p>
                        </div>
                        <div className="col-8 text-start">
                            <h3>{remark.content}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
}
export default RemarkProduct;