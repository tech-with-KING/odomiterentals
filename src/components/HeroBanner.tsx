"use client"

import React, { useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const services = [
  {
    id: 1,
    title: "Chair Rentals",
    description: "Wide selection of chairs for any event.",
    image:
      "https://res.cloudinary.com/dpcvlheu9/image/upload/v1710257844/OdomiteRentals/Hero_Images/banner_v3bbwc.jpg ",
    category: "chairs",
  },
  {
    id: 2,
    title: "Table Rentals",
    description: "Various table sizes and styles to fit your needs.",
    image:
      "https://res.cloudinary.com/dpcvlheu9/image/upload/v1706283742/OdomiteRentals/Hero_Images/m9yy0en3cdrhezj6d0wo.jpg",
    category: "Tables",
  },
  {
    id: 3,
    title: "Equipment Rentals",
    description: "Lighting and sound equipment to enhance your event.",
    image:
      "https://res.cloudinary.com/algopinile/image/upload/v1750259936/projects/ze3sisi0vbmnvegfxcyg.png",
    category: "Equipments",
  },
  {
    id: 4,
    title: "Tent Rentals",
    description: "Weather protection and elegant outdoor spaces.",
    image:
      "https://res.cloudinary.com/algopinile/image/upload/v1750262022/samples/zyzq9mvkggecloxbleie.png",
    category: "Shelter",
  },
  {
    id: 5,
    title: "Setup",
    description: "Beautiful decorative elements for memorable events.",
    image:
      "https://res.cloudinary.com/dpcvlheu9/image/upload/v1707484410/services/odomiterentals_itjcft.jpg",
    category: "Services",
  },
]

// Animation variants for better text animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
}

const titleVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.9,
    transition: { duration: 0.4 },
  },
}

const descriptionVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(2px)",
    transition: { duration: 0.3 },
  },
}

export default function HeroBanner() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const scrollNext = useCallback(() => {
    if (api) api.scrollNext()
  }, [api])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })

    const autoScroll = setInterval(scrollNext, 5000) // Increased to 5 seconds for better text reading
    return () => clearInterval(autoScroll)
  }, [api, scrollNext])

  return (
    <section className="px-0 container mx-auto max-w-10xl md:max-w-8xl">
      <div className="relative rounded-3xl overflow-hidden ">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {services.map((service, index) => (
              <CarouselItem key={index} className="basis-full">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="relative w-full h-[220px] sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-2xl">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        unoptimized
                        className="object-cover "
                        priority={index === 0}
                      />
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      <AnimatePresence mode="wait">
                        {current === index && (
                          <motion.div
                            key={`${index}-${service.id}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 sm:px-6 md:px-8 text-center z-10"
                          >
                

                            <motion.h3
                              variants={titleVariants}
                              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight"
                            >
                              {service.title}
                            </motion.h3>

                            <motion.p
                              variants={descriptionVariants}
                              className="text-base hidden sm:inline sm:text-lg md:text-xl max-w-2xl leading-relaxed"
                            >
                              {service.description}
                            </motion.p>

                          <motion.button
                            variants={descriptionVariants}
                            className="mt-6 md:mt-8 px-4 py-2 md:px-6 md:py-3 bg-white text-gray-900 rounded-full font-semibold text-sm md:text-base hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Learn More
                          </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full shadow-lg p-2 transition-all duration-300 hover:scale-110" />
          <CarouselNext className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full shadow-lg p-2 transition-all duration-300 hover:scale-110" />
        </Carousel>

        {/* Enhanced dots indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center items-center space-x-2 z-20">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              className={`rounded-full transition-all duration-500 hover:scale-125 ${
                index === current ? "bg-white w-8 h-2 shadow-lg" : "bg-white/50 hover:bg-white/80 w-2 h-2"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
