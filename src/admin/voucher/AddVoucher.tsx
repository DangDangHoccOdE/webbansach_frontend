import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import RequireAdmin from "../RequireAdmin"
import getBase64 from "../../layouts/utils/GetBase64";
import fetchWithAuth from "../../layouts/utils/AuthService";
import useScrollToTop from "../../hooks/ScrollToTop";
import {
    Container,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Alert,
    Grid,
    Paper,
    SelectChangeEvent
  } from '@mui/material';
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
                    setNotice("Lỗi không thể tạo voucher!");
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
    const handleChangeTypeVoucher = (event: SelectChangeEvent) => {
        setVoucher({ ...voucher, typeVoucher: event.target.value as string });
      };

    
  return (
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
  );
};
    

const AddVoucher_Admin = RequireAdmin(AddVoucher)
export default AddVoucher_Admin