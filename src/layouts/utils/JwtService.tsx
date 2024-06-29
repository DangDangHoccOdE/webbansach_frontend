import { jwtDecode } from 'jwt-decode';
// interface JwtPayload {
//     userId: string;
//     enable: boolean;
//     isAdmin: boolean;
//     isStaff: boolean;
//     isUser: boolean;
// }

export function isTokenExpired(token: string) {
    const decode = jwtDecode(token);
    if (!decode.exp) {
        return false;
    }
    const currentTime = Date.now() / 1000; // current time in seconds
    return currentTime > decode.exp;
}


export function getUsernameByToken(){
    const dataToken = localStorage.getItem('accessToken')
    if(dataToken){
        return jwtDecode(dataToken).sub;
    }
}

// export function getFirstNameByToken(){
//     const dataToken = localStorage.getItem('accessToken')
//     if(dataToken){
//         const decode = jwtDecode(dataToken) as JwtPayload
//         return decode.firstName;
//     }
// }

export function isToken(){
    const token = localStorage.getItem('accessToken');
    if(token){
        return true;
    }
    return false;
}

export function logout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}
