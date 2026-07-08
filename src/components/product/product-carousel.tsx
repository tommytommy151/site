"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";
import "swiper/css";
import "swiper/css/free-mode";

export function ProductCarousel({ products }: { products: Product[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative">
      <Swiper
        modules={[FreeMode]}
        onSwiper={(s) => (swiperRef.current = s)}
        spaceBetween={20}
        freeMode
        slidesPerView={1.4}
        breakpoints={{
          480: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.1 },
          1024: { slidesPerView: 4 },
        }}
        className="!overflow-visible"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous"
        className="glass absolute top-[38%] -left-4 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-opacity hover:opacity-90 lg:flex"
      >
        <ChevronLeft className="size-4.5" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next"
        className="glass absolute top-[38%] -right-4 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-opacity hover:opacity-90 lg:flex"
      >
        <ChevronRight className="size-4.5" />
      </button>
    </div>
  );
}
