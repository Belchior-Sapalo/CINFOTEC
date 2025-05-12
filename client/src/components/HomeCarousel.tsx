import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import c_image1_path from "../assets/images/img1.jpg";
import c_image2_path from "../assets/images/img2.jpg";
import c_image3_path from "../assets/images/img3.jpg";

export default function HomeCarousel() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6 z-[-1]">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[Autoplay({ delay: 2000 })]}
      >
        <CarouselContent>
          {[c_image1_path, c_image2_path, c_image3_path].map((src, idx) => (
            <CarouselItem key={idx} className="w-full p-2">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden shadow-md">
                <img
                  src={src}
                  alt={`Imagem ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
