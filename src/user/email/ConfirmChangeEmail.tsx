import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchWithAuth from "../../layouts/utils/AuthService";
import useScrollToTop from "../../hooks/ScrollToTop";

function ConfirmChangeEmail() {
    const { email, emailCode, newEmail } = useParams();
    const [notice, setNotice] = useState("");
    const [hasDone, setHasDone] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useScrollToTop();

    useEffect(() => {
        const confirm = async () => {
            try {
                setIsLoading(true);
                const url = `http://localhost:8080/user/confirmChangeEmail?email=${email}&emailCode=${emailCode}&newEmail=${newEmail}`;
                const response = await fetchWithAuth(url, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setHasDone(true);
                } else {
                    setHasDone(false);
                }
                setNotice(data.content);
            } catch (error) {
                console.error("Lỗi khi thay đổi email: ", error);
                setNotice("Đã có lỗi xảy ra khi thay đổi email!");
                setHasDone(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (email && emailCode && newEmail) {
            confirm();
        }
    }, [email, emailCode, newEmail]);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h2 className="card-title mb-4">Xác nhận thay đổi email</h2>
                            {isLoading ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Đang xử lý...</span>
                                </div>
                            ) : (
                                <div className={`alert ${hasDone ? 'alert-success' : 'alert-danger'}`} role="alert">
                                    {notice}
                                </div>
                            )}
                            {!isLoading && (
                                <div className="mt-4">
                                    <p>Email cũ: <strong>{email}</strong></p>
                                    <p>Email mới: <strong>{newEmail}</strong></p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmChangeEmail;