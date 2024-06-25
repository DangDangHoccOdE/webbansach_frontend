import { createContext, useContext, useState } from "react";
import { isToken } from "../layouts/utils/JwtService";

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