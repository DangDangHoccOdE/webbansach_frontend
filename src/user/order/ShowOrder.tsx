import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Backdrop, CircularProgress, Container } from '@mui/material';
import { useState } from 'react';
import OrderList from './OrderList';

const ShowOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('1');

  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
        <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="Order status tabs">
              <Tab label="Tất cả" value="1" />
              <Tab label="Chờ thanh toán" value="2" />
              <Tab label="Vận chuyển" value="3" />
              <Tab label="Hoàn thành" value="4" />
              <Tab label="Đã hủy" value="5" />
              <Tab label="Trả hàng/Hoàn tiền" value="6" />
            </TabList>
          </Box>
          <OrderList setIsLoading={setIsLoading} value={value} />
        </TabContext>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}

export default ShowOrder;