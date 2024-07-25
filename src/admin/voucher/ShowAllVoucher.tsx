import { ChangeEvent, useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import VoucherModel from "../../models/VoucherModel";
import { showAllVouchers_Admin } from "../../api/VoucherAPI";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEdit, faGift, faPlus, faTicket, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import useScrollToTop from "../../hooks/ScrollToTop";
import { toast } from "react-toastify";
import handleUpdateIsActiveFromVoucher from "../../layouts/voucher/HandleUpdateIsActiveFromVoucher";

const ShowAllVoucher : React.FC=()=>{
    const [allVouchers,setAllVouchers] = useState<VoucherModel[]>([])
    const [isLoading,setIsLoading] = useState(false);
    const [notice,setNotice] = useState("")
    const navigate = useNavigate();
    const [selectedVouchers,setSelectedVouchers] = useState<number[]>([]);
    const [selectAll,setSelectAll] = useState(false);

    const [voucherNameFind,setVoucherNameFind] = useState('')
    const [condition,setCondition] = useState('')
    const [countVoucher,setCountVoucher] = useState(0)

    useScrollToTop();

    useEffect(()=>{
        const showAllVouchers = async()=>{
            try{
                setIsLoading(true);
                const vouchers =await showAllVouchers_Admin(voucherNameFind,condition);
                if(vouchers.length===0){
                    setNotice("Hiện chưa có voucher nào!");
                }
                if(vouchers){
                  // let counter = 0;
                  const updateVouchers= vouchers.map(async(voucherItem)=>{
                      const nowDate = new Date();
                      nowDate.setDate(nowDate.getDate()-1);
                      const expiredDate = new Date(voucherItem.expiredDate);
                      if(expiredDate<nowDate && voucherItem.isActive){
                        const voucher =  await handleUpdateIsActiveFromVoucher(voucherItem.voucherId) // Cập nhật lại trạng thái voucher khi hết hạn
                        return {...voucherItem,isActive:voucher.isActive};                    
                      }
                      return voucherItem;
                  })
                  const update = await Promise.all(updateVouchers);
                  setAllVouchers(update)
              }
            }catch(error){
                console.log({error})
            }finally{
                setIsLoading(false)
            }

        }

        showAllVouchers();
    },[condition, voucherNameFind])

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

    const handleDeleteSelected=()=>{ // Xóa nhưng voucher đã chọn
      if(selectedVouchers.length===0){
        toast.error("Vui lòng chọn ít nhất 1 voucher để xóa");
      }else{
        const adminConfirm = window.confirm("Bạn có chắc chắn muốn xóa!")
        if(!adminConfirm){
          return;
        }else{
          navigate("/vouchers/deleteAllVouchersSelected",{state:{selectedVouchers}})
        }
      }
     
      }

    const handleGiftVoucher=()=>{ // Tặng voucher cho người dùng
      if(selectedVouchers.length===0){
        toast.error("Vui lòng chọn ít nhất 1 voucher để tặng");
      }else{
        const adminConfirm = window.confirm("Bạn có chắc chắn muốn tặng cho tất cả người dùng!")
        if(!adminConfirm){
          return;
        }else{
          navigate("/vouchers/giftVouchersToUsers",{state:{selectedVouchers}})
        }
      }
    }

    const handleFindVoucherName=(e:ChangeEvent<HTMLInputElement>)=>{ // Nhập form tìm mã
        setVoucherNameFind(e.target.value);
    }
        
    const handleClickFindVoucher=()=>{ // Ấn tìm mã
        setVoucherNameFind(voucherNameFind);
    }

    const handleAddVoucherToVoucherAvailable=()=>{ // Xử lý thêm voucher vào danh sách voucher có sẵn
      if(selectedVouchers.length===0){
        toast.error("Vui lòng chọn ít nhất 1 voucher để thêm");
      }else{
        const adminConfirm = window.confirm("Bạn có chắc chắn muốn thêm vào danh sách voucher có sẵn cho tất cả người dùng!")
        if(!adminConfirm){
          return;
        }else{
          navigate("/vouchers/addVouchersToVoucherAvailable",{state:{selectedVouchers}})
        }
      }
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
                <input type="text" id="findVoucher" className="form-control-sm me-2" placeholder="Nhập mã voucher của bạn vào đây" value={voucherNameFind} onChange={handleFindVoucherName}></input>
                <button type="submit" className="btn btn-secondary" onClick={handleClickFindVoucher}>Tìm</button>
            </div>
        <div className="d-flex justify-content-end mb-3 mt-3">
          <button className="btn btn-primary me-2" onClick={handleAddVoucher}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Thêm Voucher
          </button> 
          
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
                        {voucher.isActive ? 'Còn hạn' : 'Hết hạn'}
                      </span>
                      <input type="checkbox"
                          checked={selectedVouchers.includes(allVouchers[index].voucherId)}
                          onChange={()=>handleSelectVoucher(allVouchers[index].voucherId)}
                          className="ms-3"></input>
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
        <br/>
        {notice && <div className="alert alert-info mt-3">{notice}</div>}
        
    </div>
    )
}

const ShowAllVoucher_Admin = RequireAdmin(ShowAllVoucher);
export default ShowAllVoucher_Admin;