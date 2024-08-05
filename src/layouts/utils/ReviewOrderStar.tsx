import { useState } from "react"
import { Star, StarFill } from "react-bootstrap-icons";

interface ReviewProps{
    initialRating:number
    onRatingChange:(value:number)=>void
}

const ReviewOrderStar:React.FC<ReviewProps>=({initialRating,onRatingChange})=>{
    const [rating,setRating] = useState<number>(initialRating);

    const handleRatingChange = (newRating:number)=>{
        setRating(newRating)
        if(onRatingChange){
            onRatingChange(newRating);
        }
    }

    const getRatingText = (stars:number) => {
        if (stars >= 4.5) return "Rất tốt";
        if (stars >= 3.5) return "Tốt";
        if (stars >= 2.5) return "Bình thường";
        if (stars >= 1.5) return "Không hài lòng";
        return "Rất tệ";
      };

      return(
        <div className="start-rating">
            {[...Array(5)].map((_,index)=>{
                const starValue = index+1;
                return(
                    <span
                        key={index}
                        className={`star ${starValue <= (rating) ? "filled" : ''}`}
                        onClick={()=>handleRatingChange(starValue)}

                        >
                        {starValue <= ( rating) ? (
                            <StarFill size={24} className="text-warning"/>
                            ) : (
                            <Star size={24} className="text-warning"/>
                        )}
                    </span>
                )
            })}
            <span className="rating-text ms-2">{getRatingText(rating)}</span>
        </div>
      )
}

export default ReviewOrderStar;