import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "../../layouts/utils/AuthService";
import EditWishList from "./EditWishList";

const DeleteBookOfWishList=()=>{
    const {bookId} = useParams();
    const {wishListIdNumber} = useParams();
    const navigate = useNavigate();

    const bookIdNumber = parseInt(bookId+'');
    const wishListId = parseInt(wishListIdNumber+'');

    useEffect(()=>{
        const deleteBook = async()=>{
            const url:string = "http://localhost:8080/wishList/deleteBookOfWishList";
            try{
                const response = await fetchWithAuth(url,{
                    method:"DELETE",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify({
                        wishListId:wishListId,
                        bookId:bookIdNumber
                    })
                })

                const data = await response.json();
                if(response.ok){
                    alert(data.content);
                }else{
                    alert(data.content || "Lỗi không thể xóa sách")
                }
            }catch(error){
                console.log({error});
                alert("Lỗi, không thể xóa sách");
            }finally{
                navigate(`/wishList/editWishList/${wishListId}`,{replace:true});
            }
        }

        deleteBook();
    },[bookIdNumber, navigate, wishListId])
    return(
        <EditWishList/>
    )
}

export default DeleteBookOfWishList;