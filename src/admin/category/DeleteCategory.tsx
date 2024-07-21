import { useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import GetAllCategory_Admin from "./ShowAllCategory";
import { toast } from "react-toastify";

const DeleteCategory:React.FC=()=>{
    const {categoryId} = useParams();
    const navigate = useNavigate();

    const categoryIdNumber = parseInt(categoryId+'');
    useEffect(()=>{
        const url:string = `http://localhost:8080/category/deleteCategory/${categoryIdNumber}`;

        const handleDelete=async()=>{
            try{
                const response = await fetchWithAuth(url,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    }
                }
                )

                const data = await response.json();
                if(response.ok){
                    toast.success(data.content)
                }else{
                    toast.error(data.content || "Lỗi không thể xóa thể loại này")
                }
            }catch(error){
                console.log({error});
                toast.error("Lỗi, không thể xóa thể loại này");
            }finally{
                navigate("/category/showAllCategory");
            }
        }
        
        handleDelete();
    })
    return(
       // eslint-disable-next-line react/jsx-pascal-case
       <GetAllCategory_Admin/>
    )
}

const DeleteCategory_Admin = RequireAdmin(DeleteCategory);
export default DeleteCategory_Admin;