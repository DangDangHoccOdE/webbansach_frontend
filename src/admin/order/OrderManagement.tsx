import { useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import OrderModel from "../../models/OrderModel";
import { fetchAllOrders } from "../../api/OrderAPI";
import { getUserByOrderId } from "../../api/UserAPI";
import UserModel from "../../models/UserModel";
import { Box, Button, CircularProgress, FormControl, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Pagination } from "../../layouts/utils/Pagination";

const OrderManagement:React.FC=()=>{
    useScrollToTop();

    const navigate = useNavigate();
    const [currentPage,setCurrentPgae] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    const [isLoading,setIsLoading] = useState(false);
    const [allOrders,setAllOrders] = useState<OrderModel[]>([]);
    const [orderUsers,setOrderUsers] = useState<UserModel[]>([]);

    useEffect(()=>{
        const getAllOrderAdmin = async()=>{ // Lấy ra dữ liệu tất cả đơn hàng
            setIsLoading(true)
            try{
                const dataOrders = await fetchAllOrders(currentPage-1);

                if(dataOrders){
                    setAllOrders(dataOrders.resultOrders);
                    setTotalPages(dataOrders.totalPages);
    
                    const handleFetchDataUser = dataOrders.resultOrders.map(async(order:OrderModel)=>{
                        const dataUser = await getUserByOrderId(order.orderId);
                        return dataUser;
                    })
                    const fetchDataUser = (await Promise.all(handleFetchDataUser)).filter(user=>user!==null) as UserModel[]; // Lấy ra dữ liệu user từ đơn hàng
                    setOrderUsers(fetchDataUser);
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

        getAllOrderAdmin();
    },[navigate,currentPage])

    const handleOrderStatusChange= (orderId:number,newStatus:string)=>{
        setAllOrders(allOrders.map(order=>
            order.orderId === orderId ? {...order,statusOrder:newStatus}:order
        ));
    } 
    
    const handleDeliveryStatusChange= (orderId:number,newStatus:string)=>{
        setAllOrders(allOrders.map(order=>
            order.orderId === orderId ? {...order,deliveryStatus:newStatus}:order
        ));
    }

    const pagination=(pageCurrent:number)=>{
        setCurrentPgae(pageCurrent);
    }

    if (isLoading) {
        return (
          <div className="text-center mt-5">
            <CircularProgress color="inherit" />
          </div>
        );
      }
    

    return(
        <Box sx={{ minWidth: 120 }}>
            <Typography display="flex" justifyContent="center" alignItems="center" my={4} variant="h2" >Quản lý đơn hàng</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2,mr:2 }}>
                <Button variant="contained" color="success">
                    Lưu
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Người đặt</TableCell>
                            <TableCell>Trạng thái đơn hàng</TableCell>
                            <TableCell>Trạng thái giao hàng</TableCell>
                            <TableCell>Tiện ích</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allOrders && allOrders.length>0 ?(
                            allOrders.map((order,index)=>(
                            <TableRow key={order.orderId}>
                                <TableCell>{(currentPage-1)*10 + index+1}</TableCell>
                                <TableCell>{order.orderCode}</TableCell>
                                <TableCell>{orderUsers[index].userName}</TableCell>
                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select
                                            value={order.orderStatus}
                                            onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                                        >
                                            <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                                            <MenuItem value="Đang vận chuyển">Đang vận chuyển</MenuItem>
                                            <MenuItem value="Đã giao">Đã giao</MenuItem>
                                            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                                            <MenuItem value="Đánh giá">Đánh giá</MenuItem>
                                            <MenuItem value="Trả hàng">Trả hàng</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select 
                                            value={order.deliveryStatus}
                                            onChange={e=>handleDeliveryStatusChange(order.orderId,e.target.value)}>
                                            <MenuItem value="Chưa giao">Chưa giao</MenuItem>
                                            <MenuItem value="Đang giao">Đang giao</MenuItem>
                                            <MenuItem value="Đã giao">Đã giao</MenuItem>
                                            <MenuItem value="Trả hàng">Trả hàng</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                     <Stack direction="row" spacing={2}>
                                        <Button variant="contained" startIcon={<EditIcon />}>Xem chi tiết</Button>
                                        <Button  variant="outlined" color="error" endIcon={<DeleteIcon /> }>Xóa</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )))  : (
                            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography color="error">Hiện tại chưa có đơn hàng</Typography>
                            </Box>  
                        )
                    }
                    </TableBody>
                </Table>

            </TableContainer>

            <Box sx={{mt:2,display:"flex", flexDirection: "column",alignItems:"center"}}>
                <Pagination currentPage={currentPage} totalPages={totalPages} pagination={pagination}/>
            </Box>
        </Box>
    )
}

const OrderManagement_Admin = RequireAdmin(OrderManagement);
export default OrderManagement_Admin;