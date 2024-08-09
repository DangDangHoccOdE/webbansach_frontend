import { Star, StarFill, StarHalf } from "react-bootstrap-icons";

const renderRating = (score:number)=>{
    const star = [];
    for(let i=1;i<=5 ; i++){
        if(i<=score){
            star.push(<StarFill className="text-warning"/>);
        }else if(i-0.5<=score){
            star.push(<StarHalf className="text-warning"/>);
        }else{
            star.push(<Star className="text-secondary"/>)
        }
    }
   
    return star;
}

export default renderRating;

export const formatStartRate=(score:number)=>{
    if(Number.isInteger(score)){
        return score;
    }else{
        return score.toFixed(1);
    }
}

