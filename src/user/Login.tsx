import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../layouts/utils/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login=()=>{
    
const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const [notice,setNotice] = useState("");
const [isError,setIsError] = useState(false)
const navigate = useNavigate();
const {isLoggedIn,setLoggedIn} = useAuth();
useEffect(() => {
    if(isLoggedIn){
        navigate("/",{replace:true});
    }
});

const handleLogin=async (e:React.FormEvent) =>{
    e.preventDefault();
    const loginRequest =    {
        username:username,
        password:password
    }
    console.log(username)

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
        console.log(data)

        if(response.ok){
            console.log("Đăng nhập thành công!")

            setIsError(false)
            const {accessTokenJwt,refreshTokenJwt} = data;
            localStorage.setItem("accessToken",accessTokenJwt);
            localStorage.setItem("refreshToken",refreshTokenJwt);
            setNotice("Đăng nhập thành công!");

            if(accessTokenJwt && refreshTokenJwt){
                console.log(jwtDecode(accessTokenJwt));
                console.log(jwtDecode(refreshTokenJwt));

            }
            setTimeout(() => {
                navigate('/',{replace:true});
              }, 2000);
              setLoggedIn(true)

        }else{
            setNotice(data.content)
            console.log(data.content)
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

    return (
        <div className="vh-100" style={{backgroundColor:"#9A616D"}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-xl-10">
                    <div className="card" style={{borderRadius: "1rem"}}>
                    <div className="row g-0">
                        <div className="col-md-6 col-lg-5 d-none d-md-block">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                            alt="login form" className="img-fluid" style={{borderRadius: "1rem 0 0 1rem"}} />
                        </div>
                        <div className="col-md-6 col-lg-7 d-flex align-items-center">
                        <div className="card-body p-4 p-lg-5 text-black">

                            <form className="form" onSubmit={handleLogin}>

                            <div className="d-flex align-items-center mb-3 pb-1">
                                <i className="fas fa-cubes fa-2x me-3" style={{color: "#ff6219"}}></i>
                                <span className="h1 fw-bold mb-0">Logo</span>
                            </div>

                            <h5 className="fw-normal mb-3 pb-3" style={{letterSpacing: "1px"}}>Sign into your account</h5>

                            <div data-mdb-input-init className="form-outline mb-4">
                                <input type="email" id="form2Example17" className="form-control form-control-lg" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleEnter} />
                                <label className="form-label" htmlFor="form2Example17">User name</label>
                            </div>

                            <div data-mdb-input-init className="form-outline mb-4">
                                <input type="password" id="form2Example27" className="form-control form-control-lg" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={handleEnter}/>
                                <label className="form-label" htmlFor="form2Example27">Password</label>
                            </div>

                            <div className="pt-1 mb-4">
                                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-dark btn-lg btn-block" type="submit" onClick={handleLogin} >Login</button>
                            </div>
                            {notice && <div style={{color:isError?"red":"green"}}>{notice}</div>}

                            <a className="small text-muted" href="#!">Forgot password?</a>
                            <p className="mb-5 pb-lg-2" style={{color: "#393f81"}}>Don't have an account? <a href="#!"
                                style={{color: "#393f81"}}>Register here</a></p>
                            <a href="#!" className="small text-muted">Terms of use.</a>
                            <a href="#!" className="small text-muted">Privacy policy</a>
                            </form>
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