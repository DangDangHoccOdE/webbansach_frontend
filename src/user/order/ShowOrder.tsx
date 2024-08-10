import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import {Container, Tabs } from '@mui/material';
import { useState } from 'react';
import OrderList from './OrderList';

const ShowOrder = () => {
  const [value, setValue] = useState('1');

  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4}}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
        <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
          >
              <Tab label="Tất cả" value="1" />
              <Tab label="Chờ thanh toán" value="2" />
              <Tab label="Đang xử lý" value="3" />
              <Tab label="Đang vận chuyển" value="4" />
              <Tab label="Đã giao" value="5" />
              <Tab label="Đã hủy" value="6" />
              <Tab label="Trả hàng/Hoàn tiền" value="7" />
              </Tabs>
          </Box>
          <OrderList value={value} />
        </TabContext>
      </Box>
  
    </Container>
  );
}

export default ShowOrder;