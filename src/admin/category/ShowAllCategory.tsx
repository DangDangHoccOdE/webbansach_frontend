import { useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import RequireAdmin from "../RequireAdmin"
import CategoryModel from "../../models/CategoryModel";
import { getAllCategory } from "../../api/CategoryAPI";
import { Link, useNavigate } from "react-router-dom";
import AddCategoryForm from "./AddCategoryForm";

const ShowAllCategory:React.FC=()=>{
    useScrollToTop(); // Cuộn lên đầu trang

    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("")
    const [category,setCategory] = useState<CategoryModel[]>([])
    const [showForm,setShowForm]= useState(false);
    const navigate = useNavigate();
    const [isUpdate,setIsUpdate] = useState(false);

    useEffect(()=>{
        const fetchData =async()=>{
            setIsLoading(true);
            try{
                const data =  await getAllCategory();
                if(data.length===0){
                    setNotice("Danh sách thể loại đang trống!");
                }          
                setCategory(data);
            }catch(error){
                setNotice("Lỗi, không thể lấy được danh sách thể loại!");
                console.log({error});
            }finally{
                setIsLoading(false);
            }
        }        
        fetchData();
    },[isUpdate])

    const handleDelete=(categoryId:number)=>{  // Xóa category
        const userConfirm = window.confirm("Bạn có chắc chắn muốn xóa!");
        if(!userConfirm){
            return;
        }else{
            navigate(`/category/deleteCategory/${categoryId}`)
        }
    }

    const toggleForm=()=>{  // thực hiện mở form
        setShowForm(!showForm)
    }

    return(
        <div className="container">
            <h1 className="text-center">Danh sách thể loại</h1>
            {isLoading&&<p className="text-center">Đang tải...</p>}
            <div className="col-2">
                <button className="btn btn-secondary fa fa-plus ms-auto" onClick={toggleForm}></button>  
            </div>

            { // add category
                showForm&&(
                    <AddCategoryForm setIsUpdate={setIsUpdate}/>
                )
            }
            <div className="d-flex justify-content-center">
                <table className="table table-striped table-hover">
                <thead className="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên thể loại</th>
                            <th scope="col">Số lượng sách</th>
                            <th scope="col">Tiện ích</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            category?.map((item,index)=>(
                                <tr  key={index}>
                                <th scope="row">{index}</th>
                                    <td>{item.categoryName}</td>
                                    <td>{item.bookQuantity}</td>
                                    <td style={{whiteSpace:"nowrap"}}>
                                        <div className="admin-button mt-2">
                                            <Link to={`/category/editCategory/${item.categoryId}`} className="btn btn-primary me-2">
                                            <i className="fa fa-edit"></i></Link>
                                                
                                            <button  className="btn btn-danger"  onClick={()=>handleDelete(item.categoryId)}>
                                            <i className="fas fa-trash"></i></button>
                                            </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                    </table>
                    <p>{notice}</p>
                </div>
        </div>
    )
}

const ShowAllCategory_Admin = RequireAdmin(ShowAllCategory);
export default ShowAllCategory_Admin;