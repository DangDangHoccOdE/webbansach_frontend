import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";
import VoucherModel from "../../models/VoucherModel";
import { getVoucherQuantityFromVoucherUser, showAllVouchers_User } from "../../api/VoucherAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import VouchersProps from "../../layouts/voucher/VouchersProps";
import { updateVoucher } from "../../layouts/voucher/UpdateIsActiveFromVoucher";
import { useAuth } from "../../context/AuthContext";

const ShowVoucherUser =()=>{
    const [isLoading,setIsLoading] = useState(false);
    const [allVouchers,setAllVouchers] = useState<VoucherModel[]>([])
    const [notice,setNotice] = useState("");
    const {userId} = useParams();
    const userIdNumber = parseInt(userId+"")
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const [findVoucherName,setFindVoucherName] = useState("")
    const [temporaryVoucherName,setTemporaryVoucherName] = useState("")
    const [voucherQuantityFromUserVoucher,setVoucherQuantityFromUserVoucher] = useState<Map<number,number>>(new Map())
    
    useEffect(() => {
        if (!isLoggedIn || Number.isNaN(userIdNumber)) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchVoucherQuantities = async () => {
            try {
                const data = await getVoucherQuantityFromVoucherUser(userIdNumber);
                if (!data) {
                    navigate("/error-404", { replace: true });
                } else {
                    setVoucherQuantityFromUserVoucher(data);
                }
            } catch (error) {
                console.error({ error });
                navigate("/error-404", { replace: true });
            }
        };

        fetchVoucherQuantities();
    }, [isLoggedIn, navigate,userIdNumber]);

    useEffect(() => {
        if (userId) {
            const getVouchers = async () => {
                setIsLoading(true);
                try {
                    const fetchVouchers = await showAllVouchers_User(findVoucherName, userIdNumber);
                    if(fetchVouchers === null){
                        navigate("/error-404", { replace: true });
                        return;
                    }
               
                    const update = await updateVoucher(fetchVouchers);
                    const filterVoucher = update.filter(voucher =>
                        voucherQuantityFromUserVoucher.has(voucher.voucherId) &&
                        voucherQuantityFromUserVoucher.get(voucher.voucherId)! > 0
                        && voucher.isActive
                    );
                    if (filterVoucher.length === 0) {
                        setNotice("Bạn hiện chưa có voucher nào.");
                        setAllVouchers([]);
                        return;
                    }
                    setAllVouchers(filterVoucher);
                    setNotice(""); 
                } catch (error) {
                    console.error({ error });
                    navigate("/error-404", { replace: true });
                } finally {
                    setIsLoading(false);
                }
            };

            getVouchers();
        }
        
    }, [findVoucherName, userIdNumber, voucherQuantityFromUserVoucher, navigate, userId]);

    const handleFindVoucher = (e: ChangeEvent<HTMLInputElement>) => {
        setTemporaryVoucherName(e.target.value);
    };

    const handleFindVoucherName = useCallback(() => {
        setFindVoucherName(temporaryVoucherName);
    }, [temporaryVoucherName]);

    const handleEnterFindVoucherName = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleFindVoucherName();
        }
    };

    return(
            <div className="container">
            <h1 className="mt-4 mb-4">Kho Voucher</h1>
            <div className="d-flex justify-content-end">
                <Link to={`/vouchers`} style={{textDecoration:"none",color:"orange"}}>Tìm thêm voucher</Link>
                <span style={{margin: "0 10px"}}> | </span>
                <Link to={`/user/vouchers/historyVouchers/${userIdNumber}`} style={{textDecoration:"none",color:"orange"}}> Xem lịch sử voucher</Link>
            </div>
            <div className="d-flex justify-content-center mb-2">
                <label htmlFor="findVoucher"className="form-label me-2">Mã Voucher</label>
                <input type="text" id="findVoucher" className="form-control-sm me-2" onChange={handleFindVoucher} value={temporaryVoucherName} placeholder="Nhập mã voucher của bạn vào đây" onKeyPress={handleEnterFindVoucherName}></input>
                <button type="submit" className="btn btn-secondary" onClick={handleFindVoucherName}>Áp dụng</button>
            </div>
            <br/>
            {isLoading && <div className="text-center"><div className="spinner-border" role="status"></div></div>} 

            <VouchersProps notice={notice} showQuantity={voucherQuantityFromUserVoucher} vouchers={allVouchers} showSaveVoucher={false} showRelateHistoryVoucher={false}/>            

        </div>
)      
}

export default ShowVoucherUser;