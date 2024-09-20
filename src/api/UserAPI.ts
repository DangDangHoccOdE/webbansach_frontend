import fetchWithAuth from "../layouts/utils/AuthService";
import UserModel from "../models/UserModel";
interface UserProps{
    totalPages:number,
    totalUsers:number,
    resultUsers:UserModel[]
}

export async function getUser(link: string): Promise<UserModel | null> {
  try {
    const response = await fetchWithAuth(link);

    const userData = await response.json();
    if (response.ok) {
      if (userData) {
        return {
          userId: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          dateOfBirth: userData.dateOfBirth,
          phoneNumber: userData.phoneNumber,
          password: userData.password,
          sex: userData.sex,
          email: userData.email,
          deliveryAddress: userData.deliveryAddress,
          purchaseAddress: userData.purchaseAddress,
          avatar: userData.avatar,
          active: userData.active,
          authProvider:userData.authProvider
        };
      } else {
        throw new Error("Người dùng không tồn tại!");
      }
    } else {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
}

export async function getUserByReviewId(reviewId: number): Promise<UserModel | null> {
  const url: string = `http://localhost:8080/reviews/${reviewId}/user`;
    return getUser(url);
}

export async function getUserByUserId(userId: number): Promise<UserModel | null> {
  const url: string = `http://localhost:8080/user/${userId}`;
    return getUser(url);
}

export async function getUserByOrderId(orderId: number): Promise<UserModel | null> {
  const url: string = `http://localhost:8080/orders/${orderId}/user`;
    return getUser(url);
}

export async function getUserByCondition(condition: string,isSearchEmail:boolean): Promise<UserModel | null> {
  let url: string = `http://localhost:8080/user/findUserByCondition?condition=${condition}`;
  if(!isSearchEmail){ 
    url = `http://localhost:8080/user/findByUserName?username=${condition}`
  }
  try {
    const response = await fetch(url);

    const userData = await response.json();
    if (response.ok) {
      if (userData) {
        return {
          userId: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          dateOfBirth: userData.dateOfBirth,
          phoneNumber: userData.phoneNumber,
          password: userData.password,
          sex: userData.sex,
          email: userData.email,
          deliveryAddress: userData.deliveryAddress,
          purchaseAddress: userData.purchaseAddress,
          avatar: userData.avatar,
          active: userData.active,
          authProvider:userData.authProvider
        };
      } else {
        throw new Error("Người dùng không tồn tại!");
      }
    } else {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
}

export async function getAllUserByAdmin(currentPage:number): Promise<UserProps> {
  const size:number=8
  let url:string=''

    url = `http://localhost:8080/users?sort=userId,asc&size=${size}&page=${currentPage}`;

  const result:UserModel[] = [];

  const response = await fetchWithAuth(url);

  if(!response.ok){
    throw new Error(`Không thể truy cập ${url} !`);
  }

  const data = await response.json();

  // get all users
  const responseData = data._embedded.users;

     // total pages
     const totalPages:number = data.page.totalPages;
     const totalUsers:number = data.page.totalElements;

  for(const key in responseData){
    result.push({
      userId:responseData[key].userId,
      firstName:responseData[key].firstName,
      lastName:responseData[key].lastName,
      userName:responseData[key].userName,
      dateOfBirth:responseData[key].dateOfBirth,
      phoneNumber:responseData[key].phoneNumber,
      sex:responseData[key].sex,
      email:responseData[key].email,
      deliveryAddress:responseData[key].deliveryAddress,
      purchaseAddress:responseData[key].purchaseAddress,
      avatar:responseData[key].avatar,
      password:responseData[key].password,
      active:responseData[key].active,
      authProvider:responseData[key].authProvider
    });
  }

  return {resultUsers:result, totalPages:totalPages, totalUsers:totalUsers};
}

export async function getNumberOfAccount(): Promise<number> {
  const url: string = `http://localhost:8080/users/search/countBy`;
   try {
      const response = await fetchWithAuth(url);
      const data = await response.json();
      if (data) {
         return data;
      }
   } catch (error) {
      throw new Error("Lỗi không gọi được endpoint lấy tổng user\n" + error);
   }
   return 0;
}


