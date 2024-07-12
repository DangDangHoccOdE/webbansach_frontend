import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";
import { useEffect, useState } from "react";
import WishListModel from "../../models/WishListModel";
import useScrollToTop from "../../hooks/ScrollToTop";
import { getWishListByUserId } from "../../api/WishListAPI";
import fetchWithAuth from "../../layouts/utils/AuthService";

const ShowWishListByUser=()=>{
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const {userId} = useParams();
    const [isLoading,setIsLoading] = useState(false);
    const [isError,setIsError] = useState(false);
    const [notice,setNotice] = useState("");
    const [wishList,setWishList] = useState<WishListModel[]|null>([]);
    const [showForm,setShowForm] = useState(false);
    const [newWishListName,setNewWishListName] = useState("");    
    const [errorNewWishList,setErrorNewWishList] = useState("");
    const [isUpdate,setIsUpdate] = useState(false);;

    let userIdNumber = parseInt(userId+"");

    useScrollToTop(); // Cuộn lên đầu trang
    useEffect(()=>{
        if (!isLoggedIn) {  // Kiểm tra người dùng đã đăng nhập chưa
            alert("Bạn phải đăng nhập để tiếp tục")
            navigate("/")
            return;
        }


        const getIdWishList= async()=>{  // gọi api lấy ra id wishList
            setIsLoading(true);
            try{
                const data = await getWishListByUserId(userIdNumber);
                if (data === null) {
                    navigate("/error-404");
                }
                if (data?.length === 0) {
                    setNotice("Danh sách yêu thích hiện đang trống!");
                }
                setWishList(data);
            }catch(error){
                console.log("Không thể tải được danh sách yêu thích!");
                navigate("/error-404");
            }finally{
                setIsLoading(false);
            }
        }
       
         getIdWishList();
    },[userIdNumber, navigate, isUpdate, isLoggedIn]);

    const handleDelete=(wishListId:number)=>{   // thực hiện xóa wishList
        const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa!");
        if(!userConfirmed){
            return;
        }else{
            navigate(`/wishList/deleteWishList/${wishListId}/${userIdNumber}`)
        }
    }

    const toggleForm=()=>{   // Mở form thêm wishList
        setShowForm(!showForm);
    }

    const handleFormSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
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
                    userId:userId,
                    newWishListName:newWishListName
                })
            });
     
            const data = await response.json();
            if(response.ok){
                setErrorNewWishList(data.content);
                setIsError(false)
                setIsUpdate(prevState=>!prevState)
            }else{
                setErrorNewWishList(data.content || "Lỗi tạo danh sách yêu thích");
                setIsError(true);
            }
    
        }catch(error){
            setErrorNewWishList("Lỗi tạo danh sách yêu thích!")
            setIsError(true);
            console.log({error})
        }

        setNewWishListName("");
    }

    if(!isLoggedIn){
        return null;
    }

    return(
        <div className="container">
            <h1 className="mt-5 text-center">Danh sách yêu thích</h1>
                 {isLoading ?( <div style={{ textAlign: "center" }}>Đang tải...</div>
            
        ):( <>
            <div className="col">
            <div className="col-2">
                <button className="btn btn-secondary fa fa-plus ms-auto" onClick={toggleForm}></button>  
            </div>
            {
                showForm&&(
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
                <div className="d-flex justify-content-center">
                <table className="table table-striped table-hover">
                <thead className="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên danh sách</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Tiện ích</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            wishList?.map((wishList,index)=>(
                                <tr  key={index}>
                                <th scope="row">{index}</th>
                                    <td>{wishList.wishListName}</td>
                                    <td>{wishList.quantity}</td>
                                    <td style={{whiteSpace:"nowrap"}}>
                                        <div className="admin-button mt-2">
                                            <Link to={`/wishList/editWishList/${wishList.wishListId}`} className="btn btn-primary me-2">
                                            <i className="fa fa-edit"></i></Link>
                                                
                                            <button  className="btn btn-danger"  onClick={()=>handleDelete(wishList.wishListId)}>
                                            <i className="fas fa-trash"></i></button>
                                            </div>
                                    </td>
                                </tr>
                            ))
                        }
                    
                    </tbody>
                    </table>
                </div>
            </div>
           
                {notice && <div style={{textAlign:"center", color:"red"}}>{notice}</div>}

            </>
        )}
        </div>
    )
}

export default ShowWishListByUser;
