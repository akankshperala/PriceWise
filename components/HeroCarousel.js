"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const heroImages = [
  { imgUrl: "/assets/images/hero-1.svg", alt: "smartwatch" },
  { imgUrl: "/assets/images/hero-2.svg", alt: "bag" },
  { imgUrl: "/assets/images/hero-3.svg", alt: "lamp" },
  { imgUrl: "/assets/images/hero-4.svg", alt: "air fryer" },
  { imgUrl: "/assets/images/hero-5.svg", alt: "chair" },
];

const HeroCarousel = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-10">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={3000}
        showArrows={false}
        showStatus={false}
        swipeable
        emulateTouch
      >
        {heroImages.map((image) => (
          <div key={image.alt} className="flex items-center justify-center">
            <Image
              src={image.imgUrl}
              alt={image.alt}
              width={484}
              height={484}
              className="object-contain w-full max-w-md h-auto"
              priority
            />
          </div>
        ))}
      </Carousel>

      <Image
        src="/assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={175}
        height={175}
        className="hidden xl:block absolute -left-20 bottom-0 z-10"
      />
    </div>
  );
};

export default HeroCarousel;
