import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import NumberFormat from "../../layouts/utils/NumberFormat";
import { ChatOutlined, LocalMallOutlined, MenuBookOutlined, PaidOutlined, PeopleAltOutlined, RateReviewOutlined } from "@mui/icons-material";

interface ParameterDigitalProps {
    totalPrice: number;
    numberOfAccount: number;
    numberOfOrder: number;
	totalReviewShop:number;
    totalNumberBooks: number;
    totalNumberOfReviews: number;
}

export const ParameterDigital: React.FC<ParameterDigitalProps> = ({
    totalPrice,
    numberOfAccount,
    numberOfOrder,
	totalReviewShop,
    totalNumberBooks,
    totalNumberOfReviews
}) => {
    const cardData = [
        { title: "TỔNG TIỀN KIẾM ĐƯỢC", value: NumberFormat(totalPrice)+" VND", icon: PaidOutlined, color: 'success.main' },
        { title: "TỔNG SỐ TÀI KHOẢN", value: numberOfAccount.toLocaleString("vi"), icon: PeopleAltOutlined, color: 'primary.main' },
        { title: "TỔNG HÓA ĐƠN", value: NumberFormat(numberOfOrder), icon: LocalMallOutlined, color: 'grey.600' },
        { title: "TỔNG SỐ SÁCH", value: totalNumberBooks, icon: MenuBookOutlined, color: 'secondary.main' },
        { title: "Tổng ĐÁNH GIÁ SHOP", value: totalReviewShop, icon: ChatOutlined, color: 'warning.main' },
        { title: "TỔNG ĐÁNH GIÁ TẤT CẢ QUYỂN SÁCH", value: totalNumberOfReviews, icon: RateReviewOutlined, color: 'error.main' },
    ];

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default' }}>
            <Grid container spacing={3}>
                {cardData.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%', bgcolor: card.color, color: 'white' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.8 }}>
                                    {card.title}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                        {card.value}
                                    </Typography>
                                    <Box sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.2)', 
                                        borderRadius: '50%', 
                                        p: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <card.icon fontSize="large" />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};