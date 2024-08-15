import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const CheckoutSuccess = () => {
	return (
		<div className='container bg-light my-3 rounded-3 p-3'>
			<div className='d-flex align-items-center justify-content-center flex-column p-5'>
				<img
					src='https://cdn0.fahasa.com/skin/frontend/base/default/images/order_status/ico_successV2.svg?q=10311'
					alt='success'
				/>
				<h2 className='my-3 text-success'>
					Đơn hàng của bạn đã được tiếp nhận
				</h2>
				<p className='mb-2'>Cảm ơn bạn đã mua sản phẩm của chúng tôi</p>
				<p className='mb-2'>
					Bạn sẽ sớm nhận được email xác nhận đơn hàng từ chúng tôi
				</p>
				<Link to={"/"}>
					<Button variant='contained' className='my-3'>
						Tiếp tục mua sắm
					</Button>
				</Link>
			</div>
		</div>
	);
};