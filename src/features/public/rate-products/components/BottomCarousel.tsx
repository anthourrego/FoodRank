import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import image_1 from "@/assets/images/image_ads1.webp";

export function BottomCarousel() {
  return (
    <div className="flex flex-col justify-center overflow-hidden min-h-60 bg-black">
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <img src={image_1} alt="Patrocinadores" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
    </div>
  );
}
