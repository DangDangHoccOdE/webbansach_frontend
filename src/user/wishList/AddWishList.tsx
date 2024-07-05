import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";

const AddWishList=()=>{
    const {isLoggedIn} = useAuth();
    const {bookId} = useParams();
    const navigate = useNavigate();

    if(!isLoggedIn){
        navigate("/",{replace:true});
    }

    
    return(
        <div>

        </div>
    )
}

export default AddWishList;