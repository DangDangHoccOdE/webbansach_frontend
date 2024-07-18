import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../layouts/utils/AuthContext";
import { getAllCartItemByUser } from "../../api/CartItemAPI";
import { getUserIdByToken } from "../../layouts/utils/JwtService";

interface CartContextType{
    itemCounter:number,
    updateCartItemCount:()=>Promise<void>;
}

export const CartContext=React.createContext<CartContextType>({
    itemCounter:0,
    updateCartItemCount:async()=>{}
})

export const CartProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [itemCounter,setItemCounter] = useState(0);
    const {isLoggedIn} = useAuth();

    const updateCartItemCount=useCallback(async()=>{
        if(isLoggedIn){
            try{
                const userId = getUserIdByToken();
                if(userId){
                    const cartItems = await getAllCartItemByUser(userId)
                    if(cartItems){
                        setItemCounter(cartItems.length);
                    }
                }
            }catch(error){
                console.error("Lỗi tải giỏ hàng:" ,error);
                setItemCounter(0);
            }
        }else{
            setItemCounter(0);
        }
    },[isLoggedIn]);

    useEffect(()=>{
        updateCartItemCount();
    },[updateCartItemCount])

    return(
        <CartContext.Provider value={{itemCounter,updateCartItemCount }}>
            {children}
        </CartContext.Provider>
    )
}

