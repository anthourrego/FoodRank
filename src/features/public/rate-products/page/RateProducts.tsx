import { RateProductGrid } from "../components/RateProductGrid"
import { TopCarousel } from "../components/TopCarousel"

function RateProducts(){ 
  return(
    <div className="w-full h-full overflow-auto bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <TopCarousel/>
      <RateProductGrid/>
    </div>
  )
}

export default RateProducts