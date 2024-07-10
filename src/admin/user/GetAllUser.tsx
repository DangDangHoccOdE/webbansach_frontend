import { useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import { getAllUserByAdmin } from "../../api/UserAPI";
import UserModel from "../../models/UserModel";
import { Link, useNavigate } from "react-router-dom";
import { getRoleByUser } from "../../api/RoleApi";
import useScrollToTop from "../../hooks/ScrollToTop";

const GetAllUser:React.FC=()=>{
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("");
    const [allUser,setAllUser] = useState<UserModel[]|null>([]);
    const [roles,setRoles] = useState<{ [key:number]: string[]}>({});
    const navigate = useNavigate();
    useScrollToTop();
    useEffect(()=>{
        const fetchData = async()=>{
            setIsLoading(true);
            try{
                const result = await getAllUserByAdmin();
                setAllUser(result);
                if(result!==null){
                    if(result.length===0){
                    setNotice("Danh sách user trống!");
                      }else{
                    const rolesMap:{[key:number]:string[]}={};
                    for(const user of result){
                        const userRoles = await getRoleByUser(user.userId);
                        rolesMap[user.userId] = userRoles;
                    }
                    setRoles(rolesMap)
                    console.log("Lấy thông tin user thành công!");
                }
            }
            }catch(error){
                console.log("Lỗi lấy thông tin user! ",error);
                setNotice("Lỗi khi lấy thông tin user !");
            }finally{
                setIsLoading(false);
            }
        };
        fetchData();
    },[])

    const handleDelete=(username:string)=>{
        const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa!");
        if(!userConfirmed){
            return;
        }else{
            navigate(`/user/deleteUser/${username}`)
        }
    }

    return(
        <div className="container">
            <h1 className="mt-5 text-center">Thông tin người dùng</h1>
                 {isLoading ?( <div style={{ textAlign: "center" }}>Đang tải...</div>
            
        ):( <>
            {allUser===null && <span style={{textAlign:"center", color:"red"}}>{notice}</span>}
            <table className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Họ đệm</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Ngày sinh</th>
                        <th scope="col">Giới tính</th>
                        <th scope="col">Tài khoản</th>
                        <th scope="col">Email</th>
                        <th scope="col">Số điện thoại</th>
                        <th scope="col">Địa chỉ giao hàng</th>
                        <th scope="col">Địa chỉ nhận hàng</th>
                        <th scope="col">Avatar</th>
                        <th scope="col">Vai trò</th>
                        <th scope="col">Trạng thái kích hoạt</th>
                        <th scope="col">Tiện ích</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        allUser?.map((user,index)=>(
                            <tr  key={index}>
                            <th scope="row">{index}</th>
                                <td>{user.lastName}</td>
                                <td>{user.firstName}</td>
                                <td>{user.dateOfBirth}</td>
                                <td>{user.sex}</td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.deliveryAddress}</td>
                                <td>{user.purchaseAddress}</td>
                                <td>{user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: "100px" }}/> : "Chưa chọn ảnh đại diện"}</td>
                                <td>{
                                    Array.isArray(roles[user.userId])?roles[user.userId].join(", "):"Không có vai trò"
                                }</td>
                                <td>{user.active ?"1":"0"}</td>
                                <td style={{whiteSpace:"nowrap"}}>
                                    <div className="admin-button mt-2 text-end">
                                        <Link to={`/user/info/${user.userName}`} className="btn btn-primary me-2">
                                        <i className="fa fa-edit"></i></Link>
                                            
                                        <button  className="btn btn-danger"  onClick={()=>handleDelete(user.userName)}>
                                        <i className="fas fa-trash"></i></button>
                                        </div>
                                </td>
                            </tr>
                        ))
                    }
                   
                </tbody>
                </table>
                </table>
            </>
        )}
        </div>
    )
}

const GetAllUser_Admin = RequireAdmin(GetAllUser);
export default GetAllUser_Admin;