import { confirm } from "material-ui-confirm"
import fetchWithAuth from "../../layouts/utils/AuthService"
import { toast } from "react-toastify"

export const updateQuantityOfCarts=async(cartItemId:number,quantity:number)=>{
    try{
        const url:string=`http://localhost:8080/cart-items/updateQuantityOfCartItem/${cartItemId}` 
         await fetchWithAuth(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
            },
            body:JSON.stringify({
                quantity:quantity
            }
            )
        })
  
    }catch(error){
        console.log({error})
    }
}

export const deleteCartItem = async (cartItemId:number) => {
    try {
      await confirm({
        title: 'Cart',
        description: `Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?`,
        confirmationText: ['Đồng ý'],
        cancellationText: ['Hủy'],
      });
  
      await toast.promise(
        fetchWithAuth(`http://localhost:8080/cart-items/deleteCartItem/${cartItemId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        }),
        {
          pending: "Đang trong quá trình xử lý...",
          success: "Đã xóa sản phẩm khỏi giỏ hàng thành công",
          error: "Không thể xóa sản phẩm khỏi giỏ hàng!"
        }
      );
  
      return true; // Trả về true nếu xóa thành công
    } catch (error) {
      error && console.error(error);
      return false; // Trả về false nếu có lỗi hoặc người dùng hủy
    }
  };
  
  export const deleteAllCartItemsIsChoose = async (allCartItemIsChoose:number[]) => {
    try {
      await confirm({
        title: 'Cart',
        description: `Bạn có chắc chắn muốn xóa những những sách đã chọn khỏi giỏ hàng?`,
        confirmationText: ['Đồng ý'],
        cancellationText: ['Hủy'],
      });
  
      await toast.promise(
        fetchWithAuth(`http://localhost:8080/cart-items/deleteAllCartItemsIsChoose`, {
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
            },
            body:JSON.stringify(
                allCartItemIsChoose
            )
        }),
        {
          pending: "Đang trong quá trình xử lý...",
          success: "Đã xóa sản phẩm khỏi giỏ hàng thành công",
          error: "Không thể xóa sản phẩm khỏi giỏ hàng!"
        }
      );
  
      return true; // Trả về true nếu xóa thành công
    } catch (error) {
      error && console.error(error);
      return false; // Trả về false nếu có lỗi hoặc người dùng hủy
    }
  };