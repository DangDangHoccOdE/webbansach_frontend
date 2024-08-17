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
                        console.log(user);
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

        return checkEmail(e.target.value, { setErrorEmail });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotice("");

        if (!newEmail) {
            setErrorEmail("Email không thể bỏ trống!");
            return;
        }

        const email = user?.email;
        const emailValid = await checkEmail(newEmail, { setErrorEmail });

        if (emailValid) {
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
        }
    };

    if (!isLoggedIn) {
        return null;
    }
    return (
        <div className="container">
            <h1 className="mt-5 text-center">Chỉnh sửa email</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
                {isLoading && <div className="text-center">Đang tải...</div>}
                <form className="form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            Email <span style={{ color: "red" }}> *</span>
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="form-control"
                            value={emailValue}
                            readOnly
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="newEmail">
                            Email mới <span style={{ color: "red" }}> *</span>
                        </label>
                        <input
                            type="text"
                            id="newEmail"
                            className="form-control"
                            value={newEmail}
                            onChange={handleEmailChange}
                        />
                        <div style={{ color: "red" }}>{errorEmail}</div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                            Lưu
                        </button>
                        <div style={{ color: notice === "Đang xử lý..." ? "red" : hasError ? "red" : "green" }}>
                            {notice}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeEmail;
