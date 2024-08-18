import React, { ChangeEvent, useEffect, useState } from "react";
import UserModel from "../../models/UserModel";
import { useNavigate } from "react-router-dom";
import { getUsernameByToken } from "../../layouts/utils/JwtService";
import { getUserByCondition } from "../../api/UserAPI";
import { checkEmail } from "../../api/AccountAPI";
import fetchWithAuth from "../../layouts/utils/AuthService";
import useScrollToTop from "../../hooks/ScrollToTop";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ChangeEmail: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [errorEmail, setErrorEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [hasError, setHasError] = useState(false);
    const [notice, setNotice] = useState("");
    const [user, setUser] = useState<UserModel | null>(null);
    const [emailValue, setEmailValue] = useState(""); // State để điều khiển giá trị email
    const [isLoading, setIsLoading] = useState(false); // State để theo dõi trạng thái loading
    const navigate = useNavigate();

    useScrollToTop()
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        } else {
            const usernameByToken = getUsernameByToken();
            console.log(usernameByToken);
            if (usernameByToken !== undefined) {
                setIsLoading(true); // Bắt đầu hiển thị biểu tượng loading
                getUserByCondition(usernameByToken)
                    .then((user) => {
                        setUser(user);
                        setEmailValue(user?.email || ""); // Cập nhật giá trị email từ user
                    })
                    .catch((error) => {
                        console.error("Lỗi load info user!", error);
                        setNotice("Không thể load được thông tin user!");
                        toast.error("Lỗi load info user!");
                    })
                    .finally(() => {
                        setIsLoading(false); // Kết thúc hiển thị biểu tượng loading
                    });
            } else {
                toast.error("Không có thông tin user!");
                navigate("/");
            }
        }
    }, [isLoggedIn, navigate]);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value);
        setErrorEmail("");
    };

    const handleEmailBlur = async () => {
        if (newEmail) {
            await checkEmail(newEmail, { setErrorEmail });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotice("");

        if (!newEmail) {
            setErrorEmail("Email không thể bỏ trống!");
            return;
        } 
        
        if (errorEmail) {
            return; // Không tiếp tục nếu có lỗi email
        }

        const email = user?.email;
       
            try {
                setHasError(false);
                setIsLoading(true); // Bắt đầu hiển thị biểu tượng loading
                setNotice("Đang xử lý...");
                const emailInfo = {
                    email,
                    newEmail,
                };

                const url: string = "http://localhost:8080/user/changeEmail";
                const response = await fetchWithAuth(url, {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body: JSON.stringify(emailInfo),
                });
                const data = await response.json();
                console.log(response);
                if (response.ok) {
                    setHasError(false);
                } else {
                    setHasError(true);
                }
                setNotice(data.content)
            } catch (error) {
                setNotice("Đã xảy ra lỗi trong quá trình cập nhật thông tin!");
                console.log({ error });
                setHasError(true);
            } finally {
                setIsLoading(false); // Kết thúc hiển thị biểu tượng loading
            }
    };

    if (!isLoggedIn) {
        return null;
    }
    return (
        <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Chỉnh sửa email</h2>
                        {isLoading && (
                            <div className="text-center mb-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email hiện tại</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={emailValue}
                                    readOnly
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newEmail" className="form-label">
                                    Email mới <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="newEmail"
                                    className={`form-control ${errorEmail ? 'is-invalid' : ''}`}
                                    value={newEmail}
                                    onChange={handleEmailChange}
                                    onBlur={handleEmailBlur}
                                />
                                {errorEmail && <div className="invalid-feedback">{errorEmail}</div>}
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                   Lưu thay đổi
                                </button>
                            </div>
                        </form>
                        {notice && (
                            <div className={`alert mt-3 ${hasError ? 'alert-danger' : 'alert-success'}`} role="alert">
                                {notice}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ChangeEmail;
