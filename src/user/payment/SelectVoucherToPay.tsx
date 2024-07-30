import { Button, Modal, Form } from "react-bootstrap";
import useScrollToTop from "../../hooks/ScrollToTop";
import {  ChangeEvent, useEffect, useState } from "react";
import VoucherModel from "../../models/VoucherModel";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { useNavigate } from "react-router-dom";
import { getVoucherById, showAllVouchers_User } from "../../api/VoucherAPI";
import { updateVoucher } from "../../layouts/voucher/UpdateIsActiveFromVoucher";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFaceSadCry } from "@fortawesome/free-solid-svg-icons";

interface SelectVoucherProps {
  showModal: boolean;
  handleClose: () => void;
  onApplyVoucher:(bookVoucher:VoucherModel|null,shipVoucher:VoucherModel|null)=>void;
}

const SelectVoucherToPay: React.FC<SelectVoucherProps> = (props) => {
  useScrollToTop();
  const [vouchersBook, setVouchersBook] = useState<VoucherModel[]>([]);
  const [vouchersShip, setVouchersShip] = useState<VoucherModel[]>([]);
  const [selectedBookVoucher, setSelectedBookVoucher] = useState<number>(0);
  const [selectedShipVoucher, setSelectedShipVoucher] = useState<number>(0);
  const userId = getUserIdByToken();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [noticeVouchersBook,setNoticeVouchersBook] = useState("")
  const [noticeVouchersShip,setNoticeVouchersShip] = useState("")
  const [findVoucherName,setFindVoucherName] = useState("")
  const [temporaryVoucherName,setTemporaryVoucherName] = useState("")

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    const showAllVoucherUser = async () => {
      try {
        if (userId) {
          const fetchData = await showAllVouchers_User(findVoucherName,userId);
          const updateData = await updateVoucher(fetchData);
          const filterVoucherBook = updateData.filter(voucher => voucher.typeVoucher === "Voucher sách");
          if(filterVoucherBook.length===0){
            setNoticeVouchersBook("Bạn hiện chưa có voucher")
          }else{
            setNoticeVouchersBook("");
          }
          
          const filterVoucherShip = updateData.filter(voucher => voucher.typeVoucher === "Voucher vận chuyển");
          if(filterVoucherShip.length===0){
            setNoticeVouchersShip("Bạn hiện chưa có voucher")
          }else{
            setNoticeVouchersShip("");
          }
          setVouchersBook(filterVoucherBook);
          setVouchersShip(filterVoucherShip);
        }
      } catch (error) {
        console.error({error});
      }
    };
    showAllVoucherUser();
  }, [findVoucherName, isLoggedIn, navigate, userId]);

  const handleSubmit = async() => { // Khi người dùng ấn áp dụng voucher
    try{
      if(selectedBookVoucher!==0 && selectedShipVoucher!==0){
        const voucherBookIsChoose = await getVoucherById(selectedBookVoucher);  // Xử lý Biến id voucher thành voucher
        const voucherShipIsChoose = await getVoucherById(selectedShipVoucher);
        
        props.onApplyVoucher(voucherBookIsChoose,voucherShipIsChoose);
      }else if(selectedBookVoucher!==0 && selectedShipVoucher===0){
        const voucherBookIsChoose = await getVoucherById(selectedBookVoucher); 
        props.onApplyVoucher(voucherBookIsChoose,null);
      }else  if(selectedShipVoucher!==0 && selectedBookVoucher === 0){
        const voucherShipIsChoose = await getVoucherById(selectedShipVoucher);

         props.onApplyVoucher(null,voucherShipIsChoose);
      }else{
          props.onApplyVoucher(null,null);
        }
    }catch(error){
        console.error({error})
    }

    props.handleClose();
  };

  const handleFindVoucher=(e:ChangeEvent<HTMLInputElement>)=>{
    setTemporaryVoucherName(e.target.value);
}

const handleFindVoucherName=()=>{
    setFindVoucherName(temporaryVoucherName)
}

  const renderVoucherList = (vouchers: VoucherModel[], selectedVoucher: number, setSelectedVoucher: (id: number) => void,notice:string)=> (
    <div className="voucher-list">
      
      {vouchers.length>0 ? vouchers.map((voucher) => (
        <Form.Check
          key={voucher.voucherId}
          type="checkbox"
          id={`voucher-${voucher.voucherId}`}
          name={`voucher-${voucher.typeVoucher}`}
          label={
            <div className="voucher-item d-flex align-items-center">
                
              <img src={voucher.voucherImage} alt="Voucher" className="voucher-image me-2" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
              <div>
                <strong>{voucher.code}</strong> - Giảm {voucher.discountValue}%
                <br />
                <small>
                  <FontAwesomeIcon icon={faClock} className="me-1" />
                  Hết hạn: {new Date(voucher.expiredDate).toLocaleDateString()}
                </small>
              </div>
            </div>
          }
          value={voucher.voucherId}
          checked={selectedVoucher === voucher.voucherId}
          onChange={(e) => {
            if(selectedBookVoucher === voucher.voucherId){
              setSelectedBookVoucher(0);
            }else if(selectedShipVoucher === voucher.voucherId){
              setSelectedShipVoucher(0);
            }else{
              setSelectedVoucher(parseInt(e.target.value))
            }
          }}
        />
      )) : 
      <p className="alert alert-info mt-3"><FontAwesomeIcon icon={faFaceSadCry} /> {notice}</p>
      }

    </div>
  );

  return (
    <Modal
      show={props.showModal}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Chọn voucher của bạn</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
          <div className="d-flex justify-content-center mb-2">
                <label htmlFor="findVoucher"className="form-label me-2">Mã Voucher</label>
                <input type="text" id="findVoucher" className="form-control-sm me-2" onChange={handleFindVoucher} value={temporaryVoucherName} placeholder="Nhập mã voucher của bạn vào đây"></input>
                <button type="button" className="btn btn-secondary" onClick={handleFindVoucherName}>Áp dụng</button>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ưu đãi phí vận chuyển (Chọn 1 voucher)</Form.Label>
            {renderVoucherList(vouchersShip, selectedShipVoucher, setSelectedShipVoucher,noticeVouchersShip)}
          </Form.Group>
          <Form.Group>
            <Form.Label>Mã giảm giá sách (Chọn 1 voucher)</Form.Label>
            {renderVoucherList(vouchersBook, selectedBookVoucher, setSelectedBookVoucher,noticeVouchersBook)}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Đóng
        </Button>
        <Button onClick={handleSubmit} variant="primary">
          Áp dụng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectVoucherToPay;