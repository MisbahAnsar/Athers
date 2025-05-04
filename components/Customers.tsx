"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useMediaQuery } from "../hooks/use-media-query"
import { cn } from "@/lib/utils"
import type { EmblaCarouselType } from 'embla-carousel'

export default function HappyCustomers() {
  const [api, setApi] = useState<EmblaCarouselType | null>(null)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1023px)")
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const testimonials = [
    {
      id: 1,
      image: "/ash.png",
      name: "Aashna",
      feedback: "Its good i like how simple and easy it is to talk about your feelings!",
    },
    {
      id: 2,
      image: "/alum.png",
      name: "Ayush",
      feedback: "Super chill assistant—natural, kind, and vibes like a human.!",
    },
    {
      id: 3,
      image: "/orca.png",
      name: "Dhanush.",
      feedback: "Love how it listens without judgment. Makes opening up easy!",
    },
    {
      id: 4,
      image: "/misba.jpeg",
      name: "Misbah",
      feedback: "Feels like talking to a real friend—soft, safe, and validating.",
    },
    {
      id: 5,
      image: "/gulistan.png",
      name: "Gulistan",
      feedback: "Really comforting and calm—like someone who just gets you.",
    },
  ]
  

  const getSlidesPerView = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    if (isDesktop) return 4
    return 3
  }

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)

      autoplayRef.current = setInterval(() => {
        if (api) {
          api.scrollNext()
        }
      }, 5000)
    }

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }

    startAutoplay()

    return () => stopAutoplay()
  }, [api])

  return (
    <div className="relative py-12 md:py-20 w-full text-center overflow-hidden px-4 sm:px-6">
      <div className="mb-8 md:mb-12">
        <h2 className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl ibm-plex-mono-medium tracking-tighter uppercase">
          Happy Customers.
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto mt-12 md:mt-16">
        <Carousel
          setApi={setApi as (api: EmblaCarouselType | undefined) => void} 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            slidesToScroll: 1,
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={testimonial.id}
                className={cn("pl-2 md:pl-4", isMobile ? "basis-full" : isTablet ? "basis-1/2" : "basis-1/4")}
              >
                <div className="group relative h-[300px] sm:h-[320px] md:h-[350px] w-full perspective-1000">
                  <div
                    className={cn(
                      "absolute inset-0 w-full h-full transition-all duration-500 ease-out",
                      "bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg",
                      "hover:shadow-xl hover:-translate-y-2 hover:rotate-0",
                      "border border-white/10 p-2",
                      current === index
                        ? "rotate-0 scale-105 z-20"
                        : index % 2 === 0
                          ? "rotate-[-2deg] scale-95"
                          : "rotate-[2deg] scale-95",
                    )}
                  >
                    <div className="relative w-full h-full rounded-lg md:rounded-xl overflow-hidden">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={`Customer ${testimonial.id}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={index < getSlidesPerView()}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                          <p className="ibm-plex-mono-medium text-lg">{testimonial.name}</p>
                          <p className="ibm-plex-mono-thin text-sm text-white/80">{testimonial.feedback}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom navigation buttons */}
          <div className="hidden sm:block">
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/20" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/20" />
          </div>
        </Carousel>

        {/* Mobile dots indicator */}
        {isMobile && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  current === i ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Tablet/Desktop dots indicator (smaller) */}
        {!isMobile && (
          <div className="flex justify-center mt-8 gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  current === i ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}