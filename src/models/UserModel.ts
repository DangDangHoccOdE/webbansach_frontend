class UserModel{
    userId:number;
    firstName:string;
    lastName:string;
    account:string;
    phoneNumber:string;
    password:string;
    sex:string;
    email:string;
    deliveryAddress:string;
    purchaseAddress:string;

    constructor(
        userId:number,
        firstName:string,
        lastName:string,
        account:string,
        phoneNumber:string,
        password:string,
        sex:string,
        email:string,
        deliveryAddress:string,
        purchaseAddress:string
    ){
        this.userId=userId;
        this.firstName=firstName;
        this.lastName=lastName;
        this.account=account;
        this.phoneNumber=phoneNumber;
        this.password=password;
        this.sex=sex;
        this.email=email;
        this.deliveryAddress=deliveryAddress;
        this.purchaseAddress=purchaseAddress;
    }
}

export default UserModel;
