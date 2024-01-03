import React, { useState } from 'react';
import "./style.css"
const MessageForm = () =>{
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

			<form id="myForm">
  <div class="formSection">
    <div>
      <label for="firstName" class="formLabel">First Name</label>
      <input type="text" id="firstName" class="formInput" placeholder="First Name"></input>
    </div>
    <div>
      <label for="otherNames" class="formLabel">Other Names</label>
      <input type="text" id="otherNames" class="formInput" placeholder="Other Names"></input>
    </div>
  </div>

  <div class="formSection">
    <div>
      <label for="email" class="formLabel">Email</label>
      <input type="email" id="email" class="formInput" placeholder="Email"></input>
    </div>
    <div>
      <label for="contactNumber" class="formLabel">Contact Number</label>
      <input type="tel" id="contactNumber" class="formInput" placeholder="Contact Number"></input>
    </div>
  </div>

  <div class="formSection">
    <div>
      <label for="address" class="formLabel">Your Address</label>
      <input type="text" id="address" class="formInput" placeholder="Your Address"></input>
    </div>
  </div>

  <div class="formSection">
    <p class="formMessage">Would you like to leave us a message?</p>
    <div>
      <label for="message" class="formLabel">Message</label>
      <textarea  type="text" id="message" class="formInput" placeholder="Leave us a message..."></textarea>
    </div>
  </div>

  <div class="formSection ">
    <h3 class="formTitle">How would you like us to reach out to you</h3>
    <div>
	<input type="radio" id="emailOption" class="formRadio" name="contactOption" value="Email"></input>
      <label for="emailOption" class="formRadio">Email</label>
      
    </div>
    <div>
	<input type="radio" id="whatsappOption" class="formRadio" name="contactOption" value="WhatsApp"></input>
      <label for="whatsappOption" class="formRadio">WhatsApp</label>
      
    </div>
    <div>
	<input type="radio" id="phonecallOption" class="formRadio" name="contactOption" value="Phonecall"></input>
      <label for="phonecallOption" class="formRadio">Phonecall</label>
      
    </div>
  </div>

  <input type="submit" class="formSubmit" value="Submit"></input>
</form>

		
        );
}

export default MessageForm;
