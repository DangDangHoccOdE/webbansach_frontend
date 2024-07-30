import fetchWithAuth from "../../layouts/utils/AuthService"


const updateQuantityOfCarts=async(cartItemId:number,quantity:number)=>{
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

export default updateQuantityOfCarts;