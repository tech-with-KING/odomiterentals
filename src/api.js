import React from "react";
import axios from "axios";

const loging = async () => {
  try {
    const credentials = { email: 'donie@gmai.com', password: 'trent' };
    const response = await axios.post('http://localhost:8000/auth/login', credentials);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Axios error:', error.response ? error.response.data : error.message);
  }
};
export default  loging;
