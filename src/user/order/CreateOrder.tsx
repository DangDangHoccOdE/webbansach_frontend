import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderModel from "../../models/OrderModel";
import { useAuth } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import handleCreateOrder from "./handleCreateOrder";
import { Box, CircularProgress } from "@mui/material";
import { CheckoutFail } from "../../layouts/page/CheckoutFail";
import { CheckoutSuccess } from "../../layouts/page/CheckoutSuccess";

const HandleCreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(true);
  const {updateCartItemCount} = useContext(CartContext);


  const { order,isBuyNow} = (location.state as { order: OrderModel,isBuyNow:boolean }) 
                                        ||  { order: null,isBuyNow:false };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/", { replace: true });
      return;
    }
    const create = async()=>{
      setIsLoading(true);
      const isSuccess = await handleCreateOrder(order,isBuyNow); // Tiến hành đặt hàng
      setIsLoading(false);
      if(isSuccess){
        updateCartItemCount();
        setIsError(false);
      }else{
        setIsError(true);
      }
    }

    create();

  }, [order, navigate, isLoggedIn, updateCartItemCount, isBuyNow]);

  if(isLoading){
    return(
        <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress color="inherit" />
    </Box>
    )
}
    return <>
         {
         isError ? <CheckoutFail/> : <CheckoutSuccess/>
       }
     </>
      }

export default HandleCreateOrder;