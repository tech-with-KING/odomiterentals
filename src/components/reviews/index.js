import React from 'react';
import "./index.css"
const CustomerReviews = () => {
  return (
    <div className="gallery">
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      {/* <article className="card">
        <figure>
          <img
            src="images/forest.jpg"
            alt="Winter Forest"
          />
          <figcaption>
            <h3>Winter Forest</h3>
          </figcaption>
        </figure>
      </article>
      <article className="card">
        <figure>
          <img
            src="images/lavender-field.jpg"
            alt="Lavender Field"
          />
          <figcaption>
            <h3>Lavender Field</h3>
          </figcaption>
        </figure>
      </article>
      <article className="card">
        <figure>
          <img
            src="images/wooden-bridge.jpg"
            alt="Wooden Bridge"
          />
          <figcaption>
            <h3>Wooden Bridge</h3>
          </figcaption>
        </figure>
      </article> */}
      {/* Pictures from Freepik */}
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

export default CustomerReviews;
