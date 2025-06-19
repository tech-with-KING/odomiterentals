"use client"

import { useState, useEffect, useCallback } from "react"
import { Star} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const reviews = [
  {
    id: 1,
    name: "Connie G",
    rating: 5,
    date: "4 months ago",
    comment:
      "They were very professional, on time and they actually picked up the tables and chairs at the end of our party. We called them and they came quick. I will definitely do more rentals with them. I recommend Odomite Rentals to everyone.",
    likes: 0,
    dislikes: 0,
  },
  {
    id: 2,
    name: "K. Grant",
    rating: 5,
    date: "a month ago",
    comment:
      "Service was great! We had a last minute holiday party. Steven was able to supply our requested table and chairs colors with no problem. Communication was excellent.",
    likes: 0,
    dislikes: 0,
  },
  {
    id: 3,
    name: "Darnell Brunson",
    rating: 5,
    date: "a year ago",
    comment:
      "I was looking around for rental chairs but I wanted a certain look. So I found this amazing rental company on Facebook marketplace. Did my research on the internet and found them to be legit. This was the best decision I’ve made. I own an intimate event space and will be using them for all my events! Communication and delivery, let’s not forget pricing, was all on point!! Thank you Thank you Thank you!",
    likes: 0,
    dislikes: 0,
  },
  {
    id: 4,
    name: "Simply Stefené",
    rating: 5,
    date: "4 months ago",
    comment:
      "I had such a great experience renting chairs for a small party. The transaction was smooth and the owner was super nice. I will be returning and recommending this company!",
    likes: 0,
    dislikes: 0,
  },
  {
    id: 5,
    name: "Stephanie Homem",
    rating: 5,
    date: "a year ago",
    comment:
      "Everything was perfect — we rented for Thanksgiving! Scheduled for pick up and delivery and everything went very smoothly. Very friendly and very professional. I will be renting from this company again. The chairs and table were clean. When I called, they answered all my questions and everything he said was done. Very pleased. Thank you so much!",
    likes: 0,
    dislikes: 0,
  },
];

const renderStars = (rating: number, size = 18) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star key={index} size={size} className={index < rating ? "text-blue-600 fill-current" : "text-gray-300"} />
  ))
}

export default function ReviewsPage() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

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

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Auto-scroll effect
  useEffect(() => {
    if (!api || !isAutoScrolling) return

    const autoScroll = setInterval(() => {
      scrollNext()
    }, 4000) // 4 second delay

    return () => clearInterval(autoScroll)
  }, [api, scrollNext, isAutoScrolling])

  const handleMouseEnter = () => setIsAutoScrolling(false)
  const handleMouseLeave = () => setIsAutoScrolling(true)

  return (
    <section className="container mx-auto px-0 pt-6 pb-2 bg-white">
      <div className="w-full mx-auto py-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="w-full flex-shrink-0 px-2]">
                      <div className="bg-white  min-h-[350px] rounded-lg shadow-sm border border-gray-100 p-6 h-full ">
                        <div className="flex items-center gap-3 mb-4">
                          <div className='w-16 h-16 mb-4 rounded-full bg-gray-200  flex items-center justify-center text-gray-800 font-semibold text-lg'>
									        {review.name[0]}
								          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-base font-medium">{review.name}</p>
                            <p className="text-gray-600 text-sm">{review.date}</p>
                          </div>
                        </div>

                        <div className="flex gap-1 mb-4">{renderStars(review.rating, 20)}</div>

                        <p className="text-gray-900 text-base mb-4 leading-relaxed">{review.comment}</p>
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
              index === current - 1 ? "bg-blue-600 w-8" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  )
}
