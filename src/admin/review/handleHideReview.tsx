import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";
import { checkRoleAdmin } from "../../layouts/utils/JwtService";

const handleHideReview=async(reviewId:number):Promise<boolean>=>{
    const isAdmin = checkRoleAdmin();
    if(!isAdmin){
            toast.error("Bạn không có quyền xóa đơn hàng!");
            return false;
    }
    
        try{
            const url:string=`http://localhost:8080/review/hideReview/${reviewId}`;
    
            const response = await fetchWithAuth(url,{
                method:"PUT",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                  }
                });
                const data = await response.json();
                if (response.ok) {
                  toast.success(data.content);
                  return true;
                } else {
                  toast.error("Lỗi, không thể ẩn đánh giá này!");
                  return false
                }
              } catch (error) {
                console.error({ error });
                toast.error("Lỗi, không thể ẩn đánh giá");
                return false
              }
        };
    

export default handleHideReview;