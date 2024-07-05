import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchWithAuth from "../../layouts/utils/AuthService";

function ConfirmChangeEmail(){
    const {email,emailCode,newEmail} = useParams();
    const [notice,setNotice] = useState("");
    const [hasDone,setHasDone] = useState(false);
    useEffect(()=>{
        const confirm = async()=>{
            try{
                const url = `http://localhost:8080/user/confirmChangeEmail?email=${email}&emailCode=${emailCode}&newEmail=${newEmail}`;
                const response  = await fetchWithAuth(url,
                    {method:"GET",
                        headers: {
                            "Content-type": "application/json",
                            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                        },
                    }
                );

                const data = await response.json();
                console.log(data.content);

                console.log(data.content);
                if(response.ok){
                    setHasDone(true);
                }else{
                    setHasDone(false);
                }
                setNotice(data.content);
            }catch(error){
                console.error("Lỗi khi thay đổi email: ",error);
                setNotice("Đã có lỗi xảy ra khi thay đổi email!");
            }
        };

        if(email&&emailCode&&newEmail){
            confirm();
        }
    },[email,emailCode,newEmail])

    return(
        <div className="container text-center">
            <h1>Thay đổi email</h1>
            <h4 style={{color:hasDone?"green":"red"}}>{notice}</h4>
        </div>
    )
}

export default ConfirmChangeEmail;