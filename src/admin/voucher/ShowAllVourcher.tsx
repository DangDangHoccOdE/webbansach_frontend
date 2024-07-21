import { useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import VoucherModel from "../../models/VoucherModel";
import { showAllVouchers_Admin } from "../../api/Voucher";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const ShowAllVoucher : React.FC=()=>{
    const [allVouchers,setAllVouchers] = useState<VoucherModel[]>([])
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("")
    const navigate = useNavigate();

    useEffect(()=>{
        const showAllVouchers = async()=>{
            try{
                setIsLoading(true);
                const vouchers =await showAllVouchers_Admin();
                if(vouchers.length===0){
                    setNotice("Hiện chưa có voucher nào!");
                }
                setAllVouchers(vouchers);
            }catch(error){
                console.log({error})
            }finally{
                setIsLoading(false)
            }

        }

        showAllVouchers();
    },[])

    const handleAddVoucher =()=>{
        navigate("/voucher/addVoucher");
    }

    return(
        <div className="container">
            <h1 className="mt-3">Voucher</h1>
            {isLoading && <p className="text-center">Đang tải...</p>}
            <button className="btn btn-secondary fa fa-plus ms-auto" onClick={handleAddVoucher}></button>  
            <table className="table table-responsive table-striped table-hover">
              <thead className="thead-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Mã</th>
                        <th scope="col">Voucher</th>
                        <th scope="col">Phầm trăm giảm</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Trạng thái kích hoạt</th>
                        <th scope="col">Tiện ích</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        allVouchers?.map((voucher,index)=>(
                            <tr  key={index}>
                            <th scope="row">{index}</th>
                                <td>{voucher.code}</td>
                                <td>
                                    {
                                    <div className="col d-flex align-items-center">
                                        <div className="col-3">
                                                <img src={voucher.voucherImage} alt="Ảnh voucher" style={{width:"100px"}}></img>
                                            </div>
                                            <div className="col-9">
                                            <div dangerouslySetInnerHTML={{__html:voucher.describe}}/>
                                            <p><FontAwesomeIcon icon={faClock} />Hiệu lực đến {voucher.expiredDate}</p>
                                            </div>
                                    </div>
                                    }
                                </td>
                                <td>{voucher.discountValue}%</td>
                                <td>{voucher.quantity}</td>
                                <td>{voucher.isActive ?"1":"0"}</td>
                                <td style={{whiteSpace:"nowrap"}}>
                                    <div className="admin-button mt-2 text-end">
                                        <Link to={`/user/info}`} className="btn btn-primary me-2">
                                        <i className="fa fa-edit"></i></Link>
                                            
                                        {/* <button  className="btn btn-danger"  onClick={()=>handleDelete(user.userName)}> */}
                                        {/* <i className="fas fa-trash"></i></button> */}
                                        </div>
                                </td>
                            </tr>
                        ))
                    }
                   
                </tbody>
                </table>
                <p>{notice}</p>
        </div>
    )
}

const ShowAllVoucher_Admin = RequireAdmin(ShowAllVoucher);
export default ShowAllVoucher_Admin;