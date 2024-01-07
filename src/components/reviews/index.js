import React from 'react';
import "./index.css"
const CustomerReviews = () => {
  return (
    <div className="gallery_reviews">
      <ReviewCard />
      <ReviewCard />
    </div>
  );
};


const ReviewCard = ()=>{
  return(
    <div className="review_container">
    <div className="left-container">
        <img src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" className="profile-image" alt=""></img>
        <div className="text-container">
            <span className="bold-text">Lesine</span>
            <span class="small-text">Lorem ipsum dolor sit amet consectetur adipisicing e
             in this times when things are so very hard it
           </span>
        </div>
    </div>
    <div class="right-container">
        50m ago
    </div>
</div>

  )
}
export{ReviewCard}

export default CustomerReviews;
