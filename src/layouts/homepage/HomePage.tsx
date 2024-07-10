import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import ListProduct from "../product/ListProduct";
import { useParams } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
interface HomePageProps {
  bookNameFind: string;
}

function HomePage({ bookNameFind }: HomePageProps) {
  useScrollToTop();
  const { categoryId } = useParams();
  let categoryNumber = 0;

  try {
    categoryNumber = parseInt(categoryId + ''); // NaN
  } catch (error) {
    categoryNumber = 0;
    console.log("Error: ", error);
  }

  if (Number.isNaN(categoryNumber)) {
    categoryNumber = 0;
  }

  return (
    <div>
      <Banner />
      <Carousel />
      <ListProduct bookNameFind={bookNameFind} categoryId={categoryNumber} />
    </div>
  );
}

export default HomePage;
