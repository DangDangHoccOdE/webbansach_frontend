import React, { useState } from "react";
import { getUserByCondition } from "../../api/UserAPI";
import MaskEmail from "../../layouts/utils/MaskEmail";
import useScrollToTop from "../../hooks/ScrollToTop";
import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { confirm } from "material-ui-confirm";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState("");
  const [notice, setNotice] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useScrollToTop();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const result = await getUserByCondition(username);
      if (result !== null) {
        setNotice("Tài khoản hợp lệ!");
        setIsError(false);
  
        const maskedEmail = MaskEmail(result.email);
  
        confirm({
          title: "Quên mật khẩu",
          description: `Chúng tôi sẽ gửi link xác nhận đến email ${maskedEmail}`,
          confirmationText: "Đồng ý",
          cancellationText: "Hủy"
        }).then(() => {
          toast.promise(
            fetch("http://localhost:8080/user/forgotPassword", {
              method: "POST",
              headers: {
                'Content-type': 'application/json',
              },
              body: JSON.stringify({ username: username })
            }).then(response => {
              if (response.ok) {
                setNotice("Đã gửi email thành công!");
                setIsError(false);
              } else {
                throw new Error("Lỗi gửi email");
              }
            }),
            {
              pending: "Đang trong quá trình xử lý...",
              success: "Đã gửi email thành công!",
              error: "Lỗi khi gửi email"
            }
          );
        }).catch(() => {
          // Người dùng chọn Hủy
          setIsError(true);
          setNotice("Thao tác đã bị hủy");
        });
      } else {
        throw new Error("Không tìm thấy tài khoản");
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setNotice(error instanceof Error ? error.message : "Không tìm thấy tài khoản hoặc không thể gửi email!");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Quên mật khẩu
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nhập tài khoản"
              variant="outlined"
              required
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
            />
            {notice && (
              <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
                {notice}
              </Alert>
            )}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading || !username}
              >
                {isLoading ? "Đang xử lý..." : "Tiếp"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;