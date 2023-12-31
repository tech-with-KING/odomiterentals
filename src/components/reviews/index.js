import React from 'react';
import "./index.css"
const CustomerReviews = () => {
  return (
    <div className="gallery">
      <article className="card">
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
      </article>
      {/* Pictures from Freepik */}
    </div>
  );
};

export default CustomerReviews;
