class ImageModel{ 
    imageId:number;
    isIcon?:boolean;
    imageData?:string;
    constructor(imageId:number,
        isIcon:boolean,
        imageData:string){
            this.imageId = imageId;
            this.isIcon = isIcon;
            this.imageData = imageData;
    }
}
export default ImageModel;