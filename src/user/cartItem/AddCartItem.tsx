import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { getUserIdByToken } from "../../layouts/utils/JwtService";

const AddCartItem = ()=>{
    const {bookId} = useParams();
    const userId = getUserIdByToken();
    const navigate = useNavigate()

    useEffect(()=>{
        const url:string = `http://localhost:8080/cart-items`
        const addCartItem = async ()=>{
            try{
                const response = await fetchWithAuth(url,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify({
                        bookId:bookId,
                        userId:userId
                    })
                });

                const data = await response.json();
                if(response.ok){
                    alert(data.content)
                    navigate("/")
                }else{
                    alert(data.content || "Lỗi, không thể thêm vào giỏ hàng")
                }
            }catch(error){
                console.log({error})
            }
        }

        addCartItem();
    },[bookId,userId,navigate])

    return null
}

export default AddCartItem;