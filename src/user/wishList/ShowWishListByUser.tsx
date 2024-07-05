import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";
import { useEffect, useState } from "react";
import WishListModel from "../../models/WishListModel";
import { getWishListByUser } from "../../api/WishListAPI";

const ShowWishListByUser=()=>{
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const {userId} = useParams();
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("");
    const [wishList,setWishList] = useState<WishListModel[]|null>([]);
    const [showForm,setShowForm] = useState(false);
    const [newWishListName,setNewWishListName] = useState("");

    let userIdNumber = parseInt(userId+"");
    if(!isLoggedIn){
        navigate("/",{replace:true});
    }

    useEffect(()=>{
        const getWishList= async()=>{
            setIsLoading(true);
            try{
                const result = await getWishListByUser(userIdNumber);
                setWishList(result);
                if(result.length===0){
                    setNotice("Danh sách yêu thích hiện đang trống!");
                }else{
                    console.log("Lấy danh sách yêu thích thành công!");
                }
            }catch(error){
                setNotice("Không thể tải được danh sách yêu thích!");
                console.log({error});
            }finally{
                setIsLoading(false);
            }
        }
       
        getWishList();
    },[userIdNumber]);

    const handleDelete=(wishListId:number)=>{
        const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa!");
        if(!userConfirmed){
            return;
        }else{
            navigate(`/wishList/deleteWishList/${wishListId}/${userIdNumber}`)
        }
    }

    const toggleForm=()=>{
        setShowForm(!showForm);
    }

    const handleFormSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        
        setShowForm(false);
        setNewWishListName("");
    }
    return(
        <div className="container">
            <h1 className="mt-5 text-center">Danh sách yêu thích</h1>
                 {isLoading ?( <div style={{ textAlign: "center" }}>Đang tải...</div>
            
        ):( <>
            <div className="col">
            <div className="col-8 text-end">
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
                    </div>
                )
            }
                <div className="d-flex justify-content-center">
                <table className="table-responsive">
                <table className="table table-striped table-hover">
                <thead className="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên danh sách</th>
                            <th scope="col">Tiện ích</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            wishList?.map((wishList,index)=>(
                                <tr  key={index}>
                                <th scope="row">{index}</th>
                                    <td>{wishList.wishListName}</td>
                                    <td style={{whiteSpace:"nowrap"}}>
                                        <div className="admin-button mt-2 text-end">
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
