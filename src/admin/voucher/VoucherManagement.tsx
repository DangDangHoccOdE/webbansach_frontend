import { ChangeEvent, useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import VoucherModel from "../../models/VoucherModel";
import { showAllVouchers_Admin } from "../../api/VoucherAPI";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEdit, faGift, faPlus, faTicket, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import useScrollToTop from "../../hooks/ScrollToTop";
import { toast } from "react-toastify";
import { addVouchersToVoucherAvailable, deleteSelectedVouchers, deleteVoucher, giftVouchersToUsers } from "./voucherActions";
import { updateVoucher } from "../../layouts/voucher/UpdateIsActiveFromVoucher";

const VoucherManagement : React.FC=()=>{
    const [allVouchers,setAllVouchers] = useState<VoucherModel[]>([])
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("")
    const navigate = useNavigate();
    const [selectedVouchers,setSelectedVouchers] = useState<number[]>([]);
    const [selectAll,setSelectAll] = useState(false);

    const [voucherNameFind,setVoucherNameFind] = useState('')
    const [condition,setCondition] = useState('')
    const [countVoucher,setCountVoucher] = useState(0)
    const [isUpdate,setIsUpdate] = useState(false);

    useScrollToTop();

    useEffect(()=>{
        const showAllVouchers = async()=>{
            try{
                setIsLoading(true);
                const vouchers =await showAllVouchers_Admin(voucherNameFind,condition);
                if(vouchers.length===0){
                    setNotice("Hiện chưa có voucher nào!");
                    setAllVouchers([])
                }else{
                  if(vouchers.length>0){
                    setNotice("")
  
                  const updateStatusVoucher = await updateVoucher(vouchers);
                  setAllVouchers(updateStatusVoucher)
                }
              }
            }catch(error){
                console.log({error})
            }finally{
                setIsLoading(false)
            }

        }

        showAllVouchers();
    },[condition, voucherNameFind,isUpdate])

    const handleAddVoucher =()=>{ // Thêm voucher
        navigate("/voucher/addVoucher");
    }

    
    const handleSelectAll=()=>{ // Chọn tất cả voucher
        setSelectAll(!selectAll);
        if(!selectAll){
          setSelectedVouchers(allVouchers.map(voucher=>voucher.voucherId))
        }else{
          setSelectedVouchers([]);
        }
    }

    useEffect(() => {
      setCountVoucher(selectedVouchers.length);
    }, [selectedVouchers]);

    const handleSelectVoucher=(voucherId:number)=>{ //  những voucher đã chọn
        if(selectedVouchers.includes(voucherId)){
          setSelectedVouchers(selectedVouchers.filter(id=>id!==voucherId));
        }else{
          setSelectedVouchers([...selectedVouchers,voucherId]);
        }
    }

    const handleDelete = async (voucherId: number) => {
      const success = await deleteVoucher(voucherId);
      if (success) {
        setIsUpdate(prev => !prev);
      }
    };


    const handleDeleteSelected = async () => {
      if (selectedVouchers.length === 0) {
        toast.error("Vui lòng chọn ít nhất 1 voucher để xóa");
      } else {
        const success = await deleteSelectedVouchers(selectedVouchers);
        if (success) {
          setIsUpdate(prev => !prev);
        }
      }
    };

    const handleGiftVoucher = async () => {
      if (selectedVouchers.length === 0) {
        toast.error("Vui lòng chọn ít nhất 1 voucher để tặng");
      } else {
        const success = await giftVouchersToUsers(selectedVouchers);
        if (success) {
          setIsUpdate(prev => !prev);
        }
      }
    };
  
    const handleAddVoucherToVoucherAvailable = async () => {
      if (selectedVouchers.length === 0) {
        toast.error("Vui lòng chọn ít nhất 1 voucher để thêm");
      } else {
        const success = await addVouchersToVoucherAvailable(selectedVouchers);
        if (success) {
          setIsUpdate(prev => !prev);
        }
      }
    };

    const handleFindVoucherName=(e:ChangeEvent<HTMLInputElement>)=>{ // Nhập form tìm mã
      setVoucherNameFind(e.target.value);
  }
      
  const handleClickFindVoucher=()=>{ // Ấn tìm mã
      setVoucherNameFind(voucherNameFind);
  }

    const handleChangeCondition=(e:ChangeEvent<HTMLSelectElement>)=>{ // Thay đổi điều kiện condition
      setCondition(e.target.value);
    }

    const handleClickFilter=()=>{ // Lọc điều kiện voucher
       setCondition(condition)
    }


    return(
        <div className="container">
        <h1 className="mt-4 mb-4">Quản lý Voucher</h1>
        {isLoading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
        <div className="d-flex justify-content-center">
                <label htmlFor="findVoucher"className="form-label me-2">Mã Voucher</label>
                <input type="search" id="findVoucher" className="form-control-sm me-2" placeholder="Nhập mã voucher để tìm kiếm" value={voucherNameFind} onChange={handleFindVoucherName}></input>
                <button type="submit" className="btn btn-secondary" onClick={handleClickFindVoucher}>Tìm</button>
            </div>
        <div className="d-flex justify-content-end mb-3 mt-3">
          <Link to="/admin/voucherManagement/addVoucher">
              <button className="btn btn-primary me-2" onClick={handleAddVoucher}>
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Thêm Voucher
              </button> 
          </Link>
  
          
            <button className="btn btn-success me-2" onClick={handleAddVoucherToVoucherAvailable}>
            <FontAwesomeIcon icon={faTicket} className="me-2" /> Thêm Voucher vào danh sách voucher có sẵn
          </button>

          <button className="btn btn-warning me-2" onClick={handleGiftVoucher}>
          <FontAwesomeIcon icon={faGift} className="me-2" /> Tặng Voucher
        </button>

        <button className="btn btn-danger" onClick={handleDeleteSelected}>
          <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Xóa Tất Cả Voucher Đã Chọn
        </button>

        </div>

        <div className="d-flex justify-content-center">
        <select className=" form-select-sm me-2" value={condition} onChange={handleChangeCondition}>
              <option value='Tất cả voucher'>Tất cả voucher</option>
              <option value='Voucher hết hạn'>Voucher hết hạn</option>
              <option value='Voucher còn hạn'>Voucher còn hạn</option>
              <option value='Voucher nằm trong danh sách voucher có sẵn'>Voucher nằm trong danh sách voucher có sẵn</option>
              <option value='Voucher không nằm trong danh sách voucher có sẵn'>Voucher không nằm trong danh sách voucher có sẵn</option>
          </select>
          <button type="submit" className="btn btn-info" onClick={handleClickFilter}>Lọc</button>

        </div>
      
      <input type="checkbox" style={{marginRight:"10px"}}checked={selectAll} onChange={handleSelectAll}></input>
      <b>Tất cả ({allVouchers.length})</b>   
      
      <b> || Đã chọn ({countVoucher}) voucher</b>
      <br/>
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
                      <div dangerouslySetInnerHTML={{ __html: voucher.describe }} />
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
                        {voucher.isActive ? 'Còn hạn' : 'Hết hạn'}
                      </span>
                      <input type="checkbox"
                          checked={selectedVouchers.includes(allVouchers[index].voucherId)}
                          onChange={()=>handleSelectVoucher(allVouchers[index].voucherId)}
                          className="ms-3"></input>
                    </div>
                    <div>
                      <Link to={`/admin/voucher/editVoucher/${voucher.voucherId}`} className="btn btn-sm btn-outline-primary me-2">
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
        <br/>
        {notice && <div className="alert alert-info mt-3">{notice}</div>}
        
    </div>
    )
}

const VoucherManagementPage = RequireAdmin(VoucherManagement);
export default VoucherManagementPage;