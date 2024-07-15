import { FormEvent, useState } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";

interface CategoryFormProps{
    setIsUpdate:React.Dispatch<React.SetStateAction<boolean>>
}
const AddCategoryForm:React.FC<CategoryFormProps>=(props)=>{
    const [newCategoryName,setNewCategoryName] = useState("")
    const [isError,setIsError] = useState(false);
    const [noticeFormSubmit,setNoticeFormSubmit] = useState('');

    const handleFormSubmit=async(e:FormEvent)=>{ // form thêm category
        e.preventDefault();
        
        const url:string = `http://localhost:8080/category/addCategory`
        try{
            const response = await fetchWithAuth(url,{
                method:"POST",
                headers:{
                    "Content-Type":'application/json',
                    "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                },
                body:JSON.stringify({
                    categoryName:newCategoryName
                })
            })

            const data = await response.json();
            if(response.ok){
                setNoticeFormSubmit(data.content);
                setIsError(false);
                props.setIsUpdate(prevState=>!prevState);
            }else{
                setNoticeFormSubmit(data.content || "Lỗi không thể tạo thể loại mới");
                setIsError(true);
            }
        }catch(error){
            console.log({error});
            setNoticeFormSubmit("Lỗi, không thể tạo thể loại mới")
            setIsError(true);
        }
    }

    return(
        <div className="row justify-content-center mb-3">
        <div className="col-6">
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="categoryName">Tên thể loại</label>
                    <input 
                        type="text"
                        className="form-control"
                        id="categoryName"
                        value={newCategoryName}
                        onChange={e=>setNewCategoryName(e.target.value)}
                        required>
                    </input>
                </div>
                <div className="mt-3 text-center">
                    <button type="submit" className="btn btn-primary">Lưu</button>
                </div>
            </form>
        </div>
        <div className="text-center" style={{color:isError?"red":"green"}}>{noticeFormSubmit}</div>
    </div> 
    )
}

export default AddCategoryForm;