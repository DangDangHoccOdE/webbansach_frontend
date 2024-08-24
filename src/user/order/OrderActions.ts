import { confirm } from "material-ui-confirm";
import { toast } from "react-toastify";
import fetchWithAuth from "../../layouts/utils/AuthService";
import OrderModel from "../../models/OrderModel";
import { format } from "date-fns";

export const cancelOrder=async(orderId:number,reason:string)=>{   // Hủy đơn hàng
    try {
        await confirm({
          title: 'Đơn hàng',
          description: `Bạn có chắc muốn hủy đơn hàng không?`,
          confirmationText: ['Đồng ý'],
          cancellationText: ['Hủy'],
        });
    
        await toast.promise(
          fetchWithAuth(`http://localhost:8080/order/cancelOrder/${orderId}`, {
            method:"PUT",
            headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
            },
            body:JSON.stringify({
              reason:reason,
              time: format(new Date(), 'yyyy/MM/dd HH:mm:ss')
            })
          }),
          {
            pending: "Đang trong quá trình xử lý...",
            success: "Đã hủy đơn hàng thành công",
            error: "Không thể hủy đơn hàng!"
          }
        );
    
        return true; // Trả về true nếu xóa thành công
      } catch (error) {
        error && console.error(error);
        return false; // Trả về false nếu có lỗi hoặc người dùng hủy
      }
}

export const confirmReceivedOrder=async(orderId:number)=>{  // Xác nhận đã nhận đơn hàng
    try {
        await confirm({
          title: 'Đơn hàng',
          description: `Bạn có chắc muốn hủy đơn hàng không?`,
          confirmationText: ['Đồng ý'],
          cancellationText: ['Hủy'],
        });
    
        await toast.promise(
          fetchWithAuth(`http://localhost:8080/order/confirmReceivedOrder/${orderId}`, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
            }
          }),
          {
            pending: "Đang trong quá trình xử lý...",
            success: "Xác nhận đơn hàng thành công",
            error:  "Lỗi, không thể xác nhận đơn hàng"
          }
        );
    
        return true; // Trả về true nếu xóa thành công
      } catch (error) {
        error && console.error(error);
        return false; // Trả về false nếu có lỗi hoặc người dùng hủy
      }
}

export const handleCreateOrder = async (order:OrderModel,isBuyNow:boolean):Promise<boolean> => {  // Tạo đơn hàng
    const url: string = `http://localhost:8080/order/addOrder?isBuyNow=${isBuyNow}`;
    try {
      const response = await fetchWithAuth(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log({ error });
      return false;
    } 
  };

  export const repurchase=async(orderId:number)=>{   // Mua lại đơn hàng
    const url:string=`http://localhost:8080/order/repurchase/${orderId}`
    try{
      const response = await fetchWithAuth(url,{
        method:"PUT",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
          }
      })

      const data = await response.json();
      if(response.ok){
          toast.success("Đã tạo lại đơn hàng thành công")
          return data;
        }else{
        toast.error("Lỗi, không thể mua lại đơn hàng")
      }
    }catch(error){
        console.error({error})
    }
}
