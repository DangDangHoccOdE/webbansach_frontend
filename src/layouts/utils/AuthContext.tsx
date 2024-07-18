import { createContext, useContext, useEffect, useState } from "react";
import { getUsernameByToken, isToken, isTokenExpired, logout } from "./JwtService";
import { useNavigate } from "react-router-dom";
import UserModel from "../../models/UserModel";
import { getUserByUsername } from "../../api/UserAPI";

interface AuthContextType{
    isLoggedIn:boolean;
    setLoggedIn : any;
    user:UserModel|null;
    setUser:(user:UserModel|null) => void
}

interface AuthContextProps{
    children:React.ReactNode;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider:React.FC<AuthContextProps>=(props)=>{
    const [isLoggedIn,setLoggedIn] = useState(isToken());
    const [user,setUser] = useState<UserModel|null>(null)
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
        const getUser = async()=>{
            const username = getUsernameByToken();
            if(username){
                const getUser = await getUserByUsername(username);
                setUser(getUser);
            }        
        }
        checkRefreshToken();
        getUser();
    },[navigate]);
    return (
        <AuthContext.Provider value={{isLoggedIn,setLoggedIn,user,setUser}}>
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