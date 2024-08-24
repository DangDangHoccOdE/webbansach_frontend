import { useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import OrderModel from "../../models/OrderModel";
import { getOrderByOrderId } from "../../api/OrderAPI";
import { Box, CircularProgress, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import OrderDetail from "./OrderDetail";
import { useNavigate, useParams } from "react-router-dom";
import PaymentModel from "../../models/PaymentModel";
import { getPaymentByOrderId } from "../../api/PaymentAPI";

const ShowCancellationDetails=()=>{
    useScrollToTop();
    const [order,setOrder] = useState<OrderModel|null>(null);
    const [paymentMethod,setPaymentMethod] = useState<PaymentModel|null>(null);
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {orderId} = useParams();
    const orderIdNumber = Number.parseInt(orderId+'');
     useEffect(()=>{
        if(!orderIdNumber){
            navigate("/error-404",{replace:true})
            return;
        }
                    Promise.all([
                        getOrderByOrderId(orderIdNumber) ,// fetch data order
                        getPaymentByOrderId(orderIdNumber)
                    ])  
                    .then(([dataOrder,dataPayment])=>{
                        setOrder(dataOrder);
                        setPaymentMethod(dataPayment)
                        setIsLoading(true);
                    })
                    .catch(error => {
                        setIsLoading(true);
                        console.error(error);
                    })
                    .finally(
                        ()=>setIsLoading(false)
                    );

                    
}, [navigate, orderIdNumber])

    return(
        <Container maxWidth="md">
            <Paper elevation={3}  sx={{p:3,mt:3,mb:3}}>
                <Typography variant="h4" gutterBottom>Chi tiết hủy đơn hàng</Typography>
                <Divider sx={{mb:2}}/>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="error">Lý do: {order?.reasonCancelOrder}</Typography>
                        <Typography variant="body2" color="text_secondary">
                             Thời gian hủy: {(order?.cancelOrderTime?.replace("T", " "))}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                             <strong>Mã đơn hàng:</strong> {order?.orderCode}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Phương thức thanh toán:</strong> {paymentMethod?.paymentName}
                        </Typography>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    {
                        isLoading?
                                <div className="text-center mt-3">
                                <CircularProgress />
                            </div> :
                            <>
                                     <Typography variant="h5" gutterBottom>Chi tiết đơn hàng</Typography>
                                        <OrderDetail 
                                            key={orderId}
                                            onOrderUpdate={null}
                                            orderId={orderIdNumber}
                                            showFunctionRelateOrder={false}
                                        /> 
                            </>
                    } 
                </Box>
            </Paper>
        </Container>
    )
}
export default ShowCancellationDetails;