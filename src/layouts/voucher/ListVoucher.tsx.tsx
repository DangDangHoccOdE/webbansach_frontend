import { useEffect, useState } from "react"
import VoucherModel from "../../models/VoucherModel"
import useScrollToTop from "../../hooks/ScrollToTop"
import { showVouchersAvailable } from "../../api/VoucherAPI";
import VouchersProps from "./VouchersProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faTruck } from "@fortawesome/free-solid-svg-icons";
import handleUpdateIsActiveFromVoucher from "./HandleUpdateIsActiveFromVoucher";

const ListVoucher=()=>{
    useScrollToTop();

    const [vouchersForBook,setVouchersForBook] = useState<VoucherModel[]>([])
    const [vouchersForShip,setVouchersForShip] = useState<VoucherModel[]>([])
    const [isLoading,setIsLoading] = useState(false)
    const [notice,setNotice] = useState("");
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                setIsLoading(true);
                const vouchersAvailable = await showVouchersAvailable();
                if(vouchersAvailable.length===0){
                    setNotice("Hôm nay không có voucher khuyến mại")
                }
                const voucherBook = vouchersAvailable.filter(voucher=>voucher.typeVoucher==="Voucher sách")
                const updateVouchers= voucherBook.map(async(voucherItem)=>{
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
              setVouchersForBook(update)

                const voucherShip = vouchersAvailable.filter(voucher=>voucher.typeVoucher==="Voucher vận chuyển")
                setVouchersForShip(voucherShip);
            }catch(error){
                console.log({error});
                setNotice("Lỗi, không thể lấy được dữ liệu voucher")
            }finally{
                setIsLoading(false);
            }
        }
        fetchData();
    },[])

    return (
        <div className="container my-5">
          <h1 className="text-center mb-5 fw-bold">Voucher hôm nay</h1>
          {isLoading && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="mb-5">
            <h2 className="mb-4 text-secondary">
              <FontAwesomeIcon icon={faTag} className="me-2" />
              Voucher giảm giá sách
            </h2>
            <VouchersProps key={1} notice={notice} vouchers={vouchersForBook} showQuantity={true} showSaveVoucher={true}/>
          </div>
          <div>
            <h2 className="mb-4 text-secondary">
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Voucher vận chuyển
            </h2>
            <VouchersProps key={2} notice={notice} vouchers={vouchersForShip} showQuantity={true}  showSaveVoucher={true}/>
          </div>
        </div>
      );
    };
    
   
export default ListVoucher;