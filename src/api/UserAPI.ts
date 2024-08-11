import fetchWithAuth from "../layouts/utils/AuthService";
import UserModel from "../models/UserModel";

export async function getUser(link: string): Promise<UserModel | null> {
  try {
    const response = await fetchWithAuth(link);

    const userData = await response.json();
    console.log(userData)
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

export async function getUserByOrderId(orderId: number): Promise<UserModel | null> {
  const url: string = `http://localhost:8080/orders/${orderId}/user`;
    return getUser(url);
}

export async function getUserByUsername(username: string): Promise<UserModel | null> {
  const url: string = `http://localhost:8080/user/findUserByUsername?username=${username}`;
    return getUser(url);
}

export async function getAllUserByAdmin(): Promise<UserModel[] | null> {
  const url: string = `http://localhost:8080/users`;
  const result:UserModel[] = [];

  const response = await fetchWithAuth(url);

  if(!response.ok){
    throw new Error(`Không thể truy cập ${url} !`);
  }

  const data = await response.json();

  // get all users
  const responseData = data._embedded.users;

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
      active:responseData[key].active
    });
  }

  return result;
}
