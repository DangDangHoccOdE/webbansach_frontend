/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import UserModel from "../../../models/UserModel";
import useScrollToTop from "../../../hooks/ScrollToTop";
import { getUserByReviewId } from "../../../api/UserAPI";

interface UserProps{
    reviewId:number;
}

const UserInfo: React.FC<UserProps> = (props) => {
    const reviewId = props.reviewId;

    const [loadingData,setLoadingData] = useState(true);
    const [noticeError,setNoticeError] = useState(null);
    const [userInfo,setUserInfo] = useState<UserModel|null>(null);

    useScrollToTop();
    useEffect(()=>{
        getUserByReviewId(reviewId)
            .then(userData => {
                setUserInfo(userData);
                setLoadingData(false);
            })
            .catch(error=>{
                setLoadingData(false);
                setNoticeError(error.message)
            })
    },[reviewId]
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
    <div className="container">
        <h3>{userInfo?.firstName}{userInfo?.lastName}</h3>
    </div>
    );
}
export default UserInfo;