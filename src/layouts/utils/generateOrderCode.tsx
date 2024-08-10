

function generateOrderCode() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Lấy 2 số cuối của năm
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng, thêm 0 nếu cần
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm 0 nếu cần
    
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    
    for (let i = 0; i < 8; i++) { // Tạo ra chuỗi 8 ký tự ngẫu nhiên
        randomPart += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    
    return `${year}${month}${day}${randomPart}`;
}
export default generateOrderCode;