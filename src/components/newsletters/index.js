import { useEffect, useState } from 'react';
import React from 'react';
import "./index.css"
import Header from '../../body/header';

const About = ({ services }) => {
  return (
    <div>
      {services && services.map((service) => (
        <div key={service.id} className="article__content" >
          <h1>{service.heading}</h1>
          <p>{service.paragraph}</p>
          {service.image && <img src={service.image} alt={`Image ${service.id}`} />}
        </div>
      ))}
    </div>
  );
};

export { About };

        