import React from 'react';
import { useLocation } from 'react-router-dom';

const AppointmentBookingDealer = () => {
  const location = useLocation();
  const { dealerId, userId } = location.state || {}; // Destructure the dealerId and userId from state

  return (
    <div>
      <h1>Appointment Booking</h1>
      <p>Dealer ID: {dealerId}</p>
      <p>User ID: {userId}</p>
      {/* Add form for booking appointment */}
    </div>
  );
};

export default AppointmentBookingDealer;
