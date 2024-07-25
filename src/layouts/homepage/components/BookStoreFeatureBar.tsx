import { BiSolidDiscount } from "react-icons/bi";
import { BiSolidStar } from "react-icons/bi";
import { Link } from "react-router-dom";
const BookStoreFeatureBar=()=>{
    return(
        <div className="container"> 
            <div className="d-flex justify-content-center mt-2">
                <div className="border">
                    <button type="button" className="btn btn-outline-primary m-2">
                      <BiSolidStar style={{width:"24px",height:'24px',marginRight:"8px"}}/>Top bán chạy
                    </button>
                    <Link to="/vouchers"  className="btn btn-outline-success m-2">
                      <BiSolidDiscount style={{width:"24px",height:'24px',marginRight:"8px"}}/> Mã giảm giá
                    </Link>
                </div>
                
                
            </div>
        </div>
    )
}
export default BookStoreFeatureBar;