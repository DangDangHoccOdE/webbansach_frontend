import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import OrderModel from "../../models/OrderModel";
import { getOrderByOrderId } from "../../api/OrderAPI";
import { Box, Button, CircularProgress, Divider, Grid, Paper, Typography } from "@mui/material";
import OrderDetail from "./OrderDetail";
import VoucherModel from "../../models/VoucherModel";
import { useAuth } from "../../context/AuthContext";
import { getVoucherFromOrder } from "../../api/VoucherAPI";
import NumberFormat from "../../layouts/utils/NumberFormat";
import { getPaymentByOrderId } from "../../api/PaymentAPI";
import PaymentModel from "../../models/PaymentModel";
import { RateReview } from "@mui/icons-material";
import ShowOrderReviewByUser from "../review/ShowOrderReviewByUser";

const ViewPurchasedOrder = () =>{
    const {isLoggedIn} = useAuth();

    const navigate = useNavigate();
    const {orderId} = useParams();
    const [order,setOrder] = useState<OrderModel|null>(null)
    const [isLoading,setIsLoading] = useState(false);
    const [voucherBook,setVoucherBook] = useState<VoucherModel|null>(null)
    const [voucherShip,setVoucherShip] = useState<VoucherModel|null>(null)
    const [payment,setPayment] = useState<PaymentModel|null>(null)
    const [showModal, setShowModal] = useState(false);

    const orderIdNumber = parseInt(orderId+'');

    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login",{replace:true});
            return;
        }
        const fetchOrder = async()=>{
            try{
                setIsLoading(true);
                const data = await getOrderByOrderId(orderIdNumber);
                if(data){
                    setOrder(data);
                }else{
                    navigate("/error-404",{replace:true})
                }
            }catch(error){
                console.error(error);
                navigate("/error-404",{replace:true})
            }finally{
                setIsLoading(false);
            }
        }

        fetchOrder();
    },[isLoggedIn, navigate, orderIdNumber])

    useEffect(()=>{
        if(order){
                getVoucherFromOrder(order.orderId)
                    .then(vouchers=>{
                            vouchers.forEach(voucher=>{
                                if(voucher.typeVoucher==="Voucher sách"){
                                    setVoucherBook(voucher);
                                }else{
                                    setVoucherShip(voucher);
                                }
                            }) 
                    }).catch(error=>{
                        console.error(error);
                        navigate("/error-404",{replace:true})
                    })

                getPaymentByOrderId(order.orderId)
                    .then(data=>{
                        if(data){
                            setPayment(data);
                        }else{
                            navigate("/error-404",{replace:true})
                        }
                    }).catch(error=>{
                        console.error(error);
                        navigate("/error-404",{replace:true})
                    })
            }
      
    },[navigate, order])

    const totalPriceShip=useMemo(()=>{ // Tổng tiền ship
        if(order&&voucherShip){
            return Math.floor(order.shippingFee / (1-(voucherShip.discountValue/100)) )
        }else if(order){
            return order.shippingFee;
        }else{
            return 0;
        }
    },[order, voucherShip])

    const priceShipVoucher=useMemo(()=>{  // Tiền ship sau khi áp voucher
        if(order&&voucherShip){
            return Math.floor(totalPriceShip*(voucherShip.discountValue/100))
        }else{
            return 0;
        }
    },[order, totalPriceShip, voucherShip]) 
    
    const discountPriceByBookVoucher=useMemo(()=>{ // Tiền sách được giảm
        if(order&&voucherBook){
            return Math.floor(order.totalPrice * (voucherBook.discountValue/100))
        }else{
            return 0;
        }
    },[order, voucherBook])


    const handleClose = () => { // Đóng modal
        setShowModal(false);
    }

    const handleShowViewOrder=()=>{
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
          }else{
            setShowModal(true);
          }    }

    if(isLoading){
        return(
            <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress color="inherit" />
        </Box>
        )
    }

    return (
        order &&
        <Box sx={{ mt: 2, mx: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>Thông tin đơn hàng</Typography>
    
                    <Grid container>
                        <Grid item xs={8}>
                            <Typography variant="subtitle1">Mã đơn hàng: {order.orderCode}</Typography>
                            <Typography variant="body1">Địa chỉ nhận hàng: {order.deliveryAddress}</Typography>
                        </Grid>
                        
                        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Typography 
                                color="error" 
                                variant="h6" 
                                sx={{ fontSize: '1.5rem' }}
                            >
                                {order.orderStatus}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>Chi tiết đơn hàng</Typography>
                        <OrderDetail
                            key={order.orderId}
                            orderId={order.orderId}
                            onOrderUpdate={null}
                            showFunctionRelateOrder={false}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>Tổng quan thanh toán</Typography>
                        <Box display="flex" justifyContent="space-between" my={1}>
                            <Typography>Tổng tiền hàng</Typography>
                            <Typography>{NumberFormat(order.totalPrice)} đ</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" my={1}>
                            <Typography>Phí vận chuyển</Typography>
                            <Typography>{NumberFormat(totalPriceShip)} đ</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" my={1}>
                            <Typography>Giảm giá phí vận chuyển</Typography>
                            <Typography>- {NumberFormat(priceShipVoucher)} đ</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" my={1}>
                            <Typography>Voucher từ BookStore</Typography>
                            <Typography>- {NumberFormat(discountPriceByBookVoucher)} đ</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between" my={1}>
                            <Typography variant="h6">Tổng thanh toán</Typography>
                            <Typography variant="h6" color="error">{NumberFormat(order.paymentCost)} đ</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>Phương thức thanh toán</Typography>
                        <Typography variant="body1">{payment?.paymentName}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" mt={2} mb={3}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<RateReview />}
                            onClick={
                                handleShowViewOrder
                            }
                        >
                            Xem đánh giá
                        </Button>
                        <ShowOrderReviewByUser 
                      handleClose={handleClose} 
                      showModal={showModal} 
                      orderId={orderIdNumber} 
                    />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ViewPurchasedOrder;