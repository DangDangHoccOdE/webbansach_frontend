import {  useEffect, useState } from "react"
import {  getNumberOfAccount } from "../../api/UserAPI";
import { fetchAllOrders } from "../../api/OrderAPI";
import {  getNumberOfBook } from "../../api/BookAPI";
import { getNumberOfReview } from "../../api/ReviewAPI";
import { ParameterDigital } from "./ParameterDigital";
import RequireAdmin from "../RequireAdmin";
import OrderModel from "../../models/OrderModel";
import { Chart } from "./Chart";
import { getNumberOfOrderReview } from "../../api/OrderReviewAPI";

const Dashboard=()=>{
    const [numberOfAccount,setNumberOfAccount] = useState(0);
    const [numberOfOrder,setNumberOfOrder] = useState(0);
    const [totalNumberBooks,setTotalNumberBooks] = useState(0);
    const [totalNumberOfReviewShop,setTotalNumberOfReviewShop] = useState(0);
    const [totalNumberOfReviews,setTotalNumberOfReviews] = useState(0);
    const [totalPrice,setTotalPrice] = useState(0);
    const [orders,setOrders] = useState<OrderModel[]>([])

    // Lấy tổng số account
    useEffect(()=>{
        getNumberOfAccount()
            .then(response=>{
                    setNumberOfAccount(response)
        }).catch(error=>{
            console.log(error);
        })
    },[])

    // Lấy tổng số hoá đơn và tổng tiền kiếm được
    useEffect(()=>{
        fetchAllOrders(-1) // -1 là lấy tất cả đơn hàng
            .then(response=>{
                if(response){
                    setOrders(response.resultOrders)
                    setNumberOfOrder(response?.totalOrders)
                    // tổng tiền kiếm được
                    const totalPriceResponse = response.resultOrders.reduce((total,orderPrice)=>{
                        return total+orderPrice.paymentCost;
                    },0)
                    setTotalPrice(totalPriceResponse);
                }
            }).catch((error) => console.log(error));
        },[])

    // Lấy tổng số sách
    useEffect(()=>{
        getNumberOfBook()
            .then(response=>{
                setTotalNumberBooks(response);
            })
            .catch((error) => console.log(error));
        },[])

    useEffect(() => { // Lấy tổng số review
		getNumberOfReview()
			.then((response) => {
				setTotalNumberOfReviews(response);
			})
			.catch((error) => console.log(error));
	}, []);

    useEffect(() => {  // Tổng số đánh giá shop
		getNumberOfOrderReview()
			.then((response) => {
				setTotalNumberOfReviewShop(response);
			})
			.catch((error) => console.log(error));
	}, []);


    return (
		<div>
			<ParameterDigital
				totalPrice={totalPrice}
				numberOfAccount={numberOfAccount}
				numberOfOrder={numberOfOrder}
				totalNumberBooks={totalNumberBooks}
				totalReviewShop={totalNumberOfReviewShop}
				totalNumberOfReviews={totalNumberOfReviews}
			/>
			<Chart orders={orders} />
		</div>
	);
};

const DashboardPage_Admin = RequireAdmin(Dashboard);
export default DashboardPage_Admin;