import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay  from "embla-carousel-autoplay";

import image_1 from "@/assets/images/image_ads1.webp";
import image_2 from "@/assets/images/image_ads2.webp";


export function TopCarousel() {
  return (
    <div className="flex flex-col  justify-center  overflow-hidden min-h-60 bg-black">
    <Carousel  className="w-full "  plugins={[Autoplay({ delay: 5000 })]} >
      <CarouselContent>
        <CarouselItem>
          <img src={image_1} alt="image_1" />
        </CarouselItem>
        <CarouselItem>
          <img src={image_2} alt="image_2" />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
    </Carousel>
    </div>
  );
}
