export const BY_MONTH = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
 ]
 
 const getLatestYear = () => {
    let year = new Date().getFullYear();
    const yearList = [];
 
    const YEAR_START = 2022; // Năm bắt đầu -> nay
    while (year !== YEAR_START - 1) {
       yearList.push(year-- + "");
    }
    return yearList.reverse();
 }
 
 export const BY_YEAR = getLatestYear();
 
 export function formatDate(date: any) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Tháng bắt đầu từ 0
    var year = date.getFullYear();
 
    // Bổ sung số 0 phía trước nếu ngày hoặc tháng chỉ có một chữ số
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
 
    return day + '/' + month + '/' + year;
 }
 
 const getLatestDate = (count: number) => {
    let today = new Date();
    let dateList = [];
    for (let i = 0; i < count; i++) {
       let currentDate = new Date(today);
       dateList.push(formatDate(new Date(currentDate.setDate(currentDate.getDate() - i))));
    }
    return dateList.reverse();
 }
 
 export const BY_LASTEST_3_DAYS = getLatestDate(3);
 export const BY_LASTEST_7_DAYS = getLatestDate(7);
 export const BY_LASTEST_15_DAYS = getLatestDate(15);
 export const BY_LASTEST_30_DAYS = getLatestDate(30);