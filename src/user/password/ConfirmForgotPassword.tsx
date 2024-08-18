import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormForgotPassword from "./FormChangePassword";
import useScrollToTop from "../../hooks/ScrollToTop";
import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";

const ConfirmForgotPassword=()=>{
    const {username,forgotPasswordCode} = useParams();
    const [isError,setIsError] = useState(false)
    const [notice,setNotice] = useState("")
    const [isLoading,setIsLoading] = useState(false);

    useScrollToTop();

    useEffect(()=>{
        setIsLoading(true);
        const confirm = async()=>{
            const url:string=`http://localhost:8080/user/confirmForgotPassword?username=${username}&forgotPasswordCode=${forgotPasswordCode}`;
            try{
                const response = await fetch(url,{
                    method:"GET",
                    headers:{
                        "Content-type":"application/json"
                    },
                })
        
                const data = await response.json();
                if(response.ok){
                    setIsError(false);
                }else{
                    setIsError(true);
                    setNotice(data.content);
                }
            }catch(error){
                setIsError(true);
                setNotice("Đã có lỗi xảy ra!");
                console.log("Lỗi ",error)
            }finally{
                setIsLoading(false)
            }
        }
        confirm();
    },[username,forgotPasswordCode])

    return(
        <Container maxWidth="sm">
      <Box sx={{ mt: 5, mb: 4, textAlign: 'center' }}>
       {
        isError &&
                <Typography variant="h4" gutterBottom>
                Xác nhận quên mật khẩu
            </Typography>
       } 
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {notice}
          </Alert>
        ) : (
          <FormForgotPassword />
        )}
      </Box>
    </Container>
  );
};

export default ConfirmForgotPassword;