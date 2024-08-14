import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFaceSadCry } from "@fortawesome/free-solid-svg-icons";
import VoucherModel from "../../models/VoucherModel";
import SaveVoucher from "../../user/userVoucher/SaveVoucher";

interface VoucherProps{
    showSaveVoucher:boolean
    vouchers:VoucherModel[];
    notice:string,
    showQuantity:Map<number,number> | null
}
const VouchersProps:React.FC<VoucherProps>=(props)=>{
    return (
        <div className="container">
            <div>
                {
                     <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                     {props.vouchers?.map((voucher, index) => (
                       <div key={voucher.voucherId} className="col">
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
                               <div className="col-6">
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
                             {
                              props.showSaveVoucher && <SaveVoucher voucherId={voucher.voucherId}/>
                             }
                             </div>
                           </div>
                           <div className="card-footer bg-transparent">
                             <div className="d-flex justify-content-between align-items-center">
                               <div>
                                { props.showQuantity ? <span className="badge bg-info me-2">Số lượng: {props.showQuantity.get(voucher.voucherId)}</span> 
                                                    : <span className="badge bg-info me-2">Số lượng: {voucher.quantity}</span> }
                                 <span className={`badge ${voucher.isActive ? 'bg-success' : 'bg-danger'}`}>
                                   {voucher.isActive ? 'Còn hạn' : 'Hết hạn'}
                                 </span>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                }
                <br/>

            </div>
            {props.notice && <p className="alert alert-info mt-3"><FontAwesomeIcon icon={faFaceSadCry} /> {props.notice}</p>}
        </div>
    )

}

export default VouchersProps;