import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import VoucherModel from "../../models/VoucherModel";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { showAllVouchers_User } from "../../api/Voucher";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { useAuth } from "../../layouts/utils/AuthContext";
import { useNavigate } from "react-router-dom";

const ShowVoucherUser =()=>{
    const [isLoading,setIsLoading] = useState(false);
    const [allVouchers,setAllVouchers] = useState<VoucherModel[]>([])
    const [notice,setNotice] = useState("");
    const userId = getUserIdByToken();
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!isLoggedIn || userId===undefined){
            navigate("/login",{replace:true})   
            return;         
        }
        const getVouchers = async()=>{
            setIsLoading(true);
            try{
                const fetchVouchers = await showAllVouchers_User(userId)
                if(fetchVouchers.length===0){
                    setNotice("Bạn hiện chưa có voucher nào.");
                }
                if(fetchVouchers){
                    const updateVouchers= fetchVouchers.map(voucher=>{
                        const nowDate = new Date();
                        nowDate.setDate(nowDate.getDate()-1);
                        const expiredDate = new Date(voucher.expiredDate);
                        if(expiredDate<nowDate){
                           return {...voucher,isActive:false}                    
                        }
                        return voucher;
                    })
                    setAllVouchers(updateVouchers)
                }
            }catch(error){
                console.log({error});
            }finally{
                setIsLoading(false);
            }

        }
        getVouchers();
    },[isLoggedIn, navigate, userId])

    useEffect(()=>{
       
    },[])


    return(
            <div className="container">
            <h1 className="mt-4 mb-4">Kho Voucher</h1>
            {isLoading && <div className="text-center"><div className="spinner-border" role="status"></div></div>} 
            <div className="d-flex justify-content-center">
                <label htmlFor="findVoucher"className="form-label me-2">Mã Voucher</label>
                <input type="text" id="findVoucher" className="form-control-sm me-2" placeholder="Nhập mã voucher của bạn vào đây"></input>
                <button type="submit" className="btn btn-secondary">Lưu</button>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-2">
            {allVouchers?.map((voucher, index) => (
                <div key={index} className="col">
                <div className="card h-100 border-primary">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Mã: {voucher.code}</h5>
                    <span className="badge bg-light text-primary">#{index + 1}</span>
                    </div>
                    <div className="card-body">
                    <div className="row g-0">
                        <div className="col-4 d-flex align-items-center p-2">
                        <img 
                            src={voucher.voucherImage} 
                            alt="Ảnh voucher" 
                            className="img-fluid rounded"
                            style={{ maxHeight: '100px', objectFit: 'cover' }}
                        />
                        </div>
                        <div className="col-8">
                        <h5 className="card-title text-primary mb-2">Giảm {voucher.discountValue}%</h5>
                        <p className="card-text mb-1">
                            <small>Giảm tối đa </small>
                            <span className="fw-bold">150.000đ</span>
                        </p>
                        <p className="card-text mb-1">
                            <small>Đơn tối thiểu </small>
                            <span className="fw-bold">1.000.000đ</span>
                        </p>
                        <p className="card-text text-muted">
                            <small>
                            <FontAwesomeIcon icon={faClock} className="me-1" />
                            Hiệu lực đến: {new Date(voucher.expiredDate).toLocaleDateString()}
                            </small>
                        </p>
                        </div>
                    </div>
                    </div>
                    <div className="card-footer bg-transparent">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                        <span className={`badge ${voucher.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {voucher.isActive ? 'Kích hoạt' : 'Vô hiệu'}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
            
            {notice && <div className="alert alert-info mt-3">{notice}</div>}
        </div>
)      
}

export default ShowVoucherUser;