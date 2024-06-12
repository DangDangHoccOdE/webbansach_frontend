/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { getUserByRemark } from "../../../api/UserAPI";
import UserModel from "../../../models/UserModel";

interface UserProps{
    remarkId:number;
}

const UserInfo: React.FC<UserProps> = (props) => {
    const remarkId = props.remarkId;

    const [loadingData,setLoadingData] = useState(true);
    const [noticeError,setNoticeError] = useState(null);
    const [userInfo,setUserInfo] = useState<UserModel|null>(null);


    useEffect(()=>{
        getUserByRemark(remarkId)
            .then(userData => {
                setUserInfo(userData);
                setLoadingData(false);
            })
            .catch(error=>{
                setLoadingData(false);
                setNoticeError(error.message)
            })
    },[remarkId]
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