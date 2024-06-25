import UserModel from "../models/UserModel";

export async function getUser(link: string): Promise<UserModel | null> {
  try {
    const response = await fetch(link);

    const userData = await response.json();
    if (userData) {
      return {
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        dateOfBirth:userData.dateOfBirth,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        sex: userData.sex,
        email: userData.email,
        deliveryAddress: userData.deliveryAddress,
        purchaseAddress: userData.purchaseAddress,
        avatar: userData.avatar
      };
    } else {
      throw new Error("Người dùng không tồn tại!");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
}

export async function getUserByRemark(remarkId: number): Promise<UserModel | null> {
  const url: string = `http://localhost:8080/remarks/${remarkId}/user`;
    return getUser(url);
}

export async function getUserByUsername(username: string): Promise<UserModel | null> {
  const url: string = `http://localhost:8080/users/search/findByUserName?userName=${username}`;
    return getUser(url);
}
