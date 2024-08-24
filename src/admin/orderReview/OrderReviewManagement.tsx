import React, { useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import RequireAdmin from "../RequireAdmin";
import { getNumberOfStarDelivery, getNumberOfStarShop } from "../../api/OrderReviewAPI";
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Rating, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

const OrderReviewManagement: React.FC = () => {
  useScrollToTop();
  const [orderReviewsShop, setOrderReviewsShop] = useState<Map<string, number>>(new Map());
  const [orderReviewsDelivery, setOrderReviewsDelivery] = useState<Map<string, number>>(new Map());
  const [averageRateShop, setAverageRateShop] = useState(0);
  const [averageRateDelivery, setAverageRateDelivery] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getNumberOfStarShop(), getNumberOfStarDelivery()])
      .then(([dataShop, dataDelivery]) => {
        setOrderReviewsShop(new Map(Object.entries(dataShop)));
        setOrderReviewsDelivery(new Map(Object.entries(dataDelivery)));
        setAverageRateShop(dataShop.averageRateShop || 0);
        setAverageRateDelivery(dataDelivery.averageRateDelivery || 0);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
        Quản lý Đánh giá
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loại đánh giá</TableCell>
                    <TableCell align="center">Điểm trung bình</TableCell>
                    <TableCell align="center">5 sao</TableCell>
                    <TableCell align="center">4 sao</TableCell>
                    <TableCell align="center">3 sao</TableCell>
                    <TableCell align="center">2 sao</TableCell>
                    <TableCell align="center">1 sao</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Đánh giá Shop</TableCell>
                    <TableCell align="center">
                      {averageRateShop.toFixed(2)}
                      <Rating value={averageRateShop} precision={0.1} readOnly size="small" sx={{ ml: 1 }} />
                    </TableCell>
                    {[5, 4, 3, 2, 1].map(star => (
                      <TableCell key={star} align="center">
                        {orderReviewsShop.get(star.toString()) || 0}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Đánh giá Vận chuyển</TableCell>
                    <TableCell align="center">
                      {averageRateDelivery.toFixed(2)}
                      <Rating value={averageRateDelivery} precision={0.1} readOnly size="small" sx={{ ml: 1 }} />
                    </TableCell>
                    {[5, 4, 3, 2, 1].map(star => (
                      <TableCell key={star} align="center">
                        {orderReviewsDelivery.get(star.toString()) || 0}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const OrderReviewManagementPage = RequireAdmin(OrderReviewManagement);
export default OrderReviewManagementPage;