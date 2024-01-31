// import React, { useState } from 'react';
// import "./style.css"
// const MessageForm = () =>{
// 		const [formData, setFormData] = useState({
// 			firstName: '',
// 			otherNames: '',
// 			email: '',
// 			contactNumber: '',
// 			address: '',
// 			message: '',
// 			contactOption: '',
// 		  });
		
// 		  // Handler for input changes
// 		  const handleInputChange = (e) => {
// 			const { id, value } = e.target;
// 			setFormData((prevData) => ({
// 			  ...prevData,
// 			  [id]: value,
// 			}));
// 		  };
		
// 		  // Handler for radio button changes
// 		  const handleRadioChange = (e) => {
// 			const { id, value } = e.target;
// 			setFormData((prevData) => ({
// 			  ...prevData,
// 			  contactOption: value,
// 			}));
// 		  };
		
// 		  // Handler for form submission
// 		  const handleSubmit = (e) => {
// 			e.preventDefault();
// 			// Do something with the formData, for example, send it to a server
// 			console.log(formData);
// 		  };
		
//         return (

// 			<form id="myForm">
//   <div class="formSection">
//     <div>
//       <label for="firstName" class="formLabel">First Name</label>
//       <input type="text" id="firstName" class="formInput" placeholder="First Name"></input>
//     </div>
//     <div>
//       <label for="otherNames" class="formLabel">Other Names</label>
//       <input type="text" id="otherNames" class="formInput" placeholder="Other Names"></input>
//     </div>
//   </div>

//   <div class="formSection">
//     <div>
//       <label for="email" class="formLabel">Email</label>
//       <input type="email" id="email" class="formInput" placeholder="Email"></input>
//     </div>
//     <div>
//       <label for="contactNumber" class="formLabel">Contact Number</label>
//       <input type="tel" id="contactNumber" class="formInput" placeholder="Contact Number"></input>
//     </div>
//   </div>

//   <div class="formSection">
//     <div>
//       <label for="address" class="formLabel">Your Address</label>
//       <input type="text" id="address" class="formInput" placeholder="Your Address"></input>
//     </div>
//   </div>

//   <div class="formSection">
//     <p class="formMessage">Would you like to leave us a message?</p>
//     <div>
//       <label for="message" class="formLabel">Message</label>
//       <textarea  type="text" id="message" class="formInput" placeholder="Leave us a message..."></textarea>
//     </div>
//   </div>

//   <div class="formSection ">
//     <h3 class="formTitle">How would you like us to reach out to you</h3>
//     <div>
// 	<input type="radio" id="emailOption" class="formRadio" name="contactOption" value="Email"></input>
//       <label for="emailOption" class="formRadio">Email</label>
      
//     </div>
//     <div>
// 	<input type="radio" id="whatsappOption" class="formRadio" name="contactOption" value="WhatsApp"></input>
//       <label for="whatsappOption" class="formRadio">WhatsApp</label>
      
//     </div>
//     <div>
// 	<input type="radio" id="phonecallOption" class="formRadio" name="contactOption" value="Phonecall"></input>
//       <label for="phonecallOption" class="formRadio">Phonecall</label>
      
//     </div>
//   </div>

//   <input type="submit" class="formSubmit" value="Submit"></input>
// </form>

		
//         );
// }

// export default MessageForm;
import React, { useState } from 'react';
import "./style.css";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    otherNames: '',
    email: '',
    contactNumber: '',
    address: '',
    message: '',
    contactOption: '',
  });

  // Handler for input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handler for radio button changes
  const handleRadioChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      contactOption: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the formData, for example, send it to a server
    console.log(formData);
  };

  return (
    <form id="myForm" onSubmit={handleSubmit}>
      {/* Form Sections */}
      <div className="formSection">
        <div>
          <label htmlFor="firstName" className="formLabel">First Name</label>
          <input
            type="text"
            id="firstName"
            className="formInput"
            placeholder="First Name"
            onChange={handleInputChange}
            defaultValue={formData.firstName}
          />
        </div>
        <div>
          <label htmlFor="otherNames" className="formLabel">Other Names</label>
          <input
            type="text"
            id="otherNames"
            className="formInput"
            placeholder="Other Names"
            onChange={handleInputChange}
            defaultValue={formData.otherNames}
          />
        </div>
      </div>

      <div className="formSection">
        <div>
          <label htmlFor="email" className="formLabel">Email</label>
          <input
            type="email"
            id="email"
            className="formInput"
            placeholder="Email"
            onChange={handleInputChange}
            defaultValue={formData.email}
          />
        </div>
        <div>
          <label htmlFor="contactNumber" className="formLabel">Contact Number</label>
          <input
            type="tel"
            id="contactNumber"
            className="formInput"
            placeholder="Contact Number"
            onChange={handleInputChange}
            defaultValue={formData.contactNumber}
          />
        </div>
      </div>

      <div className="formSection">
        <div>
          <label htmlFor="address" className="formLabel">Your Address</label>
          <input
            type="text"
            id="address"
            className="formInput"
            placeholder="Your Address"
            onChange={handleInputChange}
            defaultValue={formData.address}
          />
        </div>
      </div>

      <div className="formSection">
        <p className="formMessage">Would you like to leave us a message?</p>
        <div>
          <label htmlFor="message" className="formLabel">Message</label>
          <textarea
            id="message"
            className="formInput"
            placeholder="Leave us a message..."
            onChange={handleInputChange}
            defaultValue={formData.message}
          ></textarea>
        </div>
      </div>

      <div className="formSection">
        <h3 className="formTitle">How would you like us to reach out to you</h3>
        <div>
          <input
            type="radio"
            id="emailOption"
            className="formRadio"
            name="contactOption"
            value="Email"
            onChange={handleRadioChange}
            checked={formData.contactOption === 'Email'}
          />
          <label htmlFor="emailOption" className="formRadio">Email</label>
        </div>
        <div>
          <input
            type="radio"
            id="whatsappOption"
            className="formRadio"
            name="contactOption"
            value="WhatsApp"
            onChange={handleRadioChange}
            checked={formData.contactOption === 'WhatsApp'}
          />
          <label htmlFor="whatsappOption" className="formRadio">WhatsApp</label>
        </div>
        <div>
          <input
            type="radio"
            id="phonecallOption"
            className="formRadio"
            name="contactOption"
            value="Phonecall"
            onChange={handleRadioChange}
            checked={formData.contactOption === 'Phonecall'}
          />
          <label htmlFor="phonecallOption" className="formRadio">Phonecall</label>
        </div>
      </div>

      <input type="submit" className="formSubmit" value="Submit" />
    </form>
  );
};

export default MessageForm;
