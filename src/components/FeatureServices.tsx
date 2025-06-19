'use client'

import React, { useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HeaderThree } from '@/components/GlobalHeader'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import Image from 'next/image'

const services = [
  {
    id: 0,
    title: "Transportation",
    desription:"Fast, reliable delivery to your event location.",
    image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1707484410/services/movingtruck3_enz8z7.jpg',
    category: 'Service'
  },
  {
    id: 1,
    title: "Setup",
    description: "Professional setup for a perfect event layout.",
    image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1707484409/services/decoration_qrq7gd.jpg',
    category: 'Service'
  },
  {
    id: 3,
    title: "Decoration",
    description: "Stylish decor to make your event unforgettable.",
    image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1707484409/services/decoration2_ddhc5a.jpg',
    category: 'Service'
  },
  {
    id: 4,
    title: "Rentals",
    description: "Post-event cleanup handled with care",
    image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1707484411/services/cleanup_pwv9lj.jpg',
    category: 'Product'
  }
];


export default function FeaturedServicesCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  // Auto-scroll functionality
  const scrollNext = useCallback(() => {
    if (api) {
      api.scrollNext()
    }
  }, [api])     

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })

    // Auto-scroll with delay
    const autoScroll = setInterval(() => {
      scrollNext()
    }, 4000) // 4 second delay

    return () => clearInterval(autoScroll)
  }, [api, scrollNext])

  return (
    <section className="container mx-auto px-0 pt-6 pb-2 bg-white">
        <HeaderThree title='Featured Services' ></HeaderThree>
        <div className="w-full mx-auto  py-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {services.map((service, index) => (
              <CarouselItem key={index} className="basis-1/2 pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4 ">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div className="relative h-[120px] overflow-hidden rounded-lg md:h-[150px]">
                         <Image
                            src={service.image ?? "/placeholder.svg"}
                            alt={service.title}
                            width={300}
                            height={100}
                            unoptimized
                            className="w-full h-48 object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === current - 1 
                  ? 'bg-blue-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
    </section>
  )
}