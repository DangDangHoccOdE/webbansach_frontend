import React, { useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import { getNumberOfStarShop } from "../../api/OrderReviewAPI";
import renderRating from "../utils/StarRate";

function About() {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

    const [shopRate,setShopRate] = useState(0);

    useEffect(()=>{
        getNumberOfStarShop()
            .then(response=>{
                setShopRate(response.averageRateShop)
            })
            .catch(error=>{
                console.error(error)
            })
    })
	return (
		<div className='w-100 h-100 d-flex align-items-center justify-content-center flex-column m-5'>
			<div className='w-50 h-50 p-3 rounded-5 shadow-4-strong bg-light'>
				<h3 className='text-center text-black'>Giới thiệu về BookStore</h3>
				<hr />
				<div className='row'>
					<div className='col-lg-8'>
						<p>
							<strong>Tên website: </strong>BookStore
						</p>
						<p>
							<strong>Địa chỉ: </strong>Số nhà x, Đường y, Thành Phố Hà Nội, Việt Nam
						</p>
						<p>
							<strong>Số điện thoại: </strong>0123123123
						</p>
						<p>
							<strong>Email: </strong>bookstore@gmail.com
						</p>
					</div>
					<div className='col-lg-4'>
						<div
							className='d-flex align-items-center justify-content-center rounded-5'
							style={{ border: "1px solid #ccc" }}
						>
							<img
								src={"./../../../logo.jpg"}
								width='150'
								alt='MDB Logo'
								loading='lazy'
							/>
						</div>
                        <div className="text-center mt-2">
                           {renderRating(shopRate)}
                        </div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;