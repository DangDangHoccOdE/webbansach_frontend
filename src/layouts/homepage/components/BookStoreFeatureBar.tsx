import { BiSolidDiscount } from "react-icons/bi";
import { Link } from "react-router-dom";
const BookStoreFeatureBar=()=>{
    return(
        <div className="container"> 
            <div className="d-flex justify-content-center mt-2">
                <div className="border">
                    <Link to="/vouchers"  className="btn btn-outline-success m-2">
                      <BiSolidDiscount style={{width:"24px",height:'24px',marginRight:"8px"}}/> Mã giảm giá
                    </Link>
                </div>
                
                
            </div>
        </div>
    )
}
export default BookStoreFeatureBar;