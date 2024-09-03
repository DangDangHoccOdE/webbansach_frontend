import { ChangeEvent, useEffect, useState } from "react";
import getBase64 from "../layouts/utils/GetBase64";
import { getUserByUserId } from "../api/UserAPI";
import UserModel from "../models/UserModel";
import { Link, useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "../layouts/utils/AuthService";
import useScrollToTop from "../hooks/ScrollToTop";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const UserInformation: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [user, setUser] = useState<UserModel | null>(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [noAvatar, setNoAvatar] = useState(false);
    const [userName, setUserName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [dateOfBirth, setDateOfBirth] = useState<string | undefined>();
    const [lastName, setLastName] = useState<string | undefined>();
    const [firstName, setFirstName] = useState<string | undefined>();
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
    const [sex, setSex] = useState<string | undefined>();
    const [avatar, setAvatar] = useState<string | undefined | null>();
    const [deliveryAddress, setDeliveryAddress] = useState<string | undefined>("");
    const [purchaseAddress, setPurchaseAddress] = useState<string | undefined>("");
    const [errorDateOfBirth, setErrorDateOfBirth] = useState("");
    const [errorPhoneNumber, setErrorPhoneNumber] = useState("");
    const [notice, setNotice] = useState("");
    const [hasFull, setHasFull] = useState(true);
    const {userId} = useParams();
    const userIdNumber = parseInt(userId+"");


    useScrollToTop();
    
    useEffect(() => {
        if (!isLoggedIn || Number.isNaN(userIdNumber)) {
            navigate("/login")
            return;
        }
    
        if (userIdNumber !== undefined) {
            setIsLoading(true);
            getUserByUserId(userIdNumber)
                .then(data => {
                    if(data === null){
                        navigate("/error-404");
                    }
                    setUser(data);
                })
                .catch(error => {
                    console.error("Lỗi load info user!", error);
                    navigate("/error-404");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            navigate("/error-404");
        }
    }, [isLoggedIn, navigate, userIdNumber]);

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            setUserName(user.userName);
            setEmail(user.email);
            setDateOfBirth(user.dateOfBirth);
            setLastName(user.lastName);
            setFirstName(user.firstName);
            setPhoneNumber(user.phoneNumber);
            setSex(user.sex);
            setAvatar(user.avatar);
            setDeliveryAddress(user.deliveryAddress);
            setPurchaseAddress(user.purchaseAddress);
        }
        setIsLoading(false);
    }, [user]);

  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotice("");

        if (noAvatar) {
            setAvatar(null);
        }

        if (!email || !lastName || !firstName || !sex || !phoneNumber) {
            setNotice("Phải điền đủ thông tin");
            setHasFull(false);
            return;
        }
        
        setNotice("");
        setErrorPhoneNumber("");
        setErrorDateOfBirth("");
        const isPhoneNumberValid = !checkPhoneNumber(phoneNumber);
        if (isPhoneNumberValid) {
            try {
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
                    avatar: noAvatar ? null : avatar,
                    deliveryAddress,
                    purchaseAddress
                };

                const url = "http://localhost:8080/user/changeInfo";
                const response = await fetchWithAuth(url, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body: JSON.stringify(userInfo)
                });

                const data = await response.json();

                if (response.ok) {
                    setHasFull(true);
                    setNotice("Cập nhật thông tin thành công, Vui lòng tải lại trang để hoàn tất cập nhật!")
                } else {
                    setHasFull(false);
                    setNotice(data.content);
                }
            } catch (error) {
                setNotice("Đã xảy ra lỗi trong quá trình cập nhật thông tin!");
                console.log({ error });
                setHasFull(false);
            }
        }
    };

    const checkPhoneNumber = (phoneNumber: string) => {
        const phoneNumberRegex = /^0\d{9}$/;

        if (!phoneNumberRegex.test(phoneNumber)) {
            setErrorPhoneNumber("Số điện thoại không đúng định dạng, phải có 10 chữ số và bắt đầu là 0");
            return true;
        } else {
            setErrorPhoneNumber("");
            return false;
        }
    };

    const handleChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setErrorPhoneNumber("");
        setPhoneNumber(e.target.value);

        return checkPhoneNumber(e.target.value);
    };

    const handleSexChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSex(e.target.value);
    };

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileSizeInBytes = file.size;
            const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

            if (fileSizeInBytes > maxSizeInBytes) {
                toast.error("Dung lượng file ảnh không được vượt quá 1 MB");
                return;
            }

            const base64 = await getBase64(file);
            setAvatar(base64 as string);
        }
    };

    const handleNoAvatar = () => {
        setNoAvatar(!noAvatar);
        if (!noAvatar) {
            setAvatar(null);
        } else {
            setAvatar(user?.avatar);
        }
    };

    const checkDateOfBirthRegex = (dateOfBirth: string) => {
        const regex = /\d{4}-\d{2}-\d{2}/;
        if (!regex.test(dateOfBirth)) {
            setErrorDateOfBirth("Ngày sinh không đúng định dạng!");
            return true;
        }

        const minDate = new Date("1900-01-01");
        const nowDate = new Date(dateOfBirth);
        const maxDate = new Date();

        if (maxDate < nowDate || nowDate < minDate) {
            setErrorDateOfBirth("Ngày sinh không hợp lệ!");
            return true;
        }

        setErrorDateOfBirth("");
        return false;
    };

    const handleDateOfBirthChange = (e: ChangeEvent<HTMLInputElement>) => {
        setErrorDateOfBirth("");
        setDateOfBirth(e.target.value);
        return checkDateOfBirthRegex(e.target.value);
    };

    if(!isLoggedIn){
        return null;
    }

   
    return (
        <div className="container mt-5 mb-5">
            <h1 className="text-center mb-4">Chỉnh sửa thông tin</h1>
            <div className="card shadow">
                <div className="card-body">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            <i className="fas fa-envelope me-2"></i>Email<span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                id="email"
                                                className="form-control"
                                                value={email}
                                                readOnly
                                            />
                                            <Link to={`/user/changeEmail/${userId}`} className="btn btn-outline-secondary">
                                                <i className="fas fa-edit"></i> Thay đổi
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">
                                            <i className="fas fa-user me-2"></i>Họ đệm<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            className="form-control"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="form-label">
                                            <i className="fas fa-user me-2"></i>Tên<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className="form-control"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="dateOfBirth" className="form-label">
                                            <i className="fas fa-calendar-alt me-2"></i>Ngày sinh<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            className="form-control"
                                            value={dateOfBirth}
                                            onChange={handleDateOfBirthChange}
                                        />
                                        {errorDateOfBirth && <div className="text-danger">{errorDateOfBirth}</div>}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="phoneNumber" className="form-label">
                                            <i className="fas fa-phone me-2"></i>Số điện thoại<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            className="form-control"
                                            value={phoneNumber}
                                            onChange={handleChangePhoneNumber}
                                        />
                                        {errorPhoneNumber && <div className="text-danger">{errorPhoneNumber}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            <i className="fas fa-venus-mars me-2"></i>Giới tính<span className="text-danger">*</span>
                                        </label>
                                        <div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="sex"
                                                    id="male"
                                                    value="Nam"
                                                    checked={sex === "Nam"}
                                                    onChange={handleSexChange}
                                                />
                                                <label className="form-check-label" htmlFor="male">Nam</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="sex"
                                                    id="female"
                                                    value="Nữ"
                                                    checked={sex === "Nữ"}
                                                    onChange={handleSexChange}
                                                />
                                                <label className="form-check-label" htmlFor="female">Nữ</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="avatar" className="form-label">
                                            <i className="fas fa-image me-2"></i>Avatar<span className="text-danger">*</span>
                                        </label>
                                        <input 
                                            type="file" 
                                            id="avatar" 
                                            className="form-control" 
                                            accept="image/*" 
                                            onChange={handleAvatarChange}
                                        />
                                        <div className="mt-2">
                                            {avatar ? (
                                                <img src={avatar} alt="Avatar" className="img-thumbnail" style={{ width: "100px" }} />
                                            ) : user && user.avatar ? (
                                                <img src={user.avatar} alt="Avatar" className="img-thumbnail" style={{ width: "100px" }} />
                                            ) : (
                                                <div>Chưa có ảnh đại diện được chọn!</div>
                                            )}
                                        </div>
                                        <div className="form-check mt-2">
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input" 
                                                id="noAvatar" 
                                                onChange={handleNoAvatar}
                                            />
                                            <label className="form-check-label" htmlFor="noAvatar">Không dùng avatar</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="deliveryAddress" className="form-label">
                                    <i className="fas fa-truck me-2"></i>Địa chỉ giao hàng<span className="text-danger">*</span>
                                </label>
                                <input 
                                    id="deliveryAddress" 
                                    className="form-control" 
                                    value={deliveryAddress} 
                                    onChange={e => setDeliveryAddress(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="purchaseAddress" className="form-label">
                                    <i className="fas fa-shopping-bag me-2"></i>Địa chỉ mua hàng<span className="text-danger">*</span>
                                </label>
                                <input 
                                    id="purchaseAddress" 
                                    className="form-control" 
                                    value={purchaseAddress} 
                                    onChange={e => setPurchaseAddress(e.target.value)}
                                />
                            </div>

                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save me-2"></i>Lưu
                                </button>
                                {notice && (
                                    <div className={`mt-2 ${hasFull ? "text-success" : "text-danger"}`}>
                                        {notice}
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInformation;
