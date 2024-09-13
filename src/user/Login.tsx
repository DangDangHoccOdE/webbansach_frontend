import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useScrollToTop from "../hooks/ScrollToTop";
import { useAuth } from "../context/AuthContext";
import { GOOGLE_AUTH_URL } from "../constants/oauth2";

const Login=()=>{
const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const [notice,setNotice] = useState("");
const [isError,setIsError] = useState(false)
const navigate = useNavigate();
const {isLoggedIn,setLoggedIn} = useAuth();

useScrollToTop()
useEffect(() => {
    if(isLoggedIn){
        const redirectPath = localStorage.getItem("redirectPath") || "/"
        navigate(redirectPath,{replace:true});
    }
},[isLoggedIn, navigate]);

const handleLogin=async (e:React.FormEvent) =>{
    e.preventDefault();
    const loginRequest =    {
        username:username,
        password:password
    }

    try{
        const url:string = "http://localhost:8080/user/login";
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify(loginRequest)
        })

        const data = await response.json();

        if(response.ok){
            setIsError(false)
            const {accessTokenJwt,refreshTokenJwt} = data;
            localStorage.setItem("accessToken",accessTokenJwt);
            localStorage.setItem("refreshToken",refreshTokenJwt);
            setNotice("Đăng nhập thành công!");

            setTimeout(() => {
                const redirectPath = localStorage.getItem("redirectPath") || "/";
                localStorage.removeItem("redirectPath"); // Xóa redirectPath sau khi sử dụng
                navigate(redirectPath, { replace: true });
                setLoggedIn(true);
            }, 2000);

        }else{
            setNotice(data.content)
            setIsError(true)
        }
  
    }catch(error){
        console.log("Đăng nhập không thành công!",error)
        setIsError(true)
    }
}

const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  }

  const handleLoginWithGoogle=async()=>{
      // Chuyển đến link đăng nhập
      window.location.href = GOOGLE_AUTH_URL;
    } 

  return (
    <div className="vh-100" style={{backgroundColor: "#F3E9DD"}}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{borderRadius: "1rem", boxShadow: "0 4px 8px rgba(0,0,0,0.1)"}}>
              <div className="row g-0">
              <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <img 
                        src='./../../../logo.jpg'
                        alt="bookstore" 
                        className="img-fluid" 
                        style={{
                            borderRadius: "1rem 0 0 1rem", 
                            objectFit: "contain", 
                            maxHeight: "80%", 
                            maxWidth: "80%",
                            padding: "20px"
                        }} 
                        />
                    </div>
                    </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form className="form" onSubmit={handleLogin}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i className="fas fa-book fa-2x me-3" style={{color: "#8E6F3E"}}></i>
                        <span className="h1 fw-bold mb-0">BookStore</span>
                      </div>
  
                      <h5 className="fw-normal mb-3 pb-3" style={{letterSpacing: "1px"}}>Đăng nhập</h5>
  
                      <div className="form-outline mb-4">
                        <input type="text" id="form2Example17" className="form-control form-control-lg" 
                          value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleEnter}/>
                        <label className="form-label" htmlFor="form2Example17">Tài khoản</label>
                      </div>
  
                      <div className="form-outline mb-2">
                        <input type="password" id="form2Example27" className="form-control form-control-lg" 
                          value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleEnter}/>
                        <label className="form-label" htmlFor="form2Example27">Mật khẩu</label>
                      </div>

                          <Link className="small text-muted" to="/user/forgotPassword">Quên mật khẩu?</Link>
                     
                      <div className="pt-1 mb-4 text-center">
                        <button className="btn btn-lg btn-block" type="submit" 
                          style={{backgroundColor: "#8E6F3E", color: "white"}}>Đăng nhập</button>
                      </div>
                      {notice && <div style={{color: isError ? "red" : "green"}}>{notice}</div>}
                    </form>
            
                    <hr className="my-6"/>
                      <div className="space">
                        <button className="btn btn-danger" onClick={handleLoginWithGoogle}>
                          <i className="fab fa-google me-2"></i>Đăng nhập với Google
                        </button>
                      </div>

                          <p className="mt-3 pb-lg-2" style={{color: "#393f81"}}>
                            Bạn chưa có tài khoản? <Link to="/register" style={{color: "#8E6F3E"}}>Đăng ký tại đây</Link>
                          </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
export default Login;
