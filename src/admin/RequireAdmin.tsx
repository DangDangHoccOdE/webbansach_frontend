import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload{
    isAdmin: boolean,
    isUser:boolean,
    
}

const RequireAdmin= <P extends object>(WrappedComponent: React.ComponentType<P>) =>{
    const WithAdminCheck:React.FC<P>=(props)=>{
        const navigate = useNavigate();

        useEffect(()=>{
            const token = localStorage.getItem('accessToken');
            if(!token){
                navigate("/login");
                return;
            }else{
                const decodeToken = jwtDecode(token) as JwtPayload;
                // get info
                const isAdmin = decodeToken.isAdmin;
    
                if(!isAdmin){
                    navigate("/error-403");
                    return ;
                }

            }
        },[navigate])
        return <WrappedComponent {...props} />
    }
    return WithAdminCheck;
}

export default RequireAdmin;