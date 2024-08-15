import fetchWithAuth from "../../layouts/utils/AuthService";
import OrderModel from "../../models/OrderModel";

const handleCreateOrder = async (order:OrderModel,isBuyNow:boolean):Promise<boolean> => {
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

  export default handleCreateOrder;