import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert
} from '@mui/material';

const FormForgotPassword=()=>{
    const {username} = useParams();
    const [password,setPassword] = useState("")
    const [duplicatePassword,setDuplicatePassword] = useState("")
    const [errorPassword,setErrorPassword] = useState("")
    const [errorDuplicatePassword,setErrorDuplicatePassword] = useState("")
    const [isError,setIsError] = useState(false);
    const [notice,setNotice] = useState("")

    useScrollToTop()

  // password
  const checkPassword =  (password:string)=>{
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if(!passwordRegex.test(password)){
        setErrorPassword("Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)");
        return true;
    }else{
        setErrorPassword("");
        return false;
    }
}

const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(e.target.value);
    setErrorPassword("");

    return checkPassword(e.target.value);
}

   // duplicate password
   const checkDuplicatePassword =  (duplicatePassword:string)=>{
    if(duplicatePassword !==(password)){
        setErrorDuplicatePassword("Mật khẩu không trùng khớp!");
        return true;
    }else{
        setErrorDuplicatePassword("");
        return false;
    }
}

const handleDuplicatePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setDuplicatePassword(e.target.value);
    setErrorDuplicatePassword("");

    return checkDuplicatePassword(e.target.value);
}

    const handleSubmit= async(e:React.FormEvent)=>{
        e.preventDefault();
        setNotice("")
        try{
            const url:string="http://localhost:8080/user/passwordChange";
            const response = await fetch(url,{
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify({
                    username,
                    password,
                    duplicatePassword
                })
            });

            const data = await response.json();
            if(response.ok){
                setNotice(data.content);
                setIsError(false);
            }else{
                setNotice(data.content);
                setIsError(true);
            }
        }catch(error){
            setIsError(true);
            setNotice("Lỗi, Không thể thay đổi mật khẩu!");
        }
    }
    return (
        <Container maxWidth="sm">
          <Box sx={{ mt: 5, mb: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Thay đổi mật khẩu
            </Typography>
            <Paper elevation={3} sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nhập mật khẩu mới"
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  margin="normal"
                  error={!!errorPassword}
                  helperText={errorPassword}
                />
                <TextField
                  fullWidth
                  label="Nhập lại mật khẩu mới"
                  type="password"
                  id="duplicatePassword"
                  value={duplicatePassword}
                  onChange={handleDuplicatePasswordChange}
                  required
                  margin="normal"
                  error={!!errorDuplicatePassword}
                  helperText={errorDuplicatePassword}
                />
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Lưu
                  </Button>
                </Box>
                {notice && (
                  <Alert 
                    severity={isError ? "error" : "success"} 
                    sx={{ mt: 2 }}
                  >
                    {notice}
                  </Alert>
                )}
              </form>
            </Paper>
          </Box>
        </Container>
      );
    };
    
    export default FormForgotPassword;