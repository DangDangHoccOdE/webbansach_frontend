import { ChangeEvent, useEffect, useState } from "react";
import { Button, FormSelect, Modal } from "react-bootstrap";
import WishListModel from "../../models/WishListModel";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { getWishListByUserId } from "../../api/WishListAPI";
import useScrollToTop from "../../hooks/ScrollToTop";

interface BookSubmitFormProps {
    bookId:number,
    handleClose:()=>void;
    showModal:boolean;
    setNoticeSubmit:(value:string)=>void;
    noticeSubmit:string
}

const AddBookToWishList:React.FC<BookSubmitFormProps>=({bookId,handleClose,showModal,setNoticeSubmit,noticeSubmit})=>{
    const [wishList,setWishList] = useState<WishListModel[]|null>([])
    const [noticeWishList,setNoticeWishList] = useState("")
    const [errorSubmit,setErrorSubmit] = useState(false)
    const [wishListId,setWishListId] = useState(0);
    const [isUpdate,setIsUpdate] = useState(false)

    useScrollToTop()

    useEffect(()=>{
        const userId = getUserIdByToken();

        if(userId){
            getWishListByUserId(userId).then(
                data=>{
                    if(data){
                        if(data?.length>0){
                            setWishListId(data[0].wishListId)
                        }
    
                        if(data?.length===0){
                            setNoticeWishList("Danh sách yêu thích hiển đang trống!")
                        }
                    }
               
                setWishList(data);

                }
            ).catch(error=>{
                setNoticeWishList("Lỗi, không thể tải danh sách yêu thích!");
                console.log({error})
            })
        }

    },[showModal,isUpdate])

// lưu wish list
const handleSubmit=async()=>{
        setIsUpdate(false)
        const url:string=  `http://localhost:8080/wishList/addBookToWishList`;
        try{
            const response = await fetchWithAuth(url,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                },
                body:JSON.stringify({
                    wishListId:wishListId,
                    bookId:bookId
                })
            })

            const data = await response.json();
            if(response.ok){
                setNoticeSubmit(data.content);
                setErrorSubmit(false);
                setIsUpdate(true)
            }else{
                setNoticeSubmit(data.content || "Không thể thêm vào danh sách yêu thích!")
                setErrorSubmit(true);
            }
        }catch(error){
            console.log({error});
            setNoticeSubmit("Lỗi, không thể thêm vào danh sách yêu thích!");
            setErrorSubmit(true);
        }
}   


const handleChangeWishList=(e:ChangeEvent<HTMLSelectElement>)=>{
    const selection = e.target.value;
    const selectionNumber =parseInt(selection+'');
    setWishListId(selectionNumber);
    setNoticeSubmit("")
}

    return(
        <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
     >
    <Modal.Header closeButton>
        <Modal.Title>Chọn danh sách yêu thích muốn thêm</Modal.Title>
    </Modal.Header>
    <Modal.Body>

    {
    wishList && wishList?.length > 0 ? (
        <FormSelect aria-label="Chọn danh sách yêu thích"  onChange={handleChangeWishList}>
            {wishList.map(wishListItem => (
                <option key={wishListItem.wishListId} value={wishListItem.wishListId}>
                    {wishListItem.wishListName} ({wishListItem.quantity})
                </option>
            ))}
        </FormSelect>
    ) : (
        <p>{noticeWishList}</p>
    )
    }

    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Đóng
        </Button>
        <Button onClick={handleSubmit} variant="primary">Lưu</Button>
        
    </Modal.Footer>
    <p className="text-center" style={{color:errorSubmit?"red":"green"}}>{noticeSubmit}</p>
</Modal>
    )
}

export default AddBookToWishList;