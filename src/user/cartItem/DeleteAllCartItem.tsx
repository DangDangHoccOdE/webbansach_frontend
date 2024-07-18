import { useNavigate } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";

const DeleteAllCartItem=()=>{
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    if(!isLoggedIn){
        navigate("/login")
        return;
    }
    

}

export default DeleteAllCartItem;