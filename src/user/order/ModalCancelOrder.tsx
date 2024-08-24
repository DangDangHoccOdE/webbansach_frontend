import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material"
import { useState } from "react";
import { cancelOrder } from "./OrderActions";
import { toast } from "react-toastify";

interface CancelOrderProps{
    open: boolean;
    onClose:() => void;
    orderId: number;
    onOrderUpdate: ((updateOrder: any) => void)|null;
}

const ModalCancelOrder:React.FC<CancelOrderProps> =(props)=>{
    const [reason, setReason] = useState('');

    const handleChangeReasonCancelOrder = (event:SelectChangeEvent) => {
        setReason(event.target.value);
      };

      const handleConfirmCancelOrder=async()=>{
        if(reason && props.onOrderUpdate){
            const isUpdate = await cancelOrder(props.orderId,reason);
            if(isUpdate){
                props.onOrderUpdate({orderStatus:"Đã hủy"});
            }
            setReason("");
            props.onClose();
        }else{
          toast.error("Vui lòng chọn lý do hủy đơn hàng");
        }
    }

    return(
            <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            }}>
            <FormControl fullWidth>
                <InputLabel id="cancellation-reason-label">Lý do hủy đơn</InputLabel>
                <Select
                labelId="cancellation-reason-label"
                id="cancellation-reason-select"
                value={reason}
                label="Lý do hủy đơn"
                onChange={handleChangeReasonCancelOrder}
                >
                <MenuItem value="">
                    <em>Chọn lý do</em>
                </MenuItem>
                <MenuItem value="Hết hàng">Hết hàng</MenuItem>
                <MenuItem value="Thay đổi ý định">Thay đổi ý định</MenuItem>
                <MenuItem value="Tìm được giá tốt hơn">Tìm được giá tốt hơn</MenuItem>
                <MenuItem value="Lý do khác">Lý do khác</MenuItem>
                </Select>
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={props.onClose} sx={{ mr: 1 }}>Hủy</Button>
                <Button onClick={handleConfirmCancelOrder} variant="contained" color="error">
                Xác nhận hủy đơn
                </Button>
            </Box>
            </Box>
        </Modal>
    )
}

export default ModalCancelOrder;