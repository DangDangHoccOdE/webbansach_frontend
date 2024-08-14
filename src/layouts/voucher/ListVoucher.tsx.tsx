import { useEffect, useState } from "react"
import VoucherModel from "../../models/VoucherModel"
import useScrollToTop from "../../hooks/ScrollToTop"
import { showVouchersAvailable } from "../../api/VoucherAPI";
import VouchersProps from "./VouchersProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faTruck } from "@fortawesome/free-solid-svg-icons";
import { updateVoucher } from "./UpdateIsActiveFromVoucher";

const ListVoucher=()=>{
    useScrollToTop();

    const [vouchersForBook,setVouchersForBook] = useState<VoucherModel[]>([])
    const [vouchersForShip,setVouchersForShip] = useState<VoucherModel[]>([])
    const [isLoading,setIsLoading] = useState(false)
    const [noticeBook,setNoticeBook] = useState("");
    const [noticeShip,setNoticeShip] = useState("");
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                setIsLoading(true);
                const vouchersAvailable = await showVouchersAvailable();
                
              const voucherBook = vouchersAvailable.filter(voucher=>voucher.typeVoucher==="Voucher sách")

              const updateBook = await updateVoucher(voucherBook);
              if(updateBook.length===0){
                setNoticeBook("Hôm nay không có voucher khuyến mại")
            }
              setVouchersForBook(updateBook)

                const voucherShip = vouchersAvailable.filter(voucher=>voucher.typeVoucher==="Voucher vận chuyển")
                if(voucherShip.length===0){
                  setNoticeShip("Hôm nay không có voucher khuyến mại")
              }
                const updateShip = await updateVoucher(voucherShip);

                setVouchersForShip(updateShip);
            }catch(error){
                console.log({error});
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
            <VouchersProps notice={noticeBook} vouchers={vouchersForBook} showQuantity={null} showSaveVoucher={true}/>
          </div>
          <div>
            <h2 className="mb-4 text-secondary">
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Voucher vận chuyển
            </h2>
            <VouchersProps notice={noticeShip} vouchers={vouchersForShip} showQuantity={null}  showSaveVoucher={true}/>
          </div>
        </div>
      );
    };
    
   
export default ListVoucher;