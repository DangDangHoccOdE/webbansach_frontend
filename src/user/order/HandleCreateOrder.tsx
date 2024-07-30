import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchWithAuth from "../../layouts/utils/AuthService";
import OrderModel from "../../models/OrderModel";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../layouts/utils/Loading";


const HandleCreateOrder:React.FC=()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const {isLoggedIn} = useAuth();
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("")
    const [isError,setIsError] = useState(true);

    const { order } = location.state as {
        order:OrderModel 
    } || {order: null}

    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/",{replace:true});
            return;
        }
        const handle=async()=>{
            setIsLoading(true)
            const url:string = `http://localhost:8080/order/createOrder`
            try{
                const response = await fetchWithAuth(url,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify(
                        order
                    )
                })

                const data = await response.json();
                if(response.ok){
                    setNotice(data.content);
                    setIsError(false);
                }else{
                    setNotice(data.content || "Đặt hàng không thành công!");
                    setIsError(true);
                }
            }catch(error){
                console.log({error})
            }finally{
                setIsLoading(false);
            }
        }
        handle();
    },[order, navigate, isLoggedIn])

    return (
        <div>
            {isLoading ? 
                <Loading/> &&
                 <div className="text-center">
                    Đang xử lý đơn hàng của bạn
                </div>
                : null}
            

                {
                    notice && isError &&
                    <div className="text-center">
                        <h4>{notice}</h4>
                    </div> 
                
                }
        </div>
    );
}

export default HandleCreateOrder;