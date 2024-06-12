class RemarkModel{ 
    remarkId:number;
    rate:number;
    content:string;

    constructor( remarkId:number,
        rate:number,
        content:string,){
            this.remarkId = remarkId;
            this.rate = rate;
            this.content = content;

    }
}
export default RemarkModel;