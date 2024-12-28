import { Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from './components/Account';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';
import './App.css';





// B2B vehicles
import AddVehicle from './components/AddVehicle';
import MyVehicle from './components/MyVehicle';
import MyAppointment from './components/MyAppointment';

//AppointmentBooking
import AppointmentBooking from './components/AppointmentBooking';
import AppointmentBookingDealer from './components/AppointmentBookingDealer';


//B2B vehicle service 
import VehicleServiceDetails from './components/VehicleServiceDetails';
import Service from './components/Service';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
function App() {

  const { user, handleLogin,  handleLogout } = useAuth() 
  

  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        const response = await axios.get(`${API_BASE_URL}/users/account`, { 
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        handleLogin(response.data);
      })(); 
    }
  }, []); 
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 w-4/4">
  <h2 className="text-3xl font-bold text-gray-900 mb-8">Dr.MechNY Business To Business / Insurance </h2>

  <nav className="mb-6 space-x-4">
    <Link to="/" className="text-blue-600 hover:underline">Home</Link>
    {!user ? (
      <>
        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </>
    ) : (
      <>
        <Link to="/account" className="text-blue-600 hover:underline">Account</Link>
        <Link to="/my-vehicle" className="text-blue-600 hover:underline">My Vehicle</Link>
        <Link to="/add-vehicle" className="text-blue-600 hover:underline">Register Vehicle</Link>
        <Link to="/my-appointment" className="text-blue-600 hover:underline">My Appointment</Link>
        <Link to="/appointment-booking" className="text-blue-600 hover:underline">Appointment Booking</Link>
        <Link to="/vehicle-service-details" className="text-blue-600 hover:underline">Service Details</Link>

        <Link 
          to="/" 
          className="text-red-600 hover:underline"
          onClick={() => {
            localStorage.removeItem('token');
            handleLogout();
          }}>
          Logout
        </Link>
      </>
    )}
  </nav>

  <div className="w-full max-w-8xl bg-white shadow-lg rounded-lg p-6 space-y-6">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/account" element={
        <PrivateRoute permittedRoles={['b2b']}>
          <Account />
        </PrivateRoute>
      } />
      
      <Route path="/add-vehicle" element={
        <PrivateRoute permittedRoles={['b2b']}>
          <AddVehicle />
        </PrivateRoute>
      } />

      <Route path="/my-vehicle" element={
        <PrivateRoute permittedRoles={['b2b']}>
          <MyVehicle />
        </PrivateRoute>
      } />
      
      <Route path="/my-appointment" element={
        <PrivateRoute permittedRoles={['b2b']}>
          <MyAppointment />
        </PrivateRoute>
      } />
      
      <Route path="/appointment-booking" element={
        <PrivateRoute permittedRoles={['b2b']}>
          <AppointmentBooking />
        </PrivateRoute>
      } />

      <Route path="/appointment-booking-dealer" element={
        <PrivateRoute permittedRoles={['b2b']}>
          <AppointmentBookingDealer />
        </PrivateRoute>
      } />

      <Route path="/service" element={
        <PrivateRoute permittedRoles={['b2b']}>
          <Service />
        </PrivateRoute>
      } />

      <Route path="/vehicle-service-details" element={
        <PrivateRoute permittedRoles={['b2b']}>
          <VehicleServiceDetails />
        </PrivateRoute>
      } />

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  </div>
</div>

    
//     <div>
//       <h2>Vehicle Doctor Business To Business (B2B) </h2>
//       <Link to="/">Home</Link> |
//           { !user ? (
//             <>
//               <Link to="/register">Register</Link> |
//               <Link to="/login"> Login </Link> | 
//             </> 
//           ): (
//             <>
//                 <Link to="/account">Account</Link> |


//                 <Link to="/my-vehicle">My Vehicle</Link> |
//                 <Link to="/add-vehicle">Register Vehicle</Link> |
//                 <Link to="/my-appointment">My Appointment</Link> |
//                 <Link to="/appointment-booking">Appointment Booking</Link> |
//                 <Link to="/vehicle-service-details"> Service Details</Link> | 
                
//                 <Link to="/" onClick={() => {
//                   localStorage.removeItem('token')
//                   handleLogout()
//                 }}> Logout </Link> | 
//               </> 
//           )}
          
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/account" element={
//           <PrivateRoute permittedRoles={['b2b']}>
//             <Account />
//           </PrivateRoute>
//         } />


// <Route path="/add-vehicle" element={
//         <PrivateRoute permittedRoles={['b2b']}>
//           <AddVehicle />
//         </PrivateRoute>
//       } />
//       <Route path="/my-vehicle" element={
//         <PrivateRoute permittedRoles={['b2b']}>
//           <MyVehicle />
//         </PrivateRoute>
//       } />
//       <Route path="/my-appointment" element={
//         <PrivateRoute permittedRoles={['b2b']}>
//           <MyAppointment />
//         </PrivateRoute>
//       } /> 
//       <Route path="/appointment-booking" element={
//         <PrivateRoute permittedRoles={['b2b']}>
//           <AppointmentBooking />
//         </PrivateRoute>
//       } />


// <Route path="/appointment-booking-dealer" element={
//         <PrivateRoute permittedRoles={['b2b']}>
//           <AppointmentBookingDealer />
//         </PrivateRoute>
//       } />


// <Route path="/service" element={
//         <PrivateRoute permittedRoles={['b2b']}>
//           <Service />
//         </PrivateRoute>
//       } />

// <Route path="/vehicle-service-details" element={
//         <PrivateRoute permittedRoles={['b2b']}>         
//           <VehicleServiceDetails />
//         </PrivateRoute>
//       } />


        

//         <Route path="/unauthorized" element={<Unauthorized /> } />
//       </Routes>
//     </div>
);
}

export default App;
