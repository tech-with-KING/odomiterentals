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
        <img src="" className="profile-image" alt=""></img>
        <div className="text-container">
            <span className="bold-text">Lesine</span>
            <span className="small-text">No reviews yet
           </span>
        </div>
    </div>
    <div className="right-container">
        50m ago
    </div>
</div>

  )
}
export{ReviewCard}

export default CustomerReviews;
