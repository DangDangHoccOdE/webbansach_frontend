import { jwtDecode } from 'jwt-decode'; // Sửa lại import ở đây
interface JwtPayload {
    userId: string;
    avatar: string;
    email:string;
    firstName: string;
    enable: boolean;
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
}

export function isTokenExpired(token:string){
    const decode = jwtDecode(token);
    if(!decode.exp){
        return false;
    }

    const currentTime = Date.now() / 1000 // => second
    return currentTime < decode.exp
}

export function getUsernameByToken(){
    const dataToken = localStorage.getItem('token')
    if(dataToken){
        return jwtDecode(dataToken).sub;
    }
}
export function getEmailByToken(){
    const dataToken = localStorage.getItem('token')
    if(dataToken){
        const decode = jwtDecode(dataToken) as JwtPayload
        return decode.email;
    }
}

export function getAvatarByToken(){
    const dataToken = localStorage.getItem('token')
    if(dataToken){
        const decode = jwtDecode(dataToken) as JwtPayload
        return decode.avatar;
    }
}

export function getFirstNameByToken(){
    const dataToken = localStorage.getItem('token')
    if(dataToken){
        const decode = jwtDecode(dataToken) as JwtPayload
        return decode.firstName;
    }
}

export function isToken(){
    const token = localStorage.getItem('token');
    if(token){
        return true;
    }
    return false;
}
