"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
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
    name: "Sophia Carter",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "1 month ago",
    comment:
      "This lounge chair is incredibly comfortable and stylish. It was the perfect addition to my living room and made it feel so much more inviting. The rental process was smooth and hassle-free.",
    likes: 12,
    dislikes: 2,
  },
  {
    id: 2,
    name: "Ethan Bennett",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    date: "2 months ago",
    comment:
      "The chair is great, but I wish there were more color options available. Overall, it's a solid rental choice for anyone looking for a temporary seating solution.",
    likes: 8,
    dislikes: 1,
  },
  {
    id: 3,
    name: "Maya Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "Excellent quality and super comfortable! The delivery was prompt and the setup was easy. Highly recommend for anyone looking to upgrade their space temporarily.",
    likes: 15,
    dislikes: 0,
  },
  {
    id: 4,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 3,
    date: "6 weeks ago",
    comment:
      "Decent chair but not as comfortable as I expected. It serves its purpose but I probably wouldn't rent it again.",
    likes: 5,
    dislikes: 3,
  },
    {
    id: 2,
    name: "Ethan Bennett",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    date: "2 months ago",
    comment:
      "The chair is great, but I wish there were more color options available. Overall, it's a solid rental choice for anyone looking for a temporary seating solution.",
    likes: 8,
    dislikes: 1,
  },
  {
    id: 3,
    name: "Maya Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "Excellent quality and super comfortable! The delivery was prompt and the setup was easy. Highly recommend for anyone looking to upgrade their space temporarily.",
    likes: 15,
    dislikes: 0,
  },
  {
    id: 4,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 3,
    date: "6 weeks ago",
    comment:
      "Decent chair but not as comfortable as I expected. It serves its purpose but I probably wouldn't rent it again.",
    likes: 5,
    dislikes: 3,
  },
]

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
            {reviews.map((review, index) => (
              <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="w-full flex-shrink-0 px-2">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-gray-900 text-base font-medium">{review.name}</p>
                            <p className="text-gray-600 text-sm">{review.date}</p>
                          </div>
                        </div>

                        <div className="flex gap-1 mb-4">{renderStars(review.rating, 20)}</div>

                        <p className="text-gray-900 text-base mb-4 leading-relaxed">{review.comment}</p>

                        <div className="flex items-center gap-6 text-gray-600">
                          <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <ThumbsUp size={18} />
                            <span className="text-sm">{review.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
                            <ThumbsDown size={18} />
                            <span className="text-sm">{review.dislikes}</span>
                          </button>
                        </div>
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
