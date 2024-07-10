import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";

const FormForgotPassword=()=>{
    const {username} = useParams();
    const [password,setPassword] = useState("")
    const [duplicatePassword,setDuplicatePassword] = useState("")
    const [errorPassword,setErrorPassword] = useState("")
    const [errorDuplicatePassword,setErrorDuplicatePassword] = useState("")
    const [isError,setIsError] = useState(false);
    const [notice,setNotice] = useState("")

    useScrollToTop()

  // password
  const checkPassword =  (password:string)=>{
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if(!passwordRegex.test(password)){
        setErrorPassword("Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)");
        return true;
    }else{
        setErrorPassword("");
        return false;
    }
}

const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(e.target.value);
    setErrorPassword("");

    return checkPassword(e.target.value);
}

   // duplicate password
   const checkDuplicatePassword =  (duplicatePassword:string)=>{
    if(duplicatePassword !==(password)){
        setErrorDuplicatePassword("Mật khẩu không trùng khớp!");
        return true;
    }else{
        setErrorDuplicatePassword("");
        return false;
    }
}

const handleDuplicatePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setDuplicatePassword(e.target.value);
    setErrorDuplicatePassword("");

    return checkDuplicatePassword(e.target.value);
}

    const handleSubmit= async(e:React.FormEvent)=>{
        e.preventDefault();
        setNotice("")
        try{
            const url:string="http://localhost:8080/user/passwordChange";
            const response = await fetch(url,{
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify({
                    username,
                    password,
                    duplicatePassword
                })
            });

            const data = await response.json();
            if(response.ok){
                setNotice(data.content);
                setIsError(false);
            }else{
                setNotice(data.content);
                setIsError(true);
            }
        }catch(error){
            setIsError(true);
            setNotice("Lỗi, Không thể thay đổi mật khẩu!");
        }
    }
    return(
        <div className="container">
            <div>
            <h1 className="mt-5 text-center">Thay đổi mật khẩu</h1>
                <div className="mb-4 col-md-6 col-12 mx-auto">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="mb-3">
                                <label htmlFor="password">Nhập mật khẩu mới</label> <span style={{color:"red"}}> *</span>
                                <input type="password" id="password" className="form-control" value={password} required onChange={handlePasswordChange}></input>
                                <p style={{color:"red"}}> {errorPassword}</p>
                            </div>
                             <div className="mb-3">
                                <label htmlFor="duplicatePassword">Nhập lại mật khẩu mới</label> <span style={{color:"red"}}> *</span>
                                <input type="password" id="duplicatePassword" className="form-control" value={duplicatePassword} required onChange={handleDuplicatePasswordChange}></input>
                                <p style={{color:"red"}}> {errorDuplicatePassword}</p>

                            </div>
                            <div className="mb-3 text-center">
                                <button type="submit" className="btn btn-primary">Lưu</button>
                                <p style={{color : isError?"red":"green"}}>{notice}</p>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    )
}   

export default FormForgotPassword;