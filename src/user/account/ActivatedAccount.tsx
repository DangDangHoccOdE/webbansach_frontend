import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResendActivationCode from "./ResendActivationCode";
import useScrollToTop from "../../hooks/ScrollToTop";

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

        console.log(data.content)
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
    <div className="text-center">
      <h1>Kích hoạt tài khoản</h1>
        <h4 style={{color:isActivated?"green":"red"}}>{notice}</h4>
        {
            !isActivated && <ResendActivationCode/>
        }
     </div>
  );
}

export default ActivatedAccount;
