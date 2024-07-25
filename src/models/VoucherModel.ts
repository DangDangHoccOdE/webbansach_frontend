class VoucherModel{
  voucherId:number;
  code:string;
  discountValue:number;
  expiredDate:string;
  isActive:boolean;
  voucherImage:string;
  quantity:number;
  describe:string;
  isAvailable:boolean;
  typeVoucher:string;

  constructor(  voucherId:number,
    code:string,
    discountValue:number,
    expiredDate:string,
    isActive:boolean,
    voucherImage:string,
    quantity:number,
  describe:string,  isAvailable:boolean,
  typeVoucher:string){
        this.voucherId = voucherId;
        this.code= code;
        this.isActive=isActive;
        this.discountValue=discountValue;
        this.expiredDate= expiredDate;
        this.voucherImage = voucherImage;
        this.quantity =quantity;
        this.describe =describe;
        this.isAvailable = isAvailable;
        this.typeVoucher = typeVoucher;
    }

}

export default VoucherModel;
