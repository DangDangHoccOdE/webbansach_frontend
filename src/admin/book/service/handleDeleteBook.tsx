import fetchWithAuth from "../../../layouts/utils/AuthService";
import { toast } from "react-toastify";
import { checkRoleAdmin } from "../../../layouts/utils/JwtService";

const handleDeleteBook=async(bookId:number)=>{
    const isAdmin = checkRoleAdmin();
    if(!isAdmin){
            toast.error("Bạn không có quyền xóa sách!");
            return false;
    }
        try{
            const url:string=`http://localhost:8080/books/deleteBook/${bookId}`;
            const response = await fetchWithAuth(url,{
                method:"DELETE",
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                }
            }
            )

            const data =await response.json();
            if(response.ok){
                toast.success(data.content);
            }else{
                toast.error("Đã có lỗi xảy ra, không thể xóa!");
            }
        }catch(error){
            console.error({error});
        }
}
 export default handleDeleteBook;