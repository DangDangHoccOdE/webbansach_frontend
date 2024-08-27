
const Carousel=()=> {

  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide">
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="10000">
            <img
                src={"./../../../images/banner/banner-1.jpg"}
                className='d-block w-100'
                alt='Banner1' style={{height:'400px'}}
              />     
           </div>
        <div className="carousel-item" data-bs-interval="10000">
          <div className="row align-items-center">
            <img
                  src={"./../../../images/banner/banner-2.jpg"}
                  className='d-block w-100'
                  alt='Banner2' style={{height:'400px'}}
                />   
          </div>
        </div>
        <div className="carousel-item" data-bs-interval="10000">
          <div className="row align-items-center">
          <img
                src={"./../../../images/banner/banner-3.jpg"}
                className='d-block w-100'
                alt='Banner3' style={{height:'400px'}}
              />   
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
