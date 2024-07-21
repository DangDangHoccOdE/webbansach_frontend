import { useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import VoucherModel from "../../models/VoucherModel";
import { showAllVouchers_Admin } from "../../api/Voucher";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import useScrollToTop from "../../hooks/ScrollToTop";

const ShowAllVoucher : React.FC=()=>{
    const [allVouchers,setAllVouchers] = useState<VoucherModel[]>([])
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("")
    const navigate = useNavigate();
    useScrollToTop();

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

    const handleAddVoucher =()=>{ // Thêm voucher
        navigate("/voucher/addVoucher");
    }

    const handleDelete=(voucherId:number)=>{ // Xóa voucher
        const confirmAdmin = window.confirm("Bạn có muốn xóa voucher?");
        if(!confirmAdmin){
            return;
        }else{
            navigate(`/voucher/deleteVoucher/${voucherId}`);
        }
    }

    return(
        <div className="container">
        <h1 className="mt-4 mb-4">Quản lý Voucher</h1>
        {isLoading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
        
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-primary" onClick={handleAddVoucher}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Thêm Voucher
          </button>
        </div>
      
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
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
                      <span className="badge bg-info me-2">Số lượng: {voucher.quantity}</span>
                      <span className={`badge ${voucher.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {voucher.isActive ? 'Kích hoạt' : 'Vô hiệu'}
                      </span>
                    </div>
                    <div>
                      <Link to={`/voucher/editVoucher/${voucher.voucherId}`} className="btn btn-sm btn-outline-primary me-2">
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(voucher.voucherId)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
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

const ShowAllVoucher_Admin = RequireAdmin(ShowAllVoucher);
export default ShowAllVoucher_Admin;