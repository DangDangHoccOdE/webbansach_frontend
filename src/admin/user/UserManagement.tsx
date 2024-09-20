import { ChangeEvent, useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import { getAllUserByAdmin, getUserByCondition } from "../../api/UserAPI";
import UserModel from "../../models/UserModel";
import { Link } from "react-router-dom";
import { getRoleByUser } from "../../api/RoleApi";
import useScrollToTop from "../../hooks/ScrollToTop";
import { CircularProgress } from "@mui/material";
import { confirm } from "material-ui-confirm";
import { toast } from "react-toastify";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { Pagination } from "../../layouts/utils/Pagination";

const UserManagement:React.FC=()=>{
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("");
    const [allUser,setAllUser] = useState<UserModel[]>([]);
    const [roles,setRoles] = useState<{ [key:number]: string[]}>({});
    const [isUpdate,setIsUpdate] = useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    const [temporaryWordFind,setTemporaryWordFind] = useState("");
    const [wordFind,setWordFind] = useState("");


    useScrollToTop();
    useEffect(()=>{
        const fetchData = async()=>{
            setIsLoading(true);
            try{
                let users: UserModel[] = [];
                if(wordFind===''){
                    const result = await getAllUserByAdmin(currentPage-1);
                    users = result.resultUsers;
                    setTotalPages(result.totalPages);

                    if(result.resultUsers.length===0){
                        setNotice("Danh sách user trống!");
                    }

            }else{
                const result = await getUserByCondition(wordFind,true);  // True là tìm theo cả email
                if(!result){
                    setNotice("Không tồn tại user cần tìm");
                    setAllUser([])
                }else{
                    users = [result];
                }
            }

            setAllUser(users);
            await fetchUsersAndRoles(users);
     
            }catch(error){
                console.log("Lỗi lấy thông tin user! ",error);
                setNotice("Lỗi khi lấy thông tin user !");
            }finally{
                setIsLoading(false);
            }
        };
        fetchData();
    },[currentPage, isUpdate, wordFind])

    const fetchUsersAndRoles = async (users: UserModel[]) => { // lấy roles
        const rolesMap: { [key: number]: string[] } = {};
        for (const user of users) {
            const userRoles = await getRoleByUser(user.userId);
            rolesMap[user.userId] = userRoles;
        }
        setRoles(rolesMap);
    };
    

    const handleDelete=(username:string)=>{   // thực hiện xóa user
        confirm({
            title:'Xóa sách khỏi thể loại',
            description:`Bạn có chắc muốn xóa user này?`,
            confirmationText:['Xóa'],
            cancellationText:['Hủy'],
        }).then(()=>{
            toast.promise(
                fetchWithAuth(`http://localhost:8080/user/deleteUser/${username}`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    }
                }
            ).then((response)=>{
                if(response.ok){
                    toast.success("Đã xóa user thành công");
                    setIsUpdate(prev=>!prev); // Biến này để cập nhật lại giao diện khi xóa
                }else{
                    toast.error("Lỗi khi xóa user!");
                }
            }).catch(error=>{
                toast.error("Lỗi khi xóa user!");
                console.error(error);
            }),
            {pending:"Đang trong quá trình xử lý..."}
        )})
        .catch(()=>{});
    }

    const pagination = (pageCurrent:number)=>{ // phân trang
        setCurrentPage(pageCurrent);
    }

    const handleChangeWordFind=(e:ChangeEvent<HTMLInputElement>)=>{ // Theo dõi từng từ tìm kiếm
        setTemporaryWordFind(e.target.value);
    }

    const handleWordFind=()=>{
        setWordFind(temporaryWordFind);
    }   


    return(
        <div className="container-fluid mt-5">
        <h1 className="mb-4 text-center">Thông tin người dùng</h1>
        
        {isLoading ? (
            <div className="text-center mt-5">
            <CircularProgress color="inherit" />
            </div>
        ) : (
            <>
             <div className="d-flex justify-content-center mb-2">
                <label htmlFor="findUser"className="form-label me-2">Tìm kiếm</label>
                <input type="search" id="findUser" className="form-control me-2" onChange={handleChangeWordFind} value={temporaryWordFind} placeholder="Nhập email hoặc tài khoản người dùng"></input>
                <button type="submit" className="btn btn-secondary" onClick={handleWordFind}>Tìm</button>
            </div>
            {allUser.length===0  ? (
                <div className="alert alert-danger text-center" role="alert">
                {notice}
                </div>
            ) : (
            
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                <thead className="table-light">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tên người dùng</th>
                    <th scope="col">Tài khoản</th>
                    <th scope="col">Email</th>
                    <th scope="col">Số điện thoại</th>
                    <th scope="col">Avatar</th>
                    <th scope="col">Vai trò</th>
                    <th scope="col">Trạng thái kích hoạt</th>
                    <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {allUser?.map((user, index) => (
                    <tr key={index}>
                        <th scope="row">{(currentPage-1)*8 +index + 1}</th>
                        <td>{user.lastName} {user.firstName}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="img-thumbnail" style={{ width: "100px" }}/>
                        ) : (
                            "Chưa chọn ảnh đại diện"
                        )}
                        </td>
                        <td>
                        {Array.isArray(roles[user.userId])
                            ? roles[user.userId].join(", ")
                            : "Không có vai trò"}
                        </td>
                        <td>
                        <span className={`badge ${user.active ? "bg-success" : "bg-danger"}`}>
                            {user.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                        </span>
                        </td>
                        <td>
                        <div className="btn-group" role="group">
                            {
                                user.active &&
                                <>
                                <Link to={`/user/info/${user.userName}`} className="btn btn-sm btn-outline-primary">
                                <i className="fa fa-edit me-1"></i>Sửa
                                </Link>
                                <Link to={`/user/showWishList/${user.userId}`} className="btn btn-sm btn-outline-secondary">
                                <i className="fa-regular fa-heart me-1"></i>Xem danh sách yêu thích
                                </Link>
                                <Link to={`/user/showVoucherUser/${user.userId}`} className="btn btn-sm btn-outline-success">
                                <i className="fa-solid fa-ticket me-1"></i>Xem voucher
                                </Link> 
                                <Link to={`/user/showCart/${user.userId}`} className="btn btn-sm btn-outline-dark">
                                <i className="fa-solid fa-cart-shopping me-1"></i>Xem giỏ hàng
                                </Link>
                                </>
                            }
                           
                            {
                                !roles[user.userId]?.includes("ROLE_ADMIN") && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.userName)}>
                                    <i className="fas fa-trash me-1"></i>Xóa
                                    </button>
                                )
                            }
                          
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
                <div className="d-flex align-item-center justify-content-center">
                            <Pagination currentPage={currentPage} totalPages={totalPages} pagination={pagination}></Pagination>
                </div>
            </>
        )}
          
        </div>
    )
}

const UserManagementPage = RequireAdmin(UserManagement);
export default UserManagementPage;