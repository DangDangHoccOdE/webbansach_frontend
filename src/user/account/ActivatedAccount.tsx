import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ResendActivationCode from "./ResendActivationCode";
import useScrollToTop from "../../hooks/ScrollToTop";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

function ActivatedAccount() {
  const { email, activationCode } = useParams();
  const [isActivated, setIsActivated] = useState(false);
  const [notice, setNotice] = useState("");
  
  useScrollToTop();
  useEffect(() => {
    const activatedAccount = async () => {
      try {
        const url = `http://localhost:8080/user/activatedAccount?email=${email}&activationCode=${activationCode}`;
        const response = await fetch(url, { method: "GET" });

        const data = await response.json();

        if (response.ok) {
          setIsActivated(true);
          setNotice(data.content); 
        }else{
            setNotice(data.content)
        }

      } catch (error) {
        console.error("Lỗi khi kích hoạt: ", error);
        setNotice("Đã có lỗi xảy ra khi kích hoạt tài khoản.");
      }
    };

    if (email && activationCode) {
      activatedAccount();
    }
  }, [email, activationCode]);

  return (
    <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card border-0 shadow">
          <div className="card-body p-5">
            <h2 className="card-title text-center mb-4">Kích hoạt tài khoản</h2>
            
            <div className={`alert ${isActivated ? 'alert-success' : 'alert-warning'} d-flex align-items-center`} role="alert">
            <span className="flex-shrink-0 me-2">
              {isActivated ? <CheckCircleIcon /> : <WarningIcon />}
            </span>
              <div>{notice}</div>
            </div>
            
            {!isActivated && (
              <div className="mt-4">
                <ResendActivationCode />
              </div>
            )}
            
            {isActivated && (
              <div className="text-center mt-4">
                <Link to="/">
                    <button className="btn btn-primary">Tiếp tục đến trang chủ</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default ActivatedAccount;
