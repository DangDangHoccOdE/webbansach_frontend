import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import ListProduct from "../product/ListProduct";
import useScrollToTop from "../../hooks/ScrollToTop";
import BookStoreFeatureBar from "./components/BookStoreFeatureBar";

function HomePage() {
  useScrollToTop();
  
  return (
    <div>
      <Banner />
      <Carousel />
      <BookStoreFeatureBar/>
      <ListProduct />
    </div>
  );
}

export default HomePage;
