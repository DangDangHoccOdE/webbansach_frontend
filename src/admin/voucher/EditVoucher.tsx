import { useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import VoucherModel from "../../models/VoucherModel";
import { getVoucherById } from "../../api/Voucher";
import fetchWithAuth from "../../layouts/utils/AuthService";
import getBase64 from "../../layouts/utils/GetBase64";
import useScrollToTop from "../../hooks/ScrollToTop";

const EditVoucher:React.FC=()=>{
    const {voucherId} = useParams();
    const voucherIdNumber = parseInt(voucherId+'')
    const [findVoucher,setFindVoucher] = useState<VoucherModel|null>(null);
    const navigate = useNavigate();
    useScrollToTop();

    useEffect(()=>{
        const getVoucher = async ()=>{
            try{
                const data = await getVoucherById(voucherIdNumber);
                if(!data){
                    navigate("error-404",{replace:true});
                    return;
                }else{
                    setFindVoucher(data);
                }
            }catch(error){
                console.log({error})
                navigate("error-404");
            }
            
        }

        getVoucher();
    },[navigate, voucherIdNumber])

    const [errorDiscountValue,setErrorDiscountValue] = useState("")
    const [errorExpiredDate,setErrorExpiredDate] = useState("")
    const [notice,setNotice] = useState("")
    const [image,setImage] = useState<string|null>(null)
    const [hasCalled,setHasCalled] = useState(false);
    const [isError,setIsError] = useState(false);

    const [voucher,setVoucher] = useState({
        voucherId:0,
        code:"",
        describe:"",
        discountValue:0,
        quantity:0,
        expiredDate:"",
        voucherImage:"",
        isActive:true,
    })

    useEffect(() => {
        if (findVoucher) {
            setVoucher({
                voucherId:findVoucher.voucherId||0,
                code: findVoucher.code || "",
                describe: findVoucher.describe || "",
                discountValue: findVoucher.discountValue || 0,
                quantity: findVoucher.quantity || 0,
                expiredDate: findVoucher.expiredDate || "",
                voucherImage: findVoucher.voucherImage || "",
                isActive: findVoucher.isActive || true,
            });
        }
    }, [findVoucher]);

    useEffect(()=>{
        if(image){
            setVoucher(prevVoucher=>({...prevVoucher,voucherImage:image}))
        }
    },[image])

    const handleSubmit=async(e:FormEvent)=>{
        e.preventDefault();

        if(hasCalled){
            setNotice("Đang xử lý...");
            setIsError(false);
            return
        }

        setErrorDiscountValue("")
        setErrorExpiredDate("");

        const discountValueValid = !handleDiscountPercent();
        const expiredDateValid = !handleExpiredDate();

        if(discountValueValid && expiredDateValid){
            console.log(voucher)
            try{
                setHasCalled(true);
                setNotice("Đang xử lý...")
                setIsError(true);
                const url:string=`http://localhost:8080/vouchers/editVoucherAdmin/${voucherIdNumber}`
                const response = await fetchWithAuth(url,{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body:JSON.stringify(
                        voucher
                    )
                })

                const data = await response.json();
                if(response.ok){
                    setIsError(false);
                    setNotice(data.content)
                }else{
                    setIsError(true);
                    setNotice(data.content || "Lỗi không thể chỉnh sửa voucher!");
                }
            }catch(error){
                console.log({error})
                setIsError(true);
            }finally{
                setHasCalled(false);
            }
        }
    }

    const handleDiscountPercent=()=>{  // Xử lý phần trăm voucher
        if(voucher.discountValue>100 || voucher.discountValue<0){
            setErrorDiscountValue("Phần trăm giảm giá không hợp lệ!")
            return true;
        }else{
            setErrorDiscountValue("");
            return false;
        }
    }

    const handleExpiredDate=()=>{  // Xử lý ngày hết hạn voucher
        const regex =  /\d{4}-\d{2}-\d{2}/;
        if(!regex.test(voucher.expiredDate)){
            setErrorExpiredDate("Ngày hết hạn không đúng định dạng !");
            return true;
        }

        const minDate = new Date("1900-01-01");
        const nowDate = new Date();
        nowDate.setDate(nowDate.getDate()-1);
        const expiredDate = new Date(voucher.expiredDate);
        if(minDate > expiredDate || expiredDate<nowDate){
            setErrorExpiredDate("Ngày hết hạn không hợp lệ!")
            return true;
        }
            setErrorExpiredDate("");
            return false;
    }

    const handleVoucherImage=async(e:ChangeEvent<HTMLInputElement>)=>{ // Xử lý ảnh voucher
        if(e.target.files){
            const fileChoose = e.target.files[0];
            console.log("File: ",fileChoose)
            if(fileChoose){
                try{
                    const base64VoucherImage = await getBase64(fileChoose);
                    setImage(base64VoucherImage);
                }catch(error){
                    console.error('Lỗi khi chuyển đổi sang base64:', error);
                    return null;
                }
            }
        }
    }

    return(
        <div className="container">
            <h1 className="mt-5 text-center">Chỉnh sửa voucher</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-3">
                        <label htmlFor="voucherCode" className="form-label">Mã voucher</label> <span style={{color:"red"}}> *</span>
                        <input 
                            type="text"
                            id="voucherCode"
                            className="form-control"
                            value={voucher.code} 
                            onChange={(e) => setVoucher({...voucher,code:e.target.value})}
                            required
                        />
                    </div> 
                <div className="mb-3">
                <label htmlFor="firstName" className="form-label">Mô tả</label> <span style={{color:"red"}}> *</span>
                    <input  
                        type="text"
                        id="describe"
                        className="form-control"
                        value={voucher.describe} 
                        onChange={(e) => setVoucher({...voucher,describe:e.target.value})}
                        required
                    />
                </div>  
                <div className="mb-3">
                <label htmlFor="dateOfBirth" className="form-label">Phần trăm giảm giá</label> <span style={{color:"red"}}> *</span>
                    <input  
                        type="number"
                        id="discountValue"
                        value={voucher.discountValue}
                        className="form-control"
                        onChange={e=>setVoucher({...voucher,discountValue:parseInt(e.target.value)})}
                        onBlur={handleDiscountPercent}
                        required
                    />
                <div style={{color:"red"}}>{errorDiscountValue}</div>

                </div> 
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Số lượng</label> <span style={{color:"red"}}> *</span>
                    <input 
                        type="number"
                        id="quantity"
                        className="form-control"
                        value={voucher.quantity} 
                        onChange={e=>setVoucher({...voucher,quantity:parseInt(e.target.value)})}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="expiredDate" className="form-label">Ngày hết hạn</label> <span style={{color:"red"}}> *</span>
                    <input 
                        type="date"
                        id="expiredDate"
                        className="form-control"
                        value={voucher.expiredDate} 
                        onChange={e=>setVoucher({...voucher,expiredDate:e.target.value})}
                        required
                    />
                    <div style={{color:"red"}}>{errorExpiredDate}</div>

                </div>
                <div className="mb-3">
                    <label htmlFor="avatar" className="form-label">Ảnh voucher</label> <span style={{color:"red"}}> *</span>
                    <input type="file" id="avatar"className="form-control mb-3" accept="image/**"onChange={handleVoucherImage} required></input>
                    {
                        voucher.voucherImage && <img src={voucher.voucherImage} alt="Ảnh voucher" style={{width:"100px"}}></img>
                    }
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Lưu</button> 
                    <div style={{color: isError ? "red" : "green"}}>{notice}</div> 
                </div>
            </form>
        </div>
    </div>
        )
        }

const EditVoucherAdmin = RequireAdmin(EditVoucher);
export default EditVoucherAdmin;