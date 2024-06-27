import { ChangeEvent, useEffect, useState } from "react"
import getBase64 from "../layouts/utils/getBase64"
import { getUserByUsername } from "../api/UserAPI"
import {  getUsernameByToken } from "../layouts/utils/JwtService"
import UserModel from "../models/UserModel"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../utils/AuthContext"

const UserInformation:React.FC=()=>{
    const {isLoggedIn} = useAuth();
    const [userByToken,setUserByToken] = useState<UserModel|null>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // State để theo dõi trạng thái loading

    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login");
            return;        
        }else{
            const usernameByToken = getUsernameByToken();
            if(usernameByToken!==undefined){
                setIsLoading(true);
                getUserByUsername(usernameByToken).then(
                    user=>{
                        setUserByToken(user);
                    }
                ).catch(error =>{
                    console.error("Lỗi load info user!",error);
                    setNotice("Không thể load được thông tin user!");
                    setHasFull(false);
                    alert("Lỗi load info user!");
                }).finally(()=>{
                    setIsLoading(false);
                })
                }else{
                    console.log("Không có thông tin user!")
                    alert("Không có thông tin user!")
                    navigate("/");
                }
            }
         
        },[isLoggedIn,navigate]
    )
    const [userName, setUserName] = useState<string | undefined>(userByToken?.userName);
    const [email, setEmail] = useState<string | undefined>(userByToken?.email);
    const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(userByToken?.dateOfBirth);
    const [lastName, setLastName] = useState<string | undefined>(userByToken?.lastName);
    const [firstName, setFirstName] = useState<string | undefined>(userByToken?.firstName);
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(userByToken?.phoneNumber);
    const [sex, setSex] = useState<string | undefined>(userByToken?.sex);
    const [avatar, setAvatar] = useState<string | undefined | null>(userByToken?.avatar);
    const [deliveryAddress, setDeliveryAddress] = useState<string|undefined>("")
    const [purchaseAddress, setPurchaseAddress] = useState<string|undefined>("")

    useEffect(()=>{
        setUserName(userByToken?.userName);
        setEmail(userByToken?.email);
        setDateOfBirth(userByToken?.dateOfBirth)
        setLastName(userByToken?.lastName);
        setFirstName(userByToken?.firstName);
        setPhoneNumber(userByToken?.phoneNumber);
        setSex(userByToken?.sex);
        setAvatar(userByToken?.avatar);
        setDeliveryAddress(userByToken?.deliveryAddress);
        setPurchaseAddress(userByToken?.purchaseAddress);
    },[userByToken])


    const [errorDateOfBirth, setErrorDateOfBirth] = useState("")
    const [errorPhoneNumber, setErrorPhoneNumber] = useState("")
    const [notice,setNotice] = useState("");
    const [hasFull, setHasFull] = useState(true);
    const [hasCalled,setHasCalled] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotice("");

        if (!email || !lastName || !firstName || !sex || !phoneNumber) {
            setNotice("Phải điền đủ thông tin");
            setHasFull(false);
            return;
        }

        if (hasCalled) {
            setNotice("Đang xử lý...");
            setHasFull(false);
            return;
        }

        setErrorPhoneNumber("");
        setErrorDateOfBirth("");

        
        const isPhoneNumberValid = !checkPhoneNumber(phoneNumber);
        if (isPhoneNumberValid) {
            try {
                setHasCalled(true);
                setIsLoading(true);
                setNotice("Đang xử lý...");
                setHasFull(false);

                const userInfo = {
                    userName,
                    email,
                    firstName,
                    lastName,
                    dateOfBirth,
                    phoneNumber,
                    sex,
                    avatar,
                    deliveryAddress,
                    purchaseAddress
                };

                console.log("Request body: ", JSON.stringify(userInfo, null, 2));

                const url: string = "http://localhost:8080/user/changeInfo";
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(userInfo)
                });

                const data = await response.json();

                if (response.ok) {
                    setHasFull(true);
                    setNotice("Đã thay đổi thông tin thành công!")
                    const {jwt} = data;
                    localStorage.setItem('accessToken',jwt);
                } else {
                    setHasFull(false);
                    setNotice(data.content || 'Không có nội dung');
                }
            } catch (error) {
                setNotice("Đã xảy ra lỗi trong quá trình cập nhật thông tin!");
                console.log({ error });
                setHasFull(false);
            } finally {
                setHasCalled(false);
            }
        }
    };


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
    const handleAvatarChange= async (e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){
            const file = e.target.files[0];
            const base64File = await getBase64(file) ;
            setAvatar(base64File);
        }
    } 
    

    // date Of Birth
    const checkDateOfBirthRegex=(dateOfBirth:string)=>{
        const regex =  /\d{4}-\d{2}-\d{2}/;
        if(!regex.test(dateOfBirth)){
            setErrorDateOfBirth("Ngày sinh không đúng định dạng!");
            return true;
        }

        const minDate = new Date("1900-01-01");
        const nowDate = new Date(dateOfBirth);
        const maxDate = new Date();

        if(maxDate < nowDate || nowDate < minDate){
            setErrorDateOfBirth("Ngày sinh không hợp lệ!");
            return true;
        }

        setErrorDateOfBirth("")
        return false;
    }

    const handleDateOfBirthChange= async (e:ChangeEvent<HTMLInputElement>)=>{
        setErrorDateOfBirth("");
        setDateOfBirth(e.target.value);
        return checkDateOfBirthRegex(e.target.value);
    }

    return(
        <div className="container">
            <h1 className="mt-5 text-center">Chỉnh sửa thông tin</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
            {isLoading && <div className="text-center">Đang tải...</div>}
                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-3">
                        <div className="row">
                        <label htmlFor="email" className="form-label">Email<span style={{color:"red"}}> *</span> </label> 
                            <div className="col-9">
                                <input 
                                    type="text"
                                    id="email"
                                    className="form-control"
                                    value={email} 
                                    readOnly
                                />
                            </div>
                            <div className="col-3">
                                <Link to={"/user/changeEmail"}>
                                   <i className="fas fa-edit btn btn-info">Thay đổi</i>                        
                                </Link>
                            </div>
                        </div>

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
                            className="form-control"
                            value={dateOfBirth} 
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
                        <input type="file" id="avatar"className="form-control" accept="image/**" onChange={handleAvatarChange}></input>
                        <br/>
                          {
                            avatar ? (
                                <img src={avatar} alt="Avatar" style={{width:"100px"}}/>
                            ): userByToken && userByToken.avatar ? (
                                <img src={userByToken.avatar} alt="Avatar" style={{width:"100px"}}/>
                            ):(
                                <div>Chưa có ảnh đại diện được chọn!</div>
                            )
                          }

                    </div> 
                    
                    <div className="mb-3">
                        <label htmlFor="deliveryAddress" className="form-label">Địa chỉ giao hàng</label> <span style={{color:"red"}}> *</span>
                        <input id="deliveryAddress"className="form-control" value={deliveryAddress} onChange={e=>setDeliveryAddress(e.target.value)}></input>

                    </div>
                    
                     <div className="mb-3">
                        <label htmlFor="purchaseAddress" className="form-label">Địa chỉ mua hàng</label> <span style={{color:"red"}}> *</span>
                        <input id="purchaseAddress"className="form-control" value={purchaseAddress} onChange={e=>setPurchaseAddress(e.target.value)}></input>

                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Lưu</button> 
                        <div style={{color: hasFull ? "green" : "red"}}>{notice}</div> 
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserInformation;