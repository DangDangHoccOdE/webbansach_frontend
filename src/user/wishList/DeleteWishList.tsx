import { useNavigate, useParams } from "react-router-dom";
import ShowWishListByUser from "./ShowWishListByUser";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { useEffect } from "react";

const DeleteWishList=()=>{
    const {wishListId} = useParams();
    const {userId} = useParams();
    const navigate = useNavigate();

    const handleDelete= async()=>{
        const url:string =`http://localhost:8080/wishList/deleteWishList/${wishListId}`;
        try{
            const response = await fetchWithAuth(url,{
                method:"DELETE",
                headers:{
                    "Content-type":"application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                }
            });
             
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
            navigate(`/user/showWishList/${userId}`);
        }
    }
    useEffect(()=>{
        handleDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  
    return(
        <ShowWishListByUser/>
    )
}

export default DeleteWishList;