import { createContext, useContext, useEffect, useState } from "react";
import { isToken, isTokenExpired, logout } from "./JwtService";
import { useNavigate } from "react-router-dom";

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
        const checkRefreshToken = async()=>{
            const refreshToken = localStorage.getItem("refreshToken");

            if(refreshToken&&isTokenExpired(refreshToken)){
                alert("Phiên làm việc đã hết, vui lòng đăng nhập lại!")
                logout();
                setLoggedIn(false);
                navigate("/login")
                return;
            }
            
        }
        checkRefreshToken();
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