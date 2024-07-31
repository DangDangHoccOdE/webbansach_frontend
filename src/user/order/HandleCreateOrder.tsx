import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchWithAuth from "../../layouts/utils/AuthService";
import OrderModel from "../../models/OrderModel";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../layouts/utils/Loading";

const HandleCreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [isError, setIsError] = useState(true);

  const { order } = (location.state as { order: OrderModel }) || { order: null };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/", { replace: true });
      return;
    }

    const handle = async () => {
      setIsLoading(true);
      const url: string = `http://localhost:8080/order/addOrder`;
      try {
        const response = await fetchWithAuth(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(order),
        });

        const data = await response.json();
        if (response.ok) {
          setNotice(data.content);
          setIsError(false);
        } else {
          setNotice(data.content || "Đặt hàng không thành công!");
          setIsError(true);
        }
      } catch (error) {
        console.log({ error });
        setNotice("Đã xảy ra lỗi khi xử lý đơn hàng.");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    handle();
  }, [order, navigate, isLoggedIn]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              {isLoading ? (
                <>
                  <Loading />
                  <p className="mt-3">Đang xử lý đơn hàng của bạn</p>
                </>
              ) : (
                <>
                  {notice && (
                    <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
                      <h4 className="alert-heading">{isError ? 'Lỗi!' : 'Thành công!'}</h4>
                      <p>{notice}</p>
                    </div>
                  )}
                  {!isLoading && !notice && (
                    <p>Đang chờ xử lý đơn hàng...</p>
                  )}
                  <button 
                    className="btn btn-primary mt-3" 
                    onClick={() => navigate('/')}
                  >
                    Trở về trang chủ
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleCreateOrder;