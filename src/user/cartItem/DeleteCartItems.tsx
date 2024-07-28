import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "../../layouts/utils/AuthService";
import ShowCart from "./ShowCartItemByUser";
import { toast } from "react-toastify";
import { CartContext } from "../../context/CartContext";

const DeleteCartItems = () => {
    const {cartItemId} = useParams();
    const {userId} = useParams();
    const navigate = useNavigate();
    const {updateCartItemCount} = useContext(CartContext);

    useEffect(()=>{
        const url:string = `http://localhost:8080/cart-items/deleteCartItem/${cartItemId}`;

        const handleDelete = async()=>{
            try{
                const response = await fetchWithAuth(url,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
                const data = await response.json();
                if(response.ok){
                    updateCartItemCount();
                    toast.success(data.content);
                    navigate(`/user/showCart/${userId}`);
                }else{
                    toast.error(data.content || "Lỗi không thể xóa sách giỏ hàng");
                }
            }catch(error){
                console.log({error})
            }
        }

        handleDelete();
    },[navigate, userId, cartItemId, updateCartItemCount])

    return(
        <ShowCart/>
    )
}

export default DeleteCartItems;