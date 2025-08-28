import { RateProductGrid } from "../components/RateProductGrid"
import { LazyLoadImage } from "react-lazy-load-image-component";
import image_2 from "@/assets/images/image_ads2.webp";
import image_1 from "@/assets/images/image_ads1.webp";


function RateProducts(){ 
  
  return(
    <div className="w-full h-full overflow-auto bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      
      <LazyLoadImage src={image_2} alt="Evento" />
      <RateProductGrid/>
      
      <LazyLoadImage src={image_1} alt="Evento" />
    </div>
  )
}

export default RateProducts