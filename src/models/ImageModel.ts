class ImageModel{ 
    imageId:number;
    imageName?:string;
    isIcon?:boolean;
    link?:string;
    imageData?:string;
    constructor(imageId:number,
        imageName:string,
        isIcon:boolean,
        link:string,
        imageData:string){
            this.imageId = imageId;
            this.imageName = imageName;
            this.isIcon = isIcon;
            this.link = link;
            this.imageData = imageData;
    }
}
export default ImageModel;