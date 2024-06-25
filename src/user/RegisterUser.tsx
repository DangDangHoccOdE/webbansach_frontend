import React, { ChangeEvent, useEffect, useState } from "react";
import {checkEmail , checkUserName } from "../api/AccountAPI";
import getBase64 from "../layouts/utils/getBase64";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

function RegisterUser(){
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        if(isLoggedIn){
            navigate("/",{replace:true});
        }
    },[isLoggedIn,navigate])

    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [duplicatePassword,setDuplicatePassword] = useState("")
    const [sex, setSex] = useState("Nam")
    const [avatar, setAvatar] = useState<File|null>(null)
    const [errorUserName, setErrorUserName] = useState("")
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorDuplicatePassword, setErrorDuplicatePassword] = useState("")
    const [errorPhoneNumber, setErrorPhoneNumber] = useState("")
    const [errorDateOfBirth, setErrorDateOfBirth] = useState("")
    const [notice,setNotice] = useState("");
    const [hasFull, setHasFull] = useState(true);
    const [hasCalled,setHasCalled] = useState(false)

    const handleSubmit = async(e:React.FormEvent) =>{
        e.preventDefault();
        setNotice("")

        if(!email || !userName || !lastName || !firstName || !password || !duplicatePassword || !sex || !phoneNumber || !dateOfBirth){
            setNotice("Phải điền đủ thông tin");
            setHasFull(false);
            return;    
        }

        if(hasCalled){
            setNotice("Đang xử lý...");
            setHasFull(false);
            return
        }

        setErrorUserName("");
        setErrorEmail("");
        setErrorPassword("");
        setErrorDuplicatePassword("");
        setErrorPhoneNumber("");
        setErrorDateOfBirth("")

        const isUserNameValid = !await checkUserName(userName,{setErrorUserName});
        const isEmailValid = !await checkEmail(email,{setErrorEmail}); 
        const isPasswordValid = !checkPassword(password);
        const isDuplicatePasswordValid = !checkDuplicatePassword(duplicatePassword)
        const isPhoneNumberValid = !checkPhoneNumber(phoneNumber);
        const idDateOfBirthValid = !checkDateOfBirthRegex(dateOfBirth);
  
        if (isUserNameValid && isEmailValid && isPasswordValid && isDuplicatePasswordValid && isPhoneNumberValid && idDateOfBirthValid) {

            const  base64Avatar =avatar ? await getBase64(avatar) : null
            try{
                setHasCalled(true);
                setNotice("Đang xử lý...");
                setHasFull(false);
                const url:string = "http://localhost:8080/user/register";
                
                const response = await fetch(url,{
                    method: 'POST',
                    headers: {
                        'Content-type' : 'application/json',
                    },
                    body: JSON.stringify({
                        userName: userName,
                        email:email,
                        password:password,
                        firstName: firstName,
                        lastName: lastName,
                        dateOfBirth:dateOfBirth,
                        phoneNumber: phoneNumber,
                        sex:sex,
                        avatar:base64Avatar
                    })
                });
                const data = await response.json();

                if(response.ok){
                    setHasFull(true);
                }else{
                    setHasFull(false);
                }
                setNotice(data.content)
            }catch(error){
                setNotice("Đã xảy ra lỗi trong quá trình đăng ký tài khoản!")
                console.log({error})
                setHasFull(false);
            }finally{
                setHasCalled(false)
            }
        }
    }

    // userName
    const handleUserNameChange =  (e: ChangeEvent<HTMLInputElement>)=>{
        setUserName(e.target.value);
        setErrorUserName("");

        return checkUserName(e.target.value,{setErrorUserName});
    }
    
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

    // email
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value);
        setErrorEmail("");

        return checkEmail(e.target.value,{setErrorEmail});
    }

    // phone number
    const checkPhoneNumber=(phoneNumber:string)=>{
        const phoneNumberRegex = /^0\d{9}$/;

        if(!phoneNumberRegex.test(phoneNumber)){
            setErrorPhoneNumber("Số điện thoại không đúng định dạng, phải có 10 chữ số và bắt đầu là 0")
            return true
        }else{
            setErrorPhoneNumber("");
            return false;
        }
    }

    const handleChangePhoneNumber = (e:ChangeEvent<HTMLInputElement>)=>{
        setErrorPhoneNumber("");
        setPhoneNumber(e.target.value);

        return checkPhoneNumber(e.target.value)
    }

    // sex
    const handleSexChange =(e:ChangeEvent<HTMLSelectElement>)=>{
        setSex(e.target.value);
    }

    // avatar
    const handleAvatarChange=(e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){
            const file = e.target.files[0];
            setAvatar(file)
        }
    }

    // dateOfBirth
    const checkDateOfBirthRegex=(dateOfBirth:string)=>{
        const regex =  /\d{4}-\d{2}-\d{2}/;
        if(!regex.test(dateOfBirth)){
            setErrorDateOfBirth("Ngày sinh không đúng định dạng !");
            return true;
        }

        const minDate = new Date("1900-01-01");
        const nowDate = new Date()
        const userDate = new Date(dateOfBirth);
        if(minDate > userDate || userDate>nowDate){
            setErrorDateOfBirth("Ngày sinh không hợp lệ!")
            return true;
        }
            setErrorDateOfBirth("");
            return false;
        
    }
    const handleDateOfBirthChange=(e:ChangeEvent<HTMLInputElement>)=>{
        setErrorDateOfBirth("");
        setDateOfBirth(e.target.value);
        return checkDateOfBirthRegex(e.target.value);
    }

    return(
        <div className="container">
            <h1 className="mt-5 text-center">Đăng ký</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">Tên đăng nhập</label> <span style={{color:"red"}}> *</span>
                        <input 
                            type="text"
                            id="userName"
                            className="form-control"
                            value={userName} 
                            onChange={handleUserNameChange}
                        />
                        <div style={{color:"red"}}>{errorUserName}</div>
                    </div>  
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label> <span style={{color:"red"}}> *</span>
                        <input 
                            type="text"
                            id="email"
                            className="form-control"
                            value={email} 
                            onChange={handleEmailChange}
                        />
                        <div style={{color:"red"}}>{errorEmail}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật khẩu</label> <span style={{color:"red"}}> *</span>
                        <input 
                            type="password"
                            id="password"
                            className="form-control"
                            value={password} 
                            onChange={handlePasswordChange}
                        />
                        <div style={{color:"red"}}>{errorPassword}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="duplicatePassword" className="form-label">Nhập lại mật khẩu</label> <span style={{color:"red"}}> *</span>
                        <input 
                            type="password"
                            id="duplicatePassword"
                            className="form-control"
                            value={duplicatePassword} 
                            onChange={handleDuplicatePasswordChange}
                        />
                        <div style={{color:"red"}}>{errorDuplicatePassword}</div>
                    </div>   
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Họ đệm</label> <span style={{color:"red"}}> *</span>
                        <input 
                            type="text"
                            id="lastName"
                            className="form-control"
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div> 
                    <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">Tên</label> <span style={{color:"red"}}> *</span>
                        <input  
                            type="text"
                            id="firstName"
                            className="form-control"
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>  
                    <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label">Ngày sinh</label> <span style={{color:"red"}}> *</span>
                        <input  
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            className="form-control"
                            onChange={handleDateOfBirthChange}
                        />
                    <div style={{color:"red"}}>{errorDateOfBirth}</div>

                    </div> 
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label> <span style={{color:"red"}}> *</span>
                        <input 
                            type="text"
                            id="phoneNumber"
                            className="form-control"
                            value={phoneNumber} 
                            onChange={handleChangePhoneNumber}
                        />
                        <div style={{color:"red"}}>{errorPhoneNumber}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="sex" className="form-label">Giới tính</label> <span style={{color:"red"}}> *</span>
                        <select className="form-control" id="sex" value={sex} onChange={handleSexChange}>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="avatar" className="form-label">Avatar</label> <span style={{color:"red"}}> *</span>
                        <input type="file" id="avatar"className="form-control" accept="image/**"onChange={handleAvatarChange}></input>

                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Đăng ký</button> 
                        <div style={{color: hasFull ? "green" : "red"}}>{notice}</div> 
                    </div>
                </form>
            </div>
        </div>
    )
}


export default RegisterUser;

