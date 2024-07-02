import { jwtDecode } from "jwt-decode";

interface JwtPayload{
    isAdmin:boolean,
    isUser:boolean,
}

const checkCurrentRole=()=>{
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
        const decode = jwtDecode(accessToken) as JwtPayload;
        return decode;
    }
    return null;
}

const isAdmin=():boolean=>{
    const userRole = checkCurrentRole();
    return userRole?.isAdmin??false;
}

export default isAdmin;