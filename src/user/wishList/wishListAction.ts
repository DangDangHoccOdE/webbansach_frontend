import { toast } from "react-toastify";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { confirm } from "material-ui-confirm";

export const deleteWishList = async (wishListId: number) => {
    try {
      await confirm({
        title: 'Danh sách yêu thích',
        description: `Xóa danh sách yêu thích đã chọn?`,
        confirmationText: ['Đồng ý'],
        cancellationText: ['Hủy'],
      });
  
      await toast.promise(
        fetchWithAuth(`http://localhost:8080/wishList/deleteWishList/${wishListId}`, {
            method:"DELETE",
                headers:{
                    "Content-type":"application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                }
        }),
        {
          pending: "Đang trong quá trình xử lý...",
          success: "Đã xóa thành công",
          error: "Không thể xóa danh sách yêu thích!"
        }
      );
      return true; // Trả về true nếu xóa thành công
    } catch (error) {
      error && console.error(error);
      return false; // Trả về false nếu có lỗi hoặc người dùng hủy
    }
  };
  
  export const deleteBookOfWishList = async (wishListId: number,bookId:number) => {
    try {
      await confirm({
        title: 'Danh sách yêu thích',
        description: `Xóa sách khỏi danh sách yêu thích đã chọn?`,
        confirmationText: ['Đồng ý'],
        cancellationText: ['Hủy'],
      });
  
      await toast.promise(
        fetchWithAuth(`http://localhost:8080/wishList/deleteBookOfWishList`, {
            method:"DELETE",
            headers:{
                "Content-type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
            },
            body:JSON.stringify({
                wishListId:wishListId,
                bookId:bookId
            })
        }),
        {
          pending: "Đang trong quá trình xử lý...",
          success: "Đã xóa thành công",
          error: "Không thể xóa sách khỏi danh sách yêu thích!"
        }
      );
      return true; // Trả về true nếu xóa thành công
    } catch (error) {
      error && console.error(error);
      return false; // Trả về false nếu có lỗi hoặc người dùng hủy
    }
  };