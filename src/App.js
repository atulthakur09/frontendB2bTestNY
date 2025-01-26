import { Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Unauthorized from "./components/Unauthorized";
import "./App.css";
import defaultLogo from "./images/2.svg";
import Footer from "./components/extra-comp/Footer";

// B2B vehicles
import AddVehicle from "./components/AddVehicle";
import MyVehicle from "./components/MyVehicle";
import MyAppointment from "./components/MyAppointment";

//AppointmentBooking
import AppointmentBooking from "./components/AppointmentBooking";
import AppointmentBookingDealer from "./components/AppointmentBookingDealer";

//B2B vehicle service
import VehicleServiceDetails from "./components/VehicleServiceDetails";
import Service from "./components/Service";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
function App() {
  const { user, handleLogin, handleLogout } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      (async () => {
        const response = await axios.get(`${API_BASE_URL}/users/account`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        handleLogin(response.data);
      })();
    }
  }, []);

  return (
    <div className=" bg-bg-MASTER">
      <header class="flex items-center justify-between py-1 px-6 bg-orange-100">
        <div class="flex items-center">
          <Link to="/">
            <img
              src={defaultLogo}
              alt="Dr. MechNY Logo"
              style={{ width: "40px", height: "40px" }}
            />
          </Link>
          <Link to="/" className="ml-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-black">
              Dr. MechNY Business
            </h2>
          </Link>
        </div>
      </header>
      {/* <h2 className="text-2xl font-bold bg-slate-100 text-gray-900 mb-8 py-1"> Business To Business / Insurance </h2> */}
      <nav className="flex justify-end space-x-4 bg-bg-nav-bar p-4">
        <Link to="/" className="text-gray-600 hover:font-bold">
          Home
        </Link>
        {!user ? (
          <>
            <Link to="/register" className="text-gray-600 hover:font-bold">
              Register
            </Link>
            <Link to="/login" className="text-gray-600 hover:font-bold">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/account" className="text-gray-600 hover:font-bold">
              Account
            </Link>
            <Link to="/my-vehicle" className="text-gray-600 hover:font-bold">
              My Vehicle
            </Link>
            <Link to="/add-vehicle" className="text-gray-600 hover:font-bold">
              Register Vehicle
            </Link>
            <Link
              to="/my-appointment"
              className="text-gray-600 hover:font-bold"
            >
              My Appointment
            </Link>
            <Link
              to="/appointment-booking"
              className="text-gray-600 hover:font-bold"
            >
              Appointment Booking
            </Link>
            <Link
              to="/vehicle-service-details"
              className="text-gray-600 hover:font-bold"
            >
              Service Details
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:font-bold"
              onClick={() => {
                localStorage.removeItem("token");
                handleLogout();
              }}
            >
              Logout
            </Link>
          </>
        )}
      </nav>

      <div className="w-full max-w-8xl shadow-lg rounded-lg p-6 space-y-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/account"
            element={
              <PrivateRoute permittedRoles={["b2b"]}>
                <Account />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-vehicle"
            element={
              <PrivateRoute permittedRoles={["b2b"]}>
                <AddVehicle />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-vehicle"
            element={
              <PrivateRoute permittedRoles={["b2b"]}>
                <MyVehicle />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-appointment"
            element={
              <PrivateRoute permittedRoles={["b2b"]}>
                <MyAppointment />
              </PrivateRoute>
            }
          />

          <Route
            path="/appointment-booking"
            element={
              <PrivateRoute permittedRoles={["b2b"]}>
                <AppointmentBooking />
              </PrivateRoute>
            }
          />

          <Route
            path="/appointment-booking-dealer"
            element={
              <PrivateRoute permittedRoles={["b2b"]}>
                <AppointmentBookingDealer />
              </PrivateRoute>
            }
          />

          <Route
            path="/service"
            element={
              <PrivateRoute permittedRoles={["b2b"]}>
                <Service />
              </PrivateRoute>
            }
          />

          <Route
            path="/vehicle-service-details"
            element={
              <PrivateRoute permittedRoles={["b2b"]}>
                <VehicleServiceDetails />
              </PrivateRoute>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
