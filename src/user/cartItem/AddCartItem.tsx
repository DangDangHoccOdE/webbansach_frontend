import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

interface AddToCartProps{
    bookId:number,
    quantity:number,
    isIcon:boolean
}
const AddCartItem:React.FC<AddToCartProps> = (props)=>{
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate()
    const {updateCartItemCount} = useContext(CartContext);

    const userId = getUserIdByToken();
        const url:string = `http://localhost:8080/cart-items/addCartItem`
        const addCartItem = async ()=>{
            if(!isLoggedIn){
                navigate("/login")
                return null;
            }
            try{
                const response = await fetchWithAuth(url,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify({
                        bookId:props.bookId,
                        userId:userId,
                        quantity:props.quantity
                    })
                });

                const data = await response.json();
                if(response.ok){
                    updateCartItemCount();
                    setTimeout(()=>{
                        toast.success(data.content)
                    },1000)
                }else{
                    toast.error(data.content || "Lỗi, không thể thêm vào giỏ hàng")
                }
            }catch(error){
                console.log({error})
            }
        }

    return (
        !props.isIcon ?
            <button type="button" className="btn btn-outline-secondary mt-2" onClick={addCartItem}>
                Thêm vào giỏ hàng
            </button>

        :  <button className="btn btn-danger btn-block" onClick={addCartItem}>
             <i className="fas fa-shopping-cart"></i>
         </button>
    )
}

export default AddCartItem;