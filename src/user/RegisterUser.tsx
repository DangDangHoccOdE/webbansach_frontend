import React, { ChangeEvent, useState } from "react";

function RegisterUser(){

    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [duplicatePassword,setDuplicatePassword] = useState("")
    const [sex, setSex] = useState("Nam")
    const [errorUserName, setErrorUserName] = useState("")
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorDuplicatePassword, setErrorDuplicatePassword] = useState("")
    const [errorPhoneNumber, setErrorPhoneNumber] = useState("")
    const [notice,setNotice] = useState("");

    const handleSubmit = async(e:React.FormEvent) =>{
        setErrorUserName("");
        setErrorEmail("");
        setErrorPassword("");
        setErrorDuplicatePassword("");
        setErrorPhoneNumber("");

        // prevent click repeat
        e.preventDefault();

        const isUserNameValid = !await checkUserName(userName);
        const isEmailValid = !await checkUserName(email);
        const isPasswordValid = !await checkUserName(password);
        const isDuplicatePasswordValid = !await checkUserName(duplicatePassword);
        const isPhoneNumberValid = !await checkUserName(phoneNumber);

        if(isUserNameValid && isEmailValid && isPasswordValid && isDuplicatePasswordValid && isPhoneNumberValid){
            try{
                const url:string = "http://localhost:8080/account/register";
                
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
                        phoneNumber: phoneNumber,
                        sex:sex,
                    })
                });

                if(response.ok){
                    setNotice("Đăng ký thành công, vui lòng kiểm tra email để kích hoạt!");
                }else{
                    console.log(response.json())
                    setNotice("Đã xảy ra lỗi trong quá trình đăng ký tài khoản!")
                }
            }catch(error){
                setNotice("Đã xảy ra lỗi trong quá trình đăng ký tài khoản!")
                console.log({notice})
            }
        }
    }

    // Check username
    const checkUserName = async(userName:string)=>{
        const url = `http://localhost:8080/users/search/existsByUserName?userName=${userName}`;

        try{
            const response = await fetch(url);

            const data =await response.text();

            if(data==="true"){
                setErrorUserName("Tên đăng nhập đã tồn tại!");
                return true;
            }
            return false;
        }catch(error){
            console.error("Lỗi khi kiểm tra tên đăng nhập",error);
            return false;
        }
    }

    const handleUserNameChange =  (e: ChangeEvent<HTMLInputElement>)=>{
        setUserName(e.target.value);
        setErrorUserName("");

       return checkUserName(e.target.value);
    }
    
    // Check password
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

    // Check duplicatePassword
    const checkDuplicatePassword =  (duplicatePassword:string)=>{
        if(duplicatePassword !==(password)){
            setErrorDuplicatePassword("Mật khẩu không trùng khớp!");
            return true;
        }else{
            setErrorPassword("");
            return false;
        }
    }

    const handleDuplicatePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setDuplicatePassword(e.target.value);
        setErrorDuplicatePassword("");

        return checkDuplicatePassword(e.target.value);
    }

    // Check email
    const checkEmail = async(email:string)=>{
        const url = `http://localhost:8080/users/search/existsByEmail?email=${email}`;
        const regexEmail = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
        try{
            const response = await fetch(url);

            const data =await response.text();

            if(data==="true"){
                setErrorEmail("Tên email đã tồn tại!");
                return true;
            }
            if(!regexEmail.test(email)){
                setErrorEmail("Định dạng email không hợp lệ!");
                return true;
            }

            return false;
        }catch(error){
            console.error("Lỗi khi kiểm tra tên email",error);
            return false;
        }
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value);
        setErrorEmail("");

       return checkEmail(e.target.value);
    }

    // Check phoneNumber
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

    // Select sex:
    const handleSexChange =(e: { target: { value: React.SetStateAction<string>; }; })=>{
        setSex(e.target.value);
    }
    return(
        <div className="container">
            <h1 className="mt-5 text-center">Đăng ký</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
                <form onSubmit={handleSubmit} className="form">
                                <div className="mb-3">
                                <label htmlFor="userName" className="form-label">Tên đăng nhập</label>
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
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    type="text"
                                    id="email"
                                    className="form-control"
                                    value={email} 
                                    onBlur={handleEmailChange}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <div style={{color:"red"}}>{errorEmail}</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="passsword" className="form-label">Mật khẩu</label>
                                <input 
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)}
                                    onBlur={handlePasswordChange}
                                />
                                <div style={{color:"red"}}>{errorPassword}</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="duplicatePassword" className="form-label">Nhập lại mật khẩu</label>
                                <input 
                                    type="password"
                                    id="duplicatePassword"
                                    className="form-control"
                                    value={duplicatePassword} 
                                    onChange={e => setDuplicatePassword(e.target.value)}
                                    onBlur={handleDuplicatePasswordChange}                                />
                                <div style={{color:"red"}}>{errorDuplicatePassword}</div>
                            </div>   
                            <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Họ đệm</label>
                            <input 
                                type="text"
                                id="lastName"
                                className="form-control"
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div> 
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">Tên</label>
                            <input 
                                type="text"
                                id="firstName"
                                className="form-control"
                                value={firstName} 
                                onChange={(e)=> setFirstName(e.target.value)}
                            />
                        </div>  
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                            <input 
                                type="text"
                                id="phoneNumber"
                                className="form-control"
                                value={phoneNumber} 
                                onBlur={handleChangePhoneNumber}
                                onChange={(e)=> setPhoneNumber(e.target.value)}
                            />
                            <div>
                                <div style={{color:"red"}}>{errorPhoneNumber}</div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sex" className="form-label">Giới tính</label>
                            <select className="form-control" id="sex" value={sex} onChange={handleSexChange}>
                                <option value={"Nam"} >Nam</option>
                                <option value={"Nữ"}>Nữ</option>
                            </select>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Đăng ký</button>
                            <div style={{color:"green"}}>{notice}</div>
                        </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterUser;