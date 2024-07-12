class ImageModel{ 
    imageId:number;
    icon?:boolean;
    imageData?:string;
    constructor(imageId:number,
        icon:boolean,
        imageData:string){
            this.imageId = imageId;
            this.icon = icon;
            this.imageData = imageData;
    }
}
export default ImageModel;