import { logout } from "./JwtService";

interface RequestInitWithRetry extends RequestInit{
    _retry?:boolean;
}
let refreshTokenPromise:Promise<null|any>|null = null;

const fetchWithAuth = async (url:string,options:RequestInitWithRetry={}):Promise<Response>=>{
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(url,{...options,headers});

    if(response.status===401 && !options._retry){
        if(!refreshTokenPromise){
            refreshTokenPromise = refreshToken();
        }
        const data = await refreshTokenPromise;
        const {accessTokenJwt,refreshTokenJwt} = data;
        refreshTokenPromise = null;

        if(data){
            localStorage.setItem("accessToken",accessTokenJwt);
            localStorage.setItem("refreshToken",refreshTokenJwt);
            return fetchWithAuth(url, {...options,_retry:true});
        }
    }
    return response;
}

 const refreshToken = async ():Promise<string|null> => {

    const refreshToken = localStorage.getItem("refreshToken");
    try {
        const url = "http://localhost:8080/user/refreshToken";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Refresh-Token":`Refresh-Token ${refreshToken}`,
            },
        });
        const text = await response.text();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = JSON.parse(text);
        return data;
    } catch (error) {
        logout();
        window.location.replace("/login")
        throw error;
    }
};

export default fetchWithAuth;
