import { useState } from "react";
import { Modal } from "react-bootstrap";
import WishListModel from "../../models/WishListModel";

interface BookSubmitFormProps {
    bookId:number,
    handleSubmit:(wishListId:number)=>void;
}

const AddBookToWishList=()=>{
//     const [showModal,setShowModal] = useState(false);
//     const [wishList,setWishList] = useState<WishListModel[]|null>([])
//     const [noticeWishList,setNoticeWishList] = useState("")
//     const [noticeSubmit,setNoticeSubmit] = useState("")
//     const [errorSubmit,setErrorSubmit] = useState(false)
//     const [wishListId,setWishListId] = useState(0);
//     setShowModal(true);

// const handleClose=()=>{
//     setNoticeSubmit("")
//     setShowModal(false);
// }

// // lưu wish list
// const handleSubmit=async()=>{
//         const url:string=  `http://localhost:8080/wishList/addBookToWishList`;
//         try{
//             const response = await fetchWithAuth(url,{
//                 method:"POST",
//                 headers:{
//                     "Content-Type":"application/json",
//                     "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
//                 },
//                 body:JSON.stringify({
//                     wishListId:wishListId,
//                     bookId:bookId
//                 })
//             })

//             const data = await response.json();
//             if(response.ok){
//                 setNoticeSubmit(data.content);
//                 setErrorSubmit(false);
//             }else{
//                 setNoticeSubmit(data.content || "Không thể thêm vào danh sách yêu thích!")
//                 setErrorSubmit(true);
//             }
//         }catch(error){
//             console.log({error});
//             setNoticeSubmit("Lỗi, không thể thêm vào danh sách yêu thích!");
//             setErrorSubmit(true);
//         }
// }   
//     return(
//         <Modal
//         show={showModal}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//      >
//     <Modal.Header closeButton>
//         <Modal.Title>Chọn danh sách yêu thích muốn thêm</Modal.Title>
//     </Modal.Header>
//     <Modal.Body>

//     {
//     wishList && wishList?.length > 0 ? (
//         <FormSelect aria-label="Chọn danh sách yêu thích"  onChange={handleChangeWishList}>
//             {wishList.map(wishListItem => (
//                 <option key={wishListItem.wishListId} value={wishListItem.wishListId}>
//                     {wishListItem.wishListName} ({wishListItem.quantity})
//                 </option>
//             ))}
//         </FormSelect>
//     ) : (
//         <p>{noticeWishList}</p>
//     )
//     }

//     </Modal.Body>
//     <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>
//             Đóng
//         </Button>
//         <Button onClick={handleSubmit} variant="primary">Lưu</Button>
        
//     </Modal.Footer>
//     <p className="text-center" style={{color:errorSubmit?"red":"green"}}>{noticeSubmit}</p>
// </Modal>
//     )
}

export default AddBookToWishList;