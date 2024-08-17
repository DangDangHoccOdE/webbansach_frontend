import { useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import OrderModel from "../../models/OrderModel";
import { fetchAllOrders } from "../../api/OrderAPI";
import { getUserByOrderId } from "../../api/UserAPI";
import UserModel from "../../models/UserModel";
import { Box,  CircularProgress, Container, FormControl, IconButton, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Pagination } from "../../layouts/utils/Pagination";
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { confirm } from "material-ui-confirm";
import { toast } from "react-toastify";
import fetchWithAuth from "../../layouts/utils/AuthService";

const OrderManagement:React.FC=()=>{
    useScrollToTop();

    const navigate = useNavigate();
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    const [isLoading,setIsLoading] = useState(false);
    const [allOrders,setAllOrders] = useState<OrderModel[]>([]);
    const [orderUsers,setOrderUsers] = useState<UserModel[]>([]);
    const [isUpdate,setIsUpdate] = useState(false);

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
    },[navigate,currentPage,isUpdate])
    
    const handleDeliveryStatusChange= (orderId:number,newStatus:string)=>{
        setAllOrders(allOrders.map(order=>
            order.orderId === orderId ? {...order,deliveryStatus:newStatus}:order
        ));
    }

    const pagination=(pageCurrent:number)=>{
        setCurrentPage(pageCurrent);
    }

    const handleShowOrderDetail=(orderId:number)=>{ // Xem chi tiết đơn hàng
        navigate(`/order/purchase/${orderId}`)
    }

    const handleSaveStatusOrder = (order:OrderModel)=>{
        confirm({
            title:'Chỉnh sửa trạng thái đơn hàng',
            description:`Bạn xác nhận lưu thay đổi trạng thái đơn hàng mã: ${order.orderCode}`,
            confirmationText:['Lưu'],
            cancellationText:['Hủy'],
        }).then(()=>{
            toast.promise(
                fetchWithAuth(`http://localhost:8080/order/saveOrderStatusChange/${order.orderId}`,{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify(order)
            }).then((response)=>{
                if(response.ok){
                    toast.success("Đã lưu trạng thái đơn hàng thành công");
                    setIsUpdate(prev=>!prev); // Biến này để cập nhật lại giao diện khi xóa
                }else{
                    toast.error("Lỗi lưu trạng thái đơn hàng!");
                }
            }).catch(error=>{
                toast.error("Lỗi lưu trạng thái đơn hàng!");
                console.error(error);
            }),
            {pending:"Đang trong quá trình xử lý..."}
        )})
        .catch(()=>{});
    }

    

    return (
        <Container maxWidth="lg">
          <Box sx={{ minWidth: 120, py: 4 }}>
            <Typography variant="h3" align="center" gutterBottom>
              Quản lý đơn hàng
            </Typography>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} elevation={3}>
                  <Table sx={{ minWidth: 650 }} aria-label="order table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">#</TableCell>
                        <TableCell align="center">Mã đơn hàng</TableCell>
                        <TableCell align="center">Người đặt</TableCell>
                        <TableCell align="center">Trạng thái đơn hàng</TableCell>
                        <TableCell align="center">Trạng thái giao hàng</TableCell>
                        <TableCell align="center">Tiện ích</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allOrders && allOrders.length > 0 ? (
                        allOrders.map((order, index) => (
                          <TableRow key={order.orderId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align="center">{(currentPage - 1) * 10 + index + 1}</TableCell>
                            <TableCell align="center">{order.orderCode}</TableCell>
                            <TableCell align="center">{orderUsers[index].userName}</TableCell>
                            <TableCell align="center">{order.orderStatus}</TableCell>
                            <TableCell align="center">
                              <FormControl fullWidth size="small">
                                <Select
                                  value={order.deliveryStatus}
                                  onChange={(e) => handleDeliveryStatusChange(order.orderId, e.target.value)}
                                >
                                  <MenuItem value="Chưa giao">CHƯA GIAO</MenuItem>
                                  <MenuItem value="Đang giao">ĐANG GIAO</MenuItem>
                                  <MenuItem value="Đã giao">ĐÃ GIAO</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="Xem chi tiết">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleShowOrderDetail(order.orderId)}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="Lưu">
                                  <IconButton
                                    color="success"
                                    onClick={() => handleSaveStatusOrder(order)}
                                  >
                                    <SaveIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography color="error">Hiện tại chưa có đơn hàng</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Pagination
                    currentPage={currentPage} pagination={pagination} totalPages={totalPages}
                  />
                </Box>
              </>
            )}
          </Box>
        </Container>
      );
    };
    

const OrderManagement_Admin = RequireAdmin(OrderManagement);
export default OrderManagement_Admin;