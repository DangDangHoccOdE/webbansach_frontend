import { Card, CardContent, Typography } from "@mui/material"
import NumberFormat from "../../layouts/utils/NumberFormat"
import { ChatOutlined, LocalMallOutlined, MenuBookOutlined, PaidOutlined, PeopleAltOutlined, RateReviewOutlined } from "@mui/icons-material"

interface ParameterDigitalProps{
    totalPrice:number,
    numberOfAccount :number,
    numberOfOrder:number,
    totalNumberBooks:number,
    totalNumberOfFeedbacks:number,
    totalNumberOfReviews:number,
}
export const ParameterDigital : React.FC<ParameterDigitalProps> = ({   totalPrice,
    numberOfAccount ,
    numberOfOrder,
    totalNumberBooks,
    totalNumberOfFeedbacks,
    totalNumberOfReviews})=>{
 return (      
    <div className="container p-4">
        <div className="shadow-4 rounded p-5 bg-light">
            <div className="row">
                <div className="col-lg-4 col-6 col-sm-12 mb-3">
                    <Card
                        sx={{
                            maxWidth:275,
                            borderRadius:1,
                            backgroundColor:"##4db44da3"
                        }}>
                            <CardContent>
                                <Typography
                                    sx={{fontSize:14}}
                                        color='text.secondary'
                                        gutterBottom
                                    >
                                        TỔNG TIỀN KIẾM ĐƯỢC
                                    </Typography>
                                    <div className="d-flex align-item-center justify-content-between">
                                        <Typography sx={{
                                            fontSize:32,
                                            fontWeight:"bolder",
                                            marginTop:"10px"  
                                        }} gutterBottom>
                                            {NumberFormat(totalPrice)}
                                        </Typography>

                                        <div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<PaidOutlined
												fontSize='large'
												color='success'
											/>
										</span>
									</div>
                                    </div>
                            </CardContent>
                        </Card>
                </div>

                <div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,
								backgroundColor: "#1976d2a3",
							}}
						>
							<CardContent>
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									TỔNG SỐ TÀI KHOẢN
								</Typography>
								<div className='d-flex align-item-center justify-content-between'>
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{numberOfAccount.toLocaleString("vi")}
									</Typography>

									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<PeopleAltOutlined
												fontSize='large'
												color='primary'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                    <Card 
                        sx={{
                            minWidth:275,
                            borderRadius:1,
                            backgroundColor:"757575a3"
                        }}>
                            <CardContent>
                                <Typography sx={{fontSize:14}}
                                            color='text.secondary'
                                            gutterBottom>
                                                TỔNG HÓA ĐƠN
                                </Typography>

                                <div className="d-flex align-item-center justify-content-between">
                                    <Typography
                                        sx={{fontSize:32,
                                            fontWeight:'bolder',
                                            marginTop:"10px"
                                        }} gutterBottom
                                        >
                                            {NumberFormat(numberOfOrder)}
                                    </Typography>

                                    <div className="d-flex align-item-center justify-content-center">
                                        <span 
                                            className="rounded-circle p-3"
                                            style={{
                                                color:"black",
                                                fontWeight:"bold"
                                            }}>
                                                <LocalMallOutlined fontSize="large" color="action"/>
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                    </Card>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                    <Card 
                        sx={{
                            minWidth:275,
                            borderRadius:1,
                            backgroundColor: "#9c27b0a3",
                        }}>
                            <CardContent>
                                <Typography
                                    sx={{fontSize:14}}
                                    color='text-secondary'
                                    gutterBottom>
                                        TỔNG SỐ SÁCH
                                    </Typography>
                                    <div className="d-flex align-item-center justify-content-between">
                                        <Typography 
                                            sx={{fontSize:32,
                                                fontWeight:'bolder',
                                                marginTop:"10px"  
                                            }} gutterBottom>
                                                {totalNumberBooks}
                                            </Typography>
                                            <div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<MenuBookOutlined
												fontSize='large'
												color='secondary'
											/>
										</span>
									</div>
                                </div>
                            </CardContent>
                    </Card>
                </div>

                <div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,
								backgroundColor: "#ed6c02a1",
							}}
						>
							<CardContent>
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									NHẬN XÉT
								</Typography>
								<div className='d-flex align-item-center justify-content-between'>
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{totalNumberOfFeedbacks}
									</Typography>

									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<ChatOutlined
												fontSize='large'
												color='warning'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
                    <div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
						<Card
							sx={{
								minWidth: 275,
								borderRadius: 1,
								backgroundColor: "#d32f2fa1",
							}}
						>
							<CardContent>
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									TỔNG ĐÁNH GIÁ TẤT CẢ QUYỂN SÁCH
								</Typography>
								<div className='d-flex align-item-center justify-content-between'>
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: "bolder",
											marginTop: "10px",
										}}
										gutterBottom
									>
										{totalNumberOfReviews}
									</Typography>

									<div className='d-flex align-item-center justify-content-center flex-column '>
										<span
											className='rounded-circle p-3'
											style={{
												color: "black",
												fontWeight: "bold",
											}}
										>
											<RateReviewOutlined
												fontSize='large'
												color='error'
											/>
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
)}