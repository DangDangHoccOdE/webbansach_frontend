import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useState } from 'react';
import OrderList from './OrderList';

const ShowOrder=()=>{

    const [isLoading,setIsLoading] = useState(false);
    const [value, setValue] = useState('1');

    const handleChange = (e:React.SyntheticEvent,newValue:string)=>{
        setValue(newValue);
    }

   
    
    return (
        <div className='container text-center' >
            <Box sx={{ width: '100%', typography: 'body1' ,maxWidth:1000,margin:"40px auto 0"}}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Tất cả" value="1" />
                            <Tab label="Chờ thanh toán" value="2" />
                            <Tab label="Vận chuyển" value="3" />
                            <Tab label="Chờ giao hàng" value="4" />
                            <Tab label="Hoàn thanh" value="5" />
                            <Tab label="Đã hủy" value="6" />
                            <Tab label="Trả hàng/Hoàn tiền" value="7" />
                        </TabList>
                        </Box>
                       <OrderList setIsLoading={setIsLoading} value={value} />
                    </TabContext>
                    </Box>
        </div>
     
      );
}

export default ShowOrder;