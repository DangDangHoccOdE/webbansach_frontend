import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import ListProduct from "../product/ListProduct";

function HomePage(){
    return(
        <div>
           <Banner/>
           <Carousel/>
           <ListProduct/>
        </div>
    )
}

export default HomePage;