import { ChangeEvent, useEffect, useState } from "react";
import getBase64 from "../layouts/utils/getBase64";
import { getUserByUsername } from "../api/UserAPI";
import UserModel from "../models/UserModel";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../layouts/utils/AuthContext";
import fetchWithAuth from "../layouts/utils/AuthService";

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
    const {username} = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
    
        if (username !== undefined) {
            setIsLoading(true);
            getUserByUsername(username)
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
    }, [isLoggedIn, navigate, username]);

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
                } else {
                    setHasFull(false);
                }
                setNotice(data.content);
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

    const handleSexChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSex(e.target.value);
    };

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileSizeInBytes = file.size;
            const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

            if (fileSizeInBytes > maxSizeInBytes) {
                alert("Dung lượng file ảnh không được vượt quá 1 MB");
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

    return (
        <div className="container">
            <h1 className="mt-5 text-center">Chỉnh sửa thông tin</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
                {isLoading && <div className="text-center">Đang tải...</div>}
                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-3">
                        <div className="row">
                            <label htmlFor="email" className="form-label">Email<span style={{ color: "red" }}> *</span> </label>
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
                        <label htmlFor="lastName" className="form-label">Họ đệm</label> <span style={{ color: "red" }}> *</span>
                        <input
                            type="text"
                            id="lastName"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">Tên</label> <span style={{ color: "red" }}> *</span>
                        <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="dateOfBirth" className="form-label">Ngày sinh</label> <span style={{ color: "red" }}> *</span>
                        <input
                            type="date"
                            id="dateOfBirth"
                            className="form-control"
                            value={dateOfBirth}
                            onChange={handleDateOfBirthChange}
                        />
                        <div style={{ color: "red" }}>{errorDateOfBirth}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label> <span style={{ color: "red" }}> *</span>
                        <input
                            type="text"
                            id="phoneNumber"
                            className="form-control"
                            value={phoneNumber}
                            onChange={handleChangePhoneNumber}
                        />
                        <div style={{ color: "red" }}>{errorPhoneNumber}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="sex" className="form-label">Giới tính</label> <span style={{ color: "red" }}> *</span>
                        <select className="form-control" id="sex" value={sex} onChange={handleSexChange}>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="avatar" className="form-label">Avatar</label> <span style={{ color: "red" }}> *</span>
                        <input type="file" id="avatar" className="form-control" accept="image/**" onChange={handleAvatarChange} ></input>
                        <br />
                        <div className="row">
                            <div className="col-6">
                                {
                                    avatar ? (
                                        <img src={avatar} alt="Avatar" style={{ width: "100px" }} />
                                    ) : user && user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" style={{ width: "100px" }} />
                                    ) : (
                                        <div>Chưa có ảnh đại diện được chọn!</div>
                                    )
                                }
                            </div>
                            <div className="col-6">
                                <input type="checkbox" id="noAvatar" value="Không dùng avatar" onClick={handleNoAvatar}></input>
                                <label htmlFor="noAvatar"> Không dùng avatar</label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="deliveryAddress" className="form-label">Địa chỉ giao hàng</label> <span style={{ color: "red" }}> *</span>
                        <input id="deliveryAddress" className="form-control" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}></input>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="purchaseAddress" className="form-label">Địa chỉ mua hàng</label> <span style={{ color: "red" }}> *</span>
                        <input id="purchaseAddress" className="form-control" value={purchaseAddress} onChange={e => setPurchaseAddress(e.target.value)}></input>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                            Lưu
                        </button>
                        <div style={{ color: hasFull ? "green" : "red" }}>{notice}</div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserInformation;
