'use client';
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, ShoppingCart, MessageSquare } from 'lucide-react';

const FurnitureRentalPage = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBS3F3kqH2MQC2RiwBFUVZw5ub-vimTaNnwhiQ5CXP3a8ueGxZeZpjtK4JxCoZ_zoV8cK5Ptp12Hmsgwp92F0b0HyT4jn3tHfOVaHO1YJ_mowXkKiR1WvS5xvPh4q-cFNcl5jccaeehMjg47_bP2RG1HMddKdocs4_QkBU5d0WK5Kwuc1_2qIA2MB8P9EAqPO53uIhhk304oF1MWARRovqAbts4Jt5fWz94-KD-QjeMm4yaJdnK9MAi5C8ekCEl5rLM1J7d2h14pA"
  ];

  const reviews = [
    {
      id: 1,
      name: "Sophia Carter",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuApfbjpD7DAuh1QVF6OLpE-j5J4lqeBTG5WR9Gm4iq9QQOa5XKzFURP392LGyhvljQdV7mfCTkf7-e1CTmbuXa2m2RKudWb9m9rlwQ3dBIyN8Oo_6WpA5m-2rQefpLF-MPxlIqEh0bfqbonGWTlnz6fOphBRc5i0rbfC0C-Dg4zjrAvNCyP2cAAQhwGGCcOaA4vvYu3959KK_7kMz7dK8Xoh7KVh1msAEcma2o7JGIyAYp38eSRECfUWy4Y8to2D8tog4pbCxL_hQ",
      rating: 5,
      date: "1 month ago",
      comment: "This lounge chair is incredibly comfortable and stylish. It was the perfect addition to my living room and made it feel so much more inviting. The rental process was smooth and hassle-free.",
      likes: 12,
      dislikes: 2
    },
    {
      id: 2,
      name: "Ethan Bennett",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVaZaHyEgXlSUcoaTW7Vrtd3RSNgl7Rysw3eRmV3QZoKo9AgX_hzq8fcdwlfIULTLOTn_r9ECFyH4EA0wvquN35L4O56EOHdIAMmoHMI-NvREi9yPZV7qbVVDUkAAbAHZwF16nMofzfDe4-vvWHuO7MAnT_HMRt50ttkJXsys_g3LtUMYtmxMNpkqd0GwmS2PjaQktulUZyoac6DUZRCiYHbJa9uriqtyC0Af4ZoCTLhbm3-4UdD7g5A4qD5xvTQM3j5U3V2fkPQ",
      rating: 4,
      date: "2 months ago",
      comment: "The chair is great, but I wish there were more color options available. Overall, it's a solid rental choice for anyone looking for a temporary seating solution.",
      likes: 8,
      dislikes: 1
    }
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 40 },
    { stars: 4, percentage: 30 },
    { stars: 3, percentage: 15 },
    { stars: 2, percentage: 10 },
    { stars: 1, percentage: 5 }
  ];

  const renderStars = (rating, size = 18) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={size}
        className={index < rating ? "text-blue-600 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',_'Noto_Sans',_sans-serif]">
      {/* Main Content */}
      <main className="px-4 md:px-8 lg:px-16 xl:px-40 py-5">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 p-4 text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Furniture</a>
            <span className="text-blue-600">/</span>
            <span className="text-gray-900 font-medium">Chairs</span>
          </nav>

          {/* Product Header */}
          <div className="px-4 mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              The Modern Lounge Chair
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl">
              A stylish and comfortable lounge chair perfect for any living space.
            </p>
          </div>

          {/* Product Image */}
          <div className="px-4 mb-8">
            <div className="w-full bg-center bg-no-repeat bg-cover aspect-[3/2] md:aspect-[16/10] lg:aspect-[3/2] rounded-xl overflow-hidden shadow-lg">
              <img 
                src={productImages[activeImageIndex]} 
                alt="Modern Lounge Chair"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Product Details */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 px-4 pb-4">Product Details</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {[
                { label: "Dimensions", value: "30\"W x 35\"D x 32\"H" },
                { label: "Material", value: "Upholstered in premium fabric with a sturdy wooden frame" },
                { label: "Features", value: "Ergonomic design, plush cushioning, and a sleek, modern aesthetic" },
                { label: "Rental Price", value: "$50/week" }
              ].map((detail, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ${index !== 3 ? 'border-b border-gray-100' : ''}`}>
                  <p className="text-gray-600 text-sm font-medium md:col-span-1">{detail.label}</p>
                  <p className="text-gray-900 text-sm md:col-span-3">{detail.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 px-4 mb-8">
            <button className="flex items-center justify-center rounded-full h-12 px-6 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex-1 sm:flex-none">
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </button>
            <button className="flex items-center justify-center rounded-full h-12 px-6 bg-gray-100 text-gray-900 text-sm font-bold hover:bg-gray-200 transition-colors flex-1 sm:flex-none">
              <MessageSquare size={16} className="mr-2" />
              Request a Quote
            </button>
          </div>

          {/* Customer Reviews */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 px-4 pb-4">Customer Reviews</h3>
            
            {/* Rating Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Overall Rating */}
                <div className="flex flex-col items-center lg:items-start gap-2">
                  <p className="text-4xl font-black text-gray-900">4.5</p>
                  <div className="flex gap-1">
                    {renderStars(4.5)}
                  </div>
                  <p className="text-gray-900 text-base">24 reviews</p>
                </div>

                {/* Rating Breakdown */}
                <div className="flex-1 max-w-md">
                  {ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="grid grid-cols-[20px_1fr_40px] items-center gap-3 mb-3">
                      <p className="text-gray-900 text-sm">{rating.stars}</p>
                      <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="rounded-full bg-blue-600 transition-all duration-300" 
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                      <p className="text-gray-600 text-sm text-right">{rating.percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 text-base font-medium">{review.name}</p>
                      <p className="text-gray-600 text-sm">{review.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {renderStars(review.rating, 20)}
                  </div>
                  
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
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FurnitureRentalPage;