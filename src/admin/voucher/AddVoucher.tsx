import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import getBase64 from "../../layouts/utils/GetBase64";
import fetchWithAuth from "../../layouts/utils/AuthService";
import useScrollToTop from "../../hooks/ScrollToTop";

const AddVoucher :React.FC=()=>{
    const [errorDiscountValue,setErrorDiscountValue] = useState("")
    const [errorExpiredDate,setErrorExpiredDate] = useState("")
    const [notice,setNotice] = useState("")
    const [image,setImage] = useState<string|null>(null)
    const [hasCalled,setHasCalled] = useState(false);
    const [isError,setIsError] = useState(false);
    useScrollToTop();

    const [voucher,setVoucher] = useState({
        code:"",
        describe:"",
        discountValue:0,
        quantity:0,
        expiredDate:"",
        voucherImage:image,
        isActive:true,
        isAvailable:false,
        typeVoucher:""
    })

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
            try{
                setHasCalled(true);
                setNotice("Đang xử lý...")
                setIsError(true);

                const url:string=`http://localhost:8080/vouchers/addVoucherAdmin`
                const response = await fetchWithAuth(url,{
                    method:"POST",
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
                    setNotice(data.content || "Lỗi không thể tạo voucher!");
                }
            }catch(error){
                setNotice("Đã xảy ra lỗi trong quá trình đăng ký tài khoản!")
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
        const nowDate = new Date()
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

    const handleChangeTypeVoucher=(e:ChangeEvent<HTMLSelectElement>)=>{ // Xử lý thay đổi loại voucher
        setVoucher({...voucher,typeVoucher:e.target.value})
    }

    return(
        <div className="container">
            <h1 className="mt-5 text-center">Thêm voucher</h1>
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
                    <label htmlFor="typeVoucher" className="form-label">Loại voucher</label> <span style={{color:"red"}}> *</span>
                    <select value={voucher.typeVoucher}  className=" form-select" onChange={handleChangeTypeVoucher}>
                        <option value="Voucher sách">Voucher sách</option>
                        <option value="Voucher vận chuyển">Voucher vận chuyển</option>
                    </select>
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

const AddVoucher_Admin = RequireAdmin(AddVoucher)
export default AddVoucher_Admin