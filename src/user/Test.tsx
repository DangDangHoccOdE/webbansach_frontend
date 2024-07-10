import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"
import useScrollToTop from "../hooks/ScrollToTop";

const Test = () =>{
    const [username,setUsername] = useState<string|null>(null);
    useScrollToTop();
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const userData = jwtDecode(token);
            console.log(userData);
            if(userData){
                setUsername(userData.sub+"");
            }
        }
        console.log(token)
    },[]);
    return (
    <div>
         {
        username && <div>Xin chào, {username}</div>
         }
    </div>
    
    );
}

export default Test;