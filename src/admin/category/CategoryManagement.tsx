import { useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import RequireAdmin from "../RequireAdmin"
import CategoryModel from "../../models/CategoryModel";
import { getAllCategory } from "../../api/CategoryAPI";
import { Link } from "react-router-dom";
import AddCategoryForm from "./AddCategoryForm";
import { confirm } from "material-ui-confirm";
import { toast } from "react-toastify";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { Box, CircularProgress } from "@mui/material";

const CategoryManagement:React.FC=()=>{
    useScrollToTop(); // Cuộn lên đầu trang

    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("")
    const [category,setCategory] = useState<CategoryModel[]>([])
    const [showForm,setShowForm]= useState(false);
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
        confirm({
            title:"Xóa thể loại",
            description:"Bạn có chắc muốn xóa thể loại này chứ?",
            confirmationText:["Xóa"],
            cancellationText:["Hủy"],
        }).then(()=>{
            toast.promise(
                 fetchWithAuth(`http://localhost:8080/category/deleteCategory/${categoryId}`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    }
                }
                ).then((response)=>{
                    if(response.ok){
                        toast.success("Xóa thể loại thành công")
                        setIsUpdate(prev=>!prev); // Biến này để cập nhật lại giao diện khi xóa
                    }else{
                        toast.error("Lỗi khi xóa thể loại")
                    }
                }).catch(error=>{
                    toast.error("Lỗi khi xóa thể loại")
                    console.error(error)
                }),
                {pending:"Đang trong quá trình xử lý..."}
            )
        })
        .catch(()=>{})
    }

    const toggleForm=()=>{  // thực hiện mở form
        setShowForm(!showForm)
    }

    return(
        <div className="container mt-4">
        <h1 className="text-center mb-4">Danh sách thể loại</h1>
        
        {isLoading && (
              <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress color="inherit" />
          </Box>
        )}

        <div className="row mb-3">
            <div className="col">
            <button 
                className="btn btn-primary" 
                onClick={toggleForm}
            >
                <i className="fa fa-plus me-2"></i>Thêm thể loại mới
            </button>
            </div>
        </div>

        {showForm && (
            <div className="row mb-4">
            <div className="col">
                <AddCategoryForm setIsUpdate={setIsUpdate} />
            </div>
            </div>
        )}

        <div className="table-responsive">
            <table className="table table-striped table-hover">
            <thead className="table-light">
                <tr>
                <th scope="col">#</th>
                <th scope="col">Tên thể loại</th>
                <th scope="col">Số lượng sách</th>
                <th scope="col">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {category?.map((item, index) => (
                <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.categoryName}</td>
                    <td>{item.bookQuantity}</td>
                    <td>
                    <div className="btn-group" role="group">
                        <Link 
                        to={`/category/editCategory/${item.categoryId}`} 
                        className="btn btn-sm btn-outline-primary"
                        >
                        <i className="fa fa-edit me-1"></i>Sửa
                        </Link>
                        <button  
                        className="btn btn-sm btn-outline-danger"  
                        onClick={() => handleDelete(item.categoryId)}
                        >
                        <i className="fas fa-trash me-1"></i>Xóa
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {notice && (
            <div className="alert alert-info mt-3" role="alert">
            {notice}
            </div>
        )}
        </div>
    )
}

const CategoryManagementPage = RequireAdmin(CategoryManagement);
export default CategoryManagementPage;