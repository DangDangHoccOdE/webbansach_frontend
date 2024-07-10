import { useState } from "react";
import { useParams } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";

function ResendActivationCode(){
    const {email} = useParams();
    const [notice,setNotice] = useState("");
    const [isSending,setIsSending] = useState(false);
    const [isError,setIsError] = useState(true);
    useScrollToTop()
    
    const handleResendActivationCode=async ()=>{
        if(isSending || !email){
            return;
        }

        try{
            setIsSending(true)
            setNotice("Đang xử lý...");
            setIsError(true);
            const url:string = `http://localhost:8080/user/resendActivationCode?email=${email}`;
            const response = await fetch(url,{
                method:"GET",
                headers:{
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json();

            if(response.ok){
                setIsError(false)
                setNotice(data.content)
            }else{
                setNotice(data.content);
            }
            console.log(data.content);
        }catch(error){
            setNotice("Đã có lỗi xảy ra, không thể gửi lại mã kích hoạt tài khoản!");
            console.error("Error: ", error);
        }finally{
            setIsSending(false);
        }
    }

    return(
        <div>
            <p>Nếu mã hết hạn hoặc không chính xác, ấn vào đây để gửi lại mã kích hoạt</p>
            <button className="btn btn-primary" onClick={handleResendActivationCode}>Send</button>
            <p style={{color: !isError ?"green":"red"}}>{notice}</p>
        </div>
    )
}

export default ResendActivationCode;