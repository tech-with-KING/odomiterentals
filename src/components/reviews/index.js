import React from 'react';
import "./index.css"
import { Star } from '@mui/icons-material';
const reviews = [
  {
    id: "1",
    customer_name: "Connie G",
    customer_avatar: "avatar1.jpg",
    customer_review: `They were very professional, on time and they actually picked up the tables
    and chairs at the end of our party. We called them and they came quick. I will definitely
    do more rentals with them. I recommend Odomite Rentals to everyone.`,
    time_of_review: "4 months ago",
    customer_rating: 5 
  },
  {
    id: "2",
    customer_name: "K. Grant",
    customer_avatar: "",
    customer_review: `Service was great! We had a last minute holiday party. Steven was able to
    supply our requested table and chairs colors with no problem. Communication was excellent.`,
    time_of_review: "a month ago",
    customer_rating: 5 
  },
  {
    id: "3",
    customer_name: "Darnell Brunson",
    customer_avatar: "", 
    customer_review: `I was looking around for rental chairs but I wanted a certain look. So I
    Found this amazing rental company on Facebook marketplace place. Did my research on the
    internet and found them to be legit. This was the best decision I’ve made. I own an intimate
    event space and will be using them for all my events! Communication and delivery let’s not
    forget pricing was all on point!! Thank you Thank you Thank you!`,
    time_of_review: "a year ago",
    customer_rating: 5 
  },
  {
    id: "4",
    customer_name: "Simply Stefené",
    customer_avatar: "", 
    customer_review: `I had such a great experience renting chairs for a small party. The transaction
    was smooth and the owner was super nice. I will be returning and recommending this company!`,
    time_of_review: "4 months ago",
    customer_rating: 5
  },
  {
    id: "5",
    customer_name: "Stephanie Homem",
    customer_avatar: "", 
    customer_review: `Everything was perfect we rented for Thanksgiving! Scheduled for pick up and
    delivery everything went very smoothly! Very friendly and very professional I will be renting
    from this company again. The chairs and table were clean. When I called they answered all my
    questions and everything he said was done very please thank you so much`,
    time_of_review: "a year ago",
    customer_rating: 5 
  }
];

const CustomerReviews = () => {
  return (
    <div className="gallery_reviews">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          customerName={review.customer_name}
          customerAvatar={review.customer_avatar} 
          customerReview={review.customer_review}
          customerRating={review.customer_rating}
          timeOfReview={review.time_of_review}
        />
      ))}
    </div>
  );
};


const ReviewCard = ({ customerName, customerAvatar, customerReview,customerRating,timeOfReview }) => {
  return (
    <div className="review_container">
        <img src={customerAvatar} className="profile-image" alt="" />
        <div className="text-container">
          <p className="bold-text">{customerName}</p>
          <p className="small-text">{customerReview}</p>
          {[...Array(customerRating)].map((_, index) => (
            <Star style={{color:"#ff8c1a"}} key={index} />
          ))}
       <p className="right-container">
        {timeOfReview}
      </p>
    
      </div>
    </div>
  );
};
export{ReviewCard}

export default CustomerReviews;
