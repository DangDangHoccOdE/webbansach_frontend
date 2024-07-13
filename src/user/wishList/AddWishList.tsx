import { useState } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";

interface WishListFormProps{
    setIsUpdate:React.Dispatch<React.SetStateAction<boolean>>,
    userId:number
}

const AddWishList:React.FC<WishListFormProps>=(props)=>{
    const [errorNewWishList,setErrorNewWishList] = useState('')
    const [isError,setIsError] = useState(false);
    const [newWishListName,setNewWishListName] = useState('')

    const handleFormSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();

        const url:string = `http://localhost:8080/wishList/addWishList`;

        try{
            const response =await fetchWithAuth(url,{
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body:JSON.stringify({
                    userId:props.userId,
                    newWishListName:newWishListName
                })
            });
     
            const data = await response.json();
            if(response.ok){
                console.log(data.content)
                setErrorNewWishList(data.content);
                setIsError(false);
                props.setIsUpdate(prevState=>!prevState);
            }else{
                console.log(data.content)
                setErrorNewWishList(data.content || "Lỗi không thể tạo thể danh sách yêu thích mới");
                setIsError(true);
            }
        }catch(error){
            console.log({error});
            setErrorNewWishList("Lỗi, không thể tạo thể danh sách yêu thích mới")
            setIsError(true);
        }

    }

    return(
        <div className="row justify-content-center mb-3">
        <div className="col-md-6">
        <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="wishListName">Tên danh sách yêu thích</label>
                            <input
                                type="text"
                                className="form-control"
                                id="wishListName"
                                value={newWishListName}
                                onChange={(e) => setNewWishListName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-3 text-center">
                            <button type="submit" className="btn btn-primary">Lưu</button>
                        </div>
                    </form>
        </div>
        <div className="text-center" style={{color:isError?"red":"green"}}>{errorNewWishList}</div>
    </div>
    )
}

export default AddWishList;