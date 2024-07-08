import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";

export const Error403Page: React.FC = () => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return (
		<div
			className='container text-center text-black'
			style={{ height: "85vh" }}
		>
			<p className='fw-bolder ' style={{ fontSize: "200px" }}>
				403!
			</p>
			<p className='fs-2'>Bạn không có quyền vào trang này</p>
			<Link to={"/"}>
				<Button variant='contained'>Về trang chủ</Button>
			</Link>
		</div>
	);
};