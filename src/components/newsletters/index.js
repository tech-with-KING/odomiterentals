import { useEffect, useState } from 'react';
import React from 'react';
import "./index.css"
import Header from '../../body/header';



        const About = () => {
          const paragraphs = [
            {
              title: 'Lorem ipsum dolor sit amet',
              content:
                'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam neque. Curabitur bibendum justo non orci. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
              imageSrc: '/lavender-field.jpg',
            },
            {
              title: 'Place 1',
              content:
                'Nullam at arcu a est sollicitudin euismod. Nam quis nulla. In enim a arcu imperdiet malesuada. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus.',
              imageSrc: '/autumn.jpg',
            },
            {
              title: 'Place 2',
              content:
                'Fusce suscipit libero eget elit. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Phasellus rhoncus. Integer vulputate sem a nibh rutrum consequat. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Phasellus et lorem id felis nonummy placerat. Pellentesque sapien. Praesent in mauris eu tortor porttitor accumsan. Mauris tincidunt sem sed arcu. Aliquam ante. Nulla quis diam. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Fusce tellus odio, dapibus id fermentum quis, suscipit id erat. Phasellus et lorem id felis nonummy placerat.',
              imageSrc: '/summer.jpg',
            },
            {
              title: 'Place 3',
              content:
                'Aenean vel massa quis mauris vehicula lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Integer rutrum, orci vestibulum ullamcorper ultricies, lacus quam ultricies odio, vitae placerat pede sem sit amet enim. Curabitur vitae diam non enim vestibulum interdum. Pellentesque pretium lectus id turpis. Mauris tincidunt sem sed arcu. In rutrum. Nulla quis diam. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor. Nullam sapien sem, ornare ac, nonummy non, lobortis a enim. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Nam sed tellus id magna elementum tincidunt.',
              imageSrc: '/forest.jpg',
            },
          ];

          return (
            <div>
              <Header heading='ABOUT US' paragraph='Who we are - OdomiteRentals' />
              {paragraphs.map((paragraph, index) => (
                <div key={index} className="article__content" itemscope="" itemtype="https://schema.org/Article">
                  <h1>{paragraph.title}</h1>
                  <p>{paragraph.content}</p>
                  <img src={paragraph.imageSrc} alt={`Image ${index + 1}`} />
                </div>
              ))}
            </div>
          );
        };
        
        export  {About};
        