
import { Carousel } from "@material-tailwind/react";
 
const CarouselDefault = ()=>{

  return (
    <Carousel className="rounded-xl">
      <img src="/homeImages/darkvalley.svg"
        alt="image 1"
        className="h-full w-full object-cover"
      />
      <img
        src="/homeImages/darkvalley.svg"
        alt="image 2"
        className="h-full w-full object-cover"
      />
      <img
        src="/homeImages/darkvalley.svg"
        alt="image 3"
        className="h-full w-full object-cover"
      />
    </Carousel>
  );
}


export default CarouselDefault;