
const handleUpdateIsActiveFromVoucher=async(voucherId:number)=>{
        try{
            const url:string=`http://localhost:8080/vouchers/updateIsActive/${voucherId}`
            const response = await fetch(url,{
                method:"PUT",
                headers:{
                    "Content-type":"application/json"
                }
            })
            const data = await response.json();
            if(response.ok){
                return data;
            }else
            if(!response.ok){
                alert("Lỗi, không thể cập nhật trạng thái voucher!")
                return null;
            }
        }catch(error){
            console.log({error})
            alert("Lỗi, không thể cập nhật trạng thái voucher!")
            return null;
        }
}

export default handleUpdateIsActiveFromVoucher;