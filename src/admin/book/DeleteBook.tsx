import { useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import fetchWithAuth from "../../layouts/utils/AuthService";
import { useEffect } from "react";
import HomePage from "../../layouts/homepage/HomePage";
import { toast } from "react-toastify";

const DeleteBook:React.FC=()=>{
    const {bookId} = useParams();
    const navigate = useNavigate();
    const handleDelete=async()=>{
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
                toast.error(data.content||"Đã có lỗi xảy ra, không thể xóa!");
            }
        }catch(error){
            console.error({error});
        }finally{
            navigate("/",{replace:true})
        }
    }
    useEffect(()=>{
        handleDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <HomePage bookNameFind=""/>
    );
    
}
 const DeleteBook_Admin = RequireAdmin(DeleteBook);
 export default DeleteBook_Admin;