import { useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../RequireAdmin"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import VoucherModel from "../../models/VoucherModel";
import { getVoucherById } from "../../api/VoucherAPI";
import fetchWithAuth from "../../layouts/utils/AuthService";
import getBase64 from "../../layouts/utils/GetBase64";
import useScrollToTop from "../../hooks/ScrollToTop";
import { Alert, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";

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
    const [errorMinimumSingleValue,setErrorMinimumSingleValue] = useState("")
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
        isAvailable:false,
        typeVoucher:"",
        minimumSingleValue:0,
        maximumOrderDiscount:0
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
                isAvailable: findVoucher.isAvailable || false,
                typeVoucher:findVoucher.typeVoucher || "",
                minimumSingleValue:findVoucher.minimumSingleValue || 0,
                maximumOrderDiscount:findVoucher.maximumOrderDiscount || 0
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
        setErrorMinimumSingleValue("")

        const discountValueValid = !handleDiscountPercent();
        const expiredDateValid = !handleExpiredDate();
        const minimumSingleValueValid = !handleChangeMinimumSingleValue();

        if(discountValueValid && expiredDateValid && minimumSingleValueValid){
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
                    setNotice(data.content);
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

    const handleChangeMinimumSingleValue=()=>{  // Xử lý giá trị đơn tối thiểu
      if(voucher.minimumSingleValue<0){
          setErrorMinimumSingleValue("Đơn tối thiểu 0đ!")
          return true;
      }else{
        setErrorMinimumSingleValue("");
          return false;
      }
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

    
    const handleChangeTypeVoucher=(e:SelectChangeEvent)=>{ // Xử lý thay đổi loại voucher
        setVoucher({...voucher,typeVoucher:e.target.value})
    }

    return(
        <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Thêm voucher
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="voucherCode"
                label="Mã voucher"
                value={voucher.code}
                onChange={(e) => setVoucher({...voucher, code: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="describe"
                label="Mô tả"
                value={voucher.describe}
                onChange={(e) => setVoucher({...voucher, describe: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="discountValue"
                label="Phần trăm giảm giá"
                type="number"
                value={voucher.discountValue}
                onChange={(e) => setVoucher({...voucher, discountValue: parseInt(e.target.value)})}
                onBlur={handleDiscountPercent}
                error={!!errorDiscountValue}
                helperText={errorDiscountValue}
              />
            </Grid>
            <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="maximumOrderDiscount"
                      label="Giảm tối đa (Để là 0 nếu muốn giảm theo % giảm giá"
                      type="number"
                      value={voucher.maximumOrderDiscount}
                      onChange={(e) => setVoucher({...voucher, maximumOrderDiscount: parseFloat(e.target.value)})}
                    />
                 </Grid>
            <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="discountValue"
                      label="Đơn tối thiểu"
                      type="number"
                      value={voucher.minimumSingleValue}
                      onChange={(e) => setVoucher({...voucher, minimumSingleValue: parseFloat(e.target.value)})}
                      onBlur={handleChangeMinimumSingleValue}
                      error={!!errorMinimumSingleValue}
                      helperText={errorMinimumSingleValue}
                    />
                 </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="quantity"
                label="Số lượng"
                type="number"
                value={voucher.quantity}
                onChange={(e) => setVoucher({...voucher, quantity: parseInt(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth   
                    id="expiredDate"
                    label="Ngày hết hạn"
                    type="date"
                    value={voucher.expiredDate}
                    onChange={(e) => setVoucher({...voucher, expiredDate: e.target.value})}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: new Date().toISOString().split('T')[0] // Đặt ngày tối thiểu là ngày hiện tại
                    }}
                    />
              {errorExpiredDate && (
                <Typography color="error" variant="caption">
                  {errorExpiredDate}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="typeVoucher-label">Loại voucher</InputLabel>
                <Select
                  labelId="typeVoucher-label"
                  id="typeVoucher"
                  value={voucher.typeVoucher}
                  label="Loại voucher"
                  onChange={handleChangeTypeVoucher}
                >
                  <MenuItem value="Voucher sách">Voucher sách</MenuItem>
                  <MenuItem value="Voucher vận chuyển">Voucher vận chuyển</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
              >
                Tải lên ảnh voucher
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleVoucherImage}
                />
              </Button>
              {voucher.voucherImage && (
                <Box mt={2} textAlign="center">
                  <img src={voucher.voucherImage} alt="Ảnh voucher" style={{ maxWidth: "50px", maxHeight: "50x" }} />
                </Box>
              )}
            </Grid>
          </Grid>
          {notice && (
          <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
            {notice}
          </Alert>
        )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Lưu
          </Button>
        </Box>
       
      </Paper>
    </Container>
        )
        }

const EditVoucherAdmin = RequireAdmin(EditVoucher);
export default EditVoucherAdmin;