import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormForgotPassword from "./FormChangePassword";
import useScrollToTop from "../../hooks/ScrollToTop";

const ConfirmForgotPassword=()=>{
    const {username,forgotPasswordCode} = useParams();
    const [isError,setIsError] = useState(false)
    const [notice,setNotice] = useState("")
    useScrollToTop();

    useEffect(()=>{
        const confirm = async()=>{
            const url:string=`http://localhost:8080/user/confirmForgotPassword?username=${username}&forgotPasswordCode=${forgotPasswordCode}`;
            try{
                const response = await fetch(url,{
                    method:"GET",
                    headers:{
                        "Content-type":"application/json"
                    },
                })
        
                const data = await response.json();
                if(response.ok){
                    setIsError(false);
                }else{
                    setIsError(true);
                    setNotice(data.content);
                }
            }catch(error){
                setIsError(true);
                setNotice("Đã có lỗi xảy ra!");
                console.log("Lỗi ",error)
            }
        }
        confirm();
    },[username,forgotPasswordCode])

    return(
        <div>
               { isError ?
               <p style={{color:"red"}} className="text-center">{notice}</p> : <FormForgotPassword/>  }
        </div>
    )
}
export default ConfirmForgotPassword;