import { Button, Modal } from "react-bootstrap";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useEffect, useState } from "react";
import VoucherModel from "../../models/VoucherModel";
import { getUserIdByToken } from "../../layouts/utils/JwtService";
import { useNavigate } from "react-router-dom";
import { showAllVouchers_User } from "../../api/VoucherAPI";
import { updateVoucher } from "../../layouts/voucher/UpdateIsActiveFromVoucher";
import { useAuth } from "../../context/AuthContext";

interface SelectVoucherProps{
    showModal:boolean,
    handleClose:()=>void,
}
const SelectVoucherToPay:React.FC<SelectVoucherProps>=(props)=>{
    useScrollToTop();
    const [vouchersBook,setVouchersBook] = useState<VoucherModel[]>([])
    const [vouchersShip,setVouchersShip] = useState<VoucherModel[]>([])
    const userId = getUserIdByToken();
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login",{replace:true});
            return;
        }

        if(userId){
            const showAllVoucherUser=async()=>{
                try{
                    const fetchData = await showAllVouchers_User(userId,'');
                    
                    const voucherBook = fetchData.filter(voucher=>voucher.typeVoucher==="Voucher sách")

                    const updateBook = await updateVoucher(voucherBook);

                }catch(error){
                    
                }
            }
        }
    })

    const handleSubmit=()=>{}

    return(
        <Modal
           show={props.showModal}
           onHide={props.handleClose}
           backdrop="static"
           keyboard={false}
        >
        <Modal.Header closeButton>
            <Modal.Title>Chọn voucher của bạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Đóng
            </Button>
            <Button onClick={handleSubmit} variant="primary">Ok</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default SelectVoucherToPay;