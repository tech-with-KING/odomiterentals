        import React from 'react';
        import "./index.css"
        import {device} from "../../deviceinfo"
        const BlogComponent = () => {
        const paragraphs = [
            {
            heading: 'Our Story',
            content: 'Odomite Rentals began its journey with a simple idea: to provide high-quality chair and table rentals for events across the United States. Our commitment to excellence and customer satisfaction sets us apart in the industry.',
            image: device[0].img, // Replace with the actual URL of the image
            },
            {
            heading: 'Exceptional Quality',
            content: 'At Odomite Rentals, we take pride in offering top-notch rental furniture. Our chairs and tables are not just functional; they also add a touch of elegance to any event. We believe that quality matters, and it reflects in every piece we provide.',
            image: device[1].img, // Replace with the actual URL of the image
            },
            // Add more paragraphs as needed
        ];

        //   return (
        //     <div id="blog_page">
        //       <header>
        //         <h1>About Us - Odomite Rentals</h1>
        //         <img sr={paragraphs[0].image} alt="Odomite Rentals" />
        //       </header>
        //       <main>
        //         {paragraphs.map((paragraph, index) => (
        //           <div key={index} className="paragraph-container">
        //             <h3>{paragraph.heading}</h3>
        //             <p>{paragraph.content}</p>
        //             <img src={paragraphs[0].image} alt={`Image ${index + 1}`} />
        //           </div>
        //         ))}
        //       </main>
        //     </div>
        //   );
        return (
        <div className="become-travel-pro">
            
              <h1>Become a Travel Pro in One Easy Lesson</h1>
              <TravelProImage />
              <TravelProParagraph />
              <Paragraph />
        </div>
        );

        };
        const TravelProImage = () => {
            return (
            <img src="https://i.imgur.com/example.png" alt="Become a travel pro" />

            );
        };
        const Paragraph = ()=>{
            const paragraphs = [
                {
                  heading: 'Our Story',
                  content: 'Odomite Rentals began its journey with a simple idea: to provide high-quality chair and table rentals for events across the United States. Our commitment to excellence and customer satisfaction sets us apart in the industry.',
                  image: 'url_to_image_1.jpg', // Replace with the actual URL of the image
                },
                {
                  heading: 'Exceptional Quality',
                  content: 'At Odomite Rentals, we take pride in offering top-notch rental furniture. Our chairs and tables are not just functional; they also add a touch of elegance to any event. We believe that quality matters, and it reflects in every piece we provide.',
                  image: 'url_to_image_2.jpg', // Replace with the actual URL of the image
                },
                // Add more paragraphs as needed
              ];
            return(
                <main>
                {paragraphs.map((paragraph, index) => (
                  <div key={index} className="paragraph-container">
                    <h3>{paragraph.heading}</h3>
                    <p>{paragraph.content}</p>
                    <img src={paragraph.image} alt={`Image ${index + 1}`} />
                  </div>
                ))}
              </main>
            )
        }
        const TravelProParagraph = () => {
            return (
            <p id='blog'>
                Welcome to Odomite Rentals, your premier destination for exceptional party rentals! 
                With a passion for creating unforgettable events, Odomite Rentals takes pride in offering 
                high-quality chair and table rentals for all your celebration needs. Our journey began with a 
                simple yet powerful idea: to enhance the ambiance of events across the United States. Committed to 
                excellence, we bring a touch of elegance to every occasion. Whether you're planning a wedding, 
                corporate event, or a casual gathering, our top-notch rental furniture ensures both style and 
                comfort. At Odomite Rentals, we believe in the magic of memorable celebrations, and our commitment 
                to quality reflects in every piece we provide.
                Elevate your events with Odomite Rentals—where every moment becomes extraordinary.
            </p>
            );
        };
        
        export default BlogComponent;
