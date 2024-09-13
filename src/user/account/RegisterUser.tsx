import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEmail, checkUserName } from "../../api/AccountAPI";
import getBase64 from "../../layouts/utils/GetBase64";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useAuth } from "../../context/AuthContext";

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
    const [avatarPreview,setAvatarPreview] = useState<string|null>(null)

    const authProvider = "local"
    useScrollToTop();
    
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
        const isDateOfBirthValid = !checkDateOfBirthRegex(dateOfBirth);

        if (isUserNameValid && isEmailValid && isPasswordValid && isDuplicatePasswordValid && isPhoneNumberValid && isDateOfBirthValid) {
            console.log("1")
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
                        avatar:base64Avatar,
                        authProvider:authProvider
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
    const handleEmailChange = async(e: ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value);
        setErrorEmail("");
        const result = await checkEmail(e.target.value,{setErrorEmail});
        return result;
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
    const handleAvatarChange=async(e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files[0]){
            const file = e.target.files[0];
            setAvatar(file)
            const render = await getBase64(file);
            setAvatarPreview(render); 
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


    const handleRemoveAvatar=()=>{
      setAvatarPreview(null)
      setAvatar(null)
    }


    return(
        <div className="container-fluid bg-light py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-0">Đăng ký tài khoản</h2>
              </div>
              <div className="card-body p-5">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="userName" placeholder="Tên đăng nhập" value={userName} onChange={handleUserNameChange} />
                        <label htmlFor="userName">Tên đăng nhập</label>
                      </div>
                      {errorUserName && <small className="text-danger">{errorUserName}</small>}
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                        <label htmlFor="email">Email</label>
                      </div>
                      {errorEmail && <small className="text-danger">{errorEmail}</small>}
                    </div>
                  </div>
      
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="password" className="form-control" id="password" placeholder="Mật khẩu" value={password} onChange={handlePasswordChange} />
                        <label htmlFor="password">Mật khẩu</label>
                      </div>
                      {errorPassword && <small className="text-danger">{errorPassword}</small>}
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="password" className="form-control" id="duplicatePassword" placeholder="Nhập lại mật khẩu" value={duplicatePassword} onChange={handleDuplicatePasswordChange} />
                        <label htmlFor="duplicatePassword">Nhập lại mật khẩu</label>
                      </div>
                      {errorDuplicatePassword && <small className="text-danger">{errorDuplicatePassword}</small>}
                    </div>
                  </div>
      
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="lastName" placeholder="Họ đệm" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <label htmlFor="lastName">Họ đệm</label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="firstName" placeholder="Tên" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <label htmlFor="firstName">Tên</label>
                      </div>
                    </div>
                  </div>
      
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="date" className="form-control" id="dateOfBirth" value={dateOfBirth} onChange={handleDateOfBirthChange} />
                        <label htmlFor="dateOfBirth">Ngày sinh</label>
                      </div>
                      {errorDateOfBirth && <small className="text-danger">{errorDateOfBirth}</small>}
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="tel" className="form-control" id="phoneNumber" placeholder="Số điện thoại" value={phoneNumber} onChange={handleChangePhoneNumber} />
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                      </div>
                      {errorPhoneNumber && <small className="text-danger">{errorPhoneNumber}</small>}
                    </div>
                  </div>
      
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <select className="form-select" id="sex" value={sex} onChange={handleSexChange}>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                        <label htmlFor="sex">Giới tính</label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input type="file" className="form-control" id="avatar" accept="image/*" onChange={handleAvatarChange} />
                        <label htmlFor="avatar">Avatar</label>
                      </div>
                      {avatarPreview && (
                            <div className="position-relative d-inline-block me-2 mb-2 mt-2">
                                      <img src={avatarPreview} alt="Avatar preview" className="img-thumbnail" style={{maxWidth: '100px', maxHeight: '100px'}} />
                                           <button type="button"className="btn btn-danger btn-sm position-absolute top-0 end-0 -circle"  style={{background:"red"}} onClick={handleRemoveAvatar}>x</button>
                                      </div>
                         )}
                    </div>
                  </div>
      
                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-primary btn-lg" onClick={handleSubmit}>Đăng ký</button>
                  </div>
      
                  {notice && (
                    <div className={`alert ${hasFull ? 'alert-success' : 'alert-danger'} mt-4`} role="alert">
                      {notice}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}


export default RegisterUser;

