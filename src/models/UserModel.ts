class UserModel{
    userId:number;
    firstName:string;
    lastName:string;
    userName:string;
    dateOfBirth:string;
    phoneNumber:string;
    password:string;
    sex:string;
    email:string;
    deliveryAddress:string;
    purchaseAddress:string;
    avatar:string;
    active:boolean

    constructor(
        userId:number,
        firstName:string,
        lastName:string,
        userName:string,
        dateOfBirth:string,
        phoneNumber:string,
        password:string,
        sex:string,
        email:string,
        deliveryAddress:string,
        purchaseAddress:string,
        avatar:string,
        active:boolean
    ){
        this.userId=userId;
        this.firstName=firstName;
        this.lastName=lastName;
        this.userName=userName;
        this.dateOfBirth = dateOfBirth
        this.phoneNumber=phoneNumber;
        this.password=password;
        this.sex=sex;
        this.email=email;
        this.deliveryAddress=deliveryAddress;
        this.purchaseAddress=purchaseAddress;
        this.avatar =avatar;
        this.active=active;
    }
}

export default UserModel;
