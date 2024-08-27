import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import ListProduct from "../product/ListProduct";
import BookStoreFeatureBar from "./components/BookStoreFeatureBar";
import HotBookList from "../product/HotBookList";
import NewBookList from "../product/NewBookList";

function HomePage() {
  
  return (
    <div>
      <div className='d-md-none d-sm-none d-lg-block'>
				{/* Banner */}
				<Banner />
				{/* Underline */}
				<div className='d-flex justify-content-center align-items-center pb-4'>
					<hr className='w-100 mx-5' />
				</div>
			</div>
      <div className='container'>
				<Carousel />
			</div>
      <BookStoreFeatureBar/>
      <HotBookList/>
      <NewBookList/>
      <ListProduct />
    </div>
  );
}

export default HomePage;
