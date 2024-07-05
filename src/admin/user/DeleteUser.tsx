import RequireAdmin from "../RequireAdmin"
import fetchWithAuth from "../../layouts/utils/AuthService";
import { useEffect } from "react";
import GetAllUser_Admin from "./GetAllUser";
import { useNavigate, useParams } from "react-router-dom";

const DeleteUser:React.FC=()=>{
    const {username} = useParams();
    const navigate = useNavigate();

    const handleDelete= async()=>{
        const url:string = `http://localhost:8080/user/deleteUser/${username}`;
    try{
        const response = await fetchWithAuth(url,{
            method:"DELETE",
            headers:{
                "Content-type":"application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })

        const data =await response.json();
        if(response.ok){
            alert(data.content);
        }else{
            alert(data.content||"Đã có lỗi xảy ra, không thể xóa!");
        }
    }catch(error){
        console.error({error});
    }finally{
        navigate("/admin/getAllUsers");
    }
}
    useEffect(()=>{
            handleDelete();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[])


    return(
        // eslint-disable-next-line react/jsx-pascal-case
        <GetAllUser_Admin/>
    )
}

const DeleteUser_Admin = RequireAdmin(DeleteUser);
export default DeleteUser_Admin;