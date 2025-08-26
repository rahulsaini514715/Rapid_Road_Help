import React from 'react'
import "./About_Us.css"
import { useNavigate } from "react-router-dom";

function About_Us() {

  const navigate = useNavigate();
  
    const handle_Book_Ass = (e) => {
      e.preventDefault();
      // TODO: Add login logic here
      console.log("Login submitted");
      // Example: navigate to dashboard after login
      navigate("/service");
    };
  return (
    <div className='About_Us lh-1'>
        <h2 className='text-center mb-3'>On Road Vehicle Breakdown Help System</h2>
        <h4 lh-3>We are available 24×7 – How can we help you today?</h4>
        <hr />
        <h4 lh-3> Book Assistance Now    <button className='Book_Now_Button' onClick={() => navigate("/services")}>Book now</button></h4>
       
        <hr />
        
        <div className='Services mt-2 fw-semibold '>
        <h4 className='text-center'>Services</h4>
        <p>🚨 Emergency Breakdown Assistance – Request immediate help.</p>
        <p>🛢 Fuel Delivery – Out of fuel? Get fuel at your location.</p>
        <p>🔧 Flat Tyre / Puncture Repair – On-spot tyre change/repair.</p>
        <p>🔋 Battery Jumpstart – Dead battery? Get jumpstart service.</p>
        <p>🚚 Towing Service – Vehicle towing to nearest garage.</p>
        <p>🛠 Minor On-Site Repairs – Quick fixes without towing.</p>
        </div>
    </div>
  )
}

export default About_Us
