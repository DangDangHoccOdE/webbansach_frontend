function SoldQuantityFormat(x:number | undefined){
    if(x===undefined){
        return 0;
    }

    if(isNaN(x)){
        return 0;
    }

    if(x>=1_000_000){
        return (x/1_000_000).toFixed(1)+'tr';
    }else if(x>=1_000){
        return (x/1_000).toFixed(1)+'k'
    }

    // toLocaleString
    return x.toLocaleString("vi-VN")
}

export default SoldQuantityFormat;