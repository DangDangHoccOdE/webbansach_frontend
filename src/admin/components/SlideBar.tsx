/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { getUserIdByToken, logout } from "../../layouts/utils/JwtService";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LocalOffer } from "@mui/icons-material";


export const SlideBar: React.FC = () => {
	const { setLoggedIn } = useAuth();
	const userId = getUserIdByToken();

	return (
		<div
			className='position-fixed bg d-flex flex-column justify-content-between min-vh-100'
			style={{ zIndex: "100",backgroundColor:"#1a237e" }}
		>
			<div className='px-3'>
				<a
					className='text-decoration-none d-flex align-items-center text-white d-none d-sm-flex align-items-sm-center justify-content-center'
					href='#' style={{marginTop:"2px"}}
				>
					<img
						src='./../../../logo.jpg'
						alt=''
						width={150}
					
					/>
				</a>
				<hr className='text- white d-none d-sm-block d-md-block' />
				<ul className='nav nav-pills flex-column' id='parentM'>
					<li className='nav-item'>
						<NavLink
							to={"/admin/dashboard"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<DashboardIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Dashboard
							</span>
						</NavLink>
					</li>
					<li className='nav-item'>
						<NavLink
							to={"/admin/bookManagement"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<MenuBookRoundedIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý Sách
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/admin/categoryManagement"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<CategoryRoundedIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý thể loại
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/admin/userManagement"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<ManageAccountsIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý tài khoản
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/admin/orderManagement"}
							className={`nav-link d-flex align-items-center justify-content-center `}
						>
							<LocalMallRoundedIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý đơn hàng
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/admin/orderReviewManagement"}
							className={`nav-link d-flex align-items-center justify-content-center `}
						>
							<FeedbackIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý đánh giá shop
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/admin/voucherManagement"}
							className={`nav-link d-flex align-items-center justify-content-center `}
						>
							<LocalOffer fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Quản lý Voucher
							</span>
						</NavLink>
					</li>
				</ul>
			</div>
			<div className='dropdown open text-center'>
				<a
					className='my-3 btn border-0 dropdown-toggle text-white d-inline-flex align-items-center justify-content-center'
					type='button'
					id='triggerId'
					data-bs-toggle='dropdown'
					aria-haspopup='true'
					aria-expanded='false'
				>
					<PersonIcon fontSize='small' />
					<span className='ms-2'>ADMIN</span>
				</a>
				<div className='dropdown-menu' aria-labelledby='triggerId'>
					<Link
						className='dropdown-item'
						style={{ cursor: "pointer" }}
						to={`/user/info/${userId}`}
					>
						Thông tin cá nhân
					</Link>
					<a
						className='dropdown-item'
						style={{ cursor: "pointer" }}
						onClick={() => {
							setLoggedIn(false);
							logout();
						}}
					>
						Đăng xuất
					</a>
				</div>
			</div>
		</div>
	);
};