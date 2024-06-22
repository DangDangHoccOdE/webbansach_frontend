class UserModel{
    userId:number;
    firstName:string;
    lastName:string;
    userName:string;
    phoneNumber:string;
    password:string;
    sex:string;
    email:string;
    deliveryAddress:string;
    purchaseAddress:string;
    avatar:string;

    constructor(
        userId:number,
        firstName:string,
        lastName:string,
        userName:string,
        phoneNumber:string,
        password:string,
        sex:string,
        email:string,
        deliveryAddress:string,
        purchaseAddress:string,
        avatar:string
    ){
        this.userId=userId;
        this.firstName=firstName;
        this.lastName=lastName;
        this.userName=userName;
        this.phoneNumber=phoneNumber;
        this.password=password;
        this.sex=sex;
        this.email=email;
        this.deliveryAddress=deliveryAddress;
        this.purchaseAddress=purchaseAddress;
        this.avatar =avatar;
    }
}

export default UserModel;
