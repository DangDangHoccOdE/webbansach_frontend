import { jwtDecode } from "jwt-decode"

interface JwtPayload{
    userId:string,
    avatar:string,
    firstName:string,
    enable:string,
    isAdmin:boolean,
    isStaff:boolean,
    isUser:boolean
}
const dataToken = localStorage.getItem('token')

export function getUsernameByToken(){
    if(dataToken){
        return jwtDecode(dataToken).sub;
    }
}

export function getAvatarByToken(){
    if(dataToken){
        const decode = jwtDecode(dataToken) as JwtPayload
        return decode.avatar;
    }
}

export function getFirstNameByToken(){
    if(dataToken){
        const decode = jwtDecode(dataToken) as JwtPayload
        return decode.firstName;
    }
}