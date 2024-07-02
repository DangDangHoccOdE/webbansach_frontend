import React, { useEffect, useState } from "react"
import { getUserByUsername } from "../api/UserAPI";
import UserModel from "../models/UserModel";
import MaskEmail from "../layouts/utils/MaskEmail";

const ForgotPassword:React.FC=()=>{
    const [username,setUsername] = useState("");
    const [notice,setNotice] = useState("")
    const [user,setUser] = useState<UserModel|null>(null)
    const [isError,setIsError]= useState(false)

        useEffect(()=>{
            console.log(username)
                getUserByUsername(username).then(
                    result=>{
                        if(result!==null){
                            setUser(result);
                            setNotice("Tài khoản hợp lệ!");
                            console.log("Tài khoản hợp lệ!");
                            setIsError(false);
                            console.log(result)
                        }else{
                            throw new Error("Không có user!")
                        }
                }).catch(error=>{
                    setNotice("Không tìm thấy tài khoản!");
                    setIsError(true);
                    console.log("Không tìm thấy tài khoản! ",error)
                })
        },[username])

    const handleSubmit= async (e:React.FormEvent)=>{
        e.preventDefault();

        if(user){
            const maskedEmail = MaskEmail(user.email); // Mã hóa email
             alert("Chúng tôi sẽ gửi link xác nhận đến email "+maskedEmail);
        }

        const url:string = "http://localhost:8080/user/forgotPassword";
        console.log(username)
        try{
            const response = await fetch(url,
                {
                    method:"POST",
                    headers:{
                        'Content-type' : 'application/json',
                    },
                    body:JSON.stringify({username:username})
                })
                const data = await response.json();
                if(response.ok){
                    setNotice("Đã gửi email thành công!");
                    setIsError(false);
                }else{
                    setNotice(data.content||"Lỗi gửi email")
                    setIsError(true);
                }
        }catch(error){
            setIsError(true);
            setNotice("Không thể gửi email!");
            console.log({error})
        }
    }
    return(
        <div className="container ">
            <h1 className="mt-5 text-center">Quên mật khẩu</h1>
            <div className="mb-4 col-md-6 col-12 mx-auto">
                <form className="form" onSubmit={handleSubmit}>
                       <div className="mb-3">
                            <label htmlFor="username">Nhập tài khoản</label> <span style={{color:"red"}}> *</span>
                            <input type="text" id="username" className="form-control" required onChange={e=>setUsername(e.target.value)}></input>
                            {
                                username.length>0 &&  <p style={{color:isError?"red":"green"}}>{notice}</p>
                            }
                        </div>
                        <div className="mb-3 text-center">
                            <button type="submit" className="btn btn-primary" disabled={user===null}>Tiếp</button>
                        </div>
                </form>
            </div>
            
        </div>
    );
}

export default ForgotPassword