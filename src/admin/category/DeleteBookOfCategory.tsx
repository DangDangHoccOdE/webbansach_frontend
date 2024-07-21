import { useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import EditCategory_Admin from "./EditCategory";
import { toast } from "react-toastify";

const DeleteBookOfCategory:React.FC=()=>{
    const {bookId} = useParams();
    const {categoryId} = useParams();
    const navigate = useNavigate()

    const bookIdNumber = parseInt(bookId+'');
    const categoryIdNumber = parseInt(categoryId+'');

    useEffect(()=>{
        const handleDelete = async()=>{
            const url:string =`http://localhost:8080/category/${categoryIdNumber}/books/${bookIdNumber}`
            try{
                const response = await fetchWithAuth(url,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                    },
                })
                const data = await response.json();
                if(response.ok){
                    toast.success(data.content)
                }else{
                    toast.error(data.content || "Lỗi, không thể xóa sách")
                }
            }catch(error){
                console.log({error})
            }finally{
                navigate(`/category/editCategory/${categoryIdNumber}`,{replace:true});
            }
        }
        handleDelete();
    },[bookIdNumber, categoryIdNumber, navigate])

    return(
        // eslint-disable-next-line react/jsx-pascal-case
        <EditCategory_Admin/>
    )
}

const DeleteBookOfCategory_Admin = RequireAdmin(DeleteBookOfCategory);
export default DeleteBookOfCategory_Admin;