import { createContext, useContext, useEffect, useState } from "react";
import { isToken, isTokenExpired, logout } from "../layouts/utils/JwtService";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "./AuthService";

interface AuthContextType{
    isLoggedIn:boolean;
    setLoggedIn : any;
}

interface AuthContextProps{
    children:React.ReactNode;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider:React.FC<AuthContextProps>=(props)=>{
    const [isLoggedIn,setLoggedIn] = useState(isToken());
    const navigate = useNavigate();

    useEffect(()=>{
        const checkAndRefreshToken = async()=>{
            const refreshToken = localStorage.getItem("refreshToken");
             const accessToken = localStorage.getItem("accessToken");

            if(refreshToken&&isTokenExpired(refreshToken)){
                logout();
                setLoggedIn(false);
                navigate("/login")
                return;
            }
            if(accessToken&& isTokenExpired(accessToken) && refreshToken){
                try{
                    const response = await refreshAccessToken(refreshToken);
                    const {accessTokenJwt, refreshTokenJwt} = response;
                    localStorage.setItem('accessToken',accessTokenJwt);
                    localStorage.setItem('refreshToken',refreshTokenJwt);
                    setLoggedIn(true);
                }catch(error){
                    console.log("không thể fetch được api")
                    setLoggedIn(false);
                    navigate("/");
                }
            }
        }
        checkAndRefreshToken();
        const interval = setInterval(checkAndRefreshToken,1*60*1000);
        return ()=>clearInterval(interval);
    },[navigate]);
    return (
        <AuthContext.Provider value={{isLoggedIn,setLoggedIn}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth=():AuthContextType=>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("Lỗi context");
	}
	return context;
};