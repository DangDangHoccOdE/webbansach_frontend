import { useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import fetchWithAuth from "../../layouts/utils/AuthService";
import { useEffect } from "react";
import HomePage from "../../layouts/homepage/HomePage";

const DeleteBook:React.FC=()=>{
    const {bookId} = useParams();
    const navigate = useNavigate();

    const handleDelete=async()=>{
        try{
            const url:string=`http://localhost:8080/admin/deleteBook/${bookId}`;
            const response = await fetchWithAuth(url,{
                method:"DELETE",
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                }
            }
            )

            const data =await response.json();
            console.log(data.content)
            if(response.ok){
                alert(data.content);
            }else{
                alert(data.content||"Đã có lỗi xảy ra, không thể xóa!");
            }
        }catch(error){
            console.error({error});
        }finally{
            navigate("/");
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