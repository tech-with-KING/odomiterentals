'use client'

import React, { useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import GlobalHeader from '@/components/GlobalHeader'
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
    id: 1,
    title: 'Chair Rentals',
    description: 'Wide selection of chairs for any event.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Seating'
  },
  {
    id: 2,
    title: 'Table Rentals',
    description: 'Various table sizes and styles to fit your needs.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Tables'
  },
  {
    id: 3,
    title: 'Equipment Rentals',
    description: 'Lighting and sound equipment to enhance your event.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Equipment'
  },
  {
    id: 4,
    title: 'Tent Rentals',
    description: 'Weather protection and elegant outdoor spaces.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Shelter'
  },
  {
    id: 5,
    title: 'Decor Rentals',
    description: 'Beautiful decorative elements for memorable events.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Decor'
  },
    {
    id: 2,
    title: 'Table Rentals',
    description: 'Various table sizes and styles to fit your needs.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Tables'
  },
  {
    id: 3,
    title: 'Equipment Rentals',
    description: 'Lighting and sound equipment to enhance your event.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Equipment'
  },
  {
    id: 4,
    title: 'Tent Rentals',
    description: 'Weather protection and elegant outdoor spaces.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Shelter'
  },
  {
    id: 5,
    title: 'Decor Rentals',
    description: 'Beautiful decorative elements for memorable events.',
    image: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    category: 'Decor'
  }
]

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
                      <div className="relative overflow-hidden rounded-lg md:h-[150px]">
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
                        <p className="text-sm text-blue-600 leading-relaxed">{service.description}</p>
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