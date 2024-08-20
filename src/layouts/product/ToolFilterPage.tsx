import { useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop"
import { useParams } from "react-router-dom";
import ToolFilter from "./components/ToolFilter";

interface FilterPageProps{
    keySearchNav?:string // Key nhận từ navbar
}

const FilterPage:React.FC<FilterPageProps>=(props)=>{
    useScrollToTop();

    const [keySearch,setKeySearch] = useState("");
    const [categoryId,setCategoryId] = useState(0);
    const [filter,setFilter] = useState(0);

    if(props.keySearchNav!==undefined && props.keySearchNav !==""){
        setKeySearch(props.keySearchNav);
    }

    // Lấy value id category từ url
    const {idCate} = useParams();
    
    return(
        <div>
            
        </div>
    )
}