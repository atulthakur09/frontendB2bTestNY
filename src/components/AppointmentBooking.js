import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import axios from "axios";
import validator from "validator";
import { useAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import AppointmentImages from "./extra-comp/AppointmentImages";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AppointmentBooking = () => {
  const { user } = useAuth(); // Get the authenticated user
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]); // State to hold vehicle details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null); // State for selected dealer

  const generateQuotationNo = () => {
    const prefix = "B2B";
    // const timestamp = Date.now().toString(36);
    const randomChars = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    return `${prefix}-${randomChars}`;
  };
  const generateBookingId = () => {
    const prefix1 = "BOOKING-ID";
    const timestamp = Date.now().toString(36);
    const randomChars1 = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    return `${prefix1}-${timestamp}-${randomChars1}`;
  };

  // State for form data
  const [formData, setFormData] = useState({
    userId: user ? user._id : "",
    partnerId: selectedPartner ? selectedPartner._id : "",
    name: user ? user.username : "",
    contact: "",
    email: user ? user.email : "",
    date: "",
    timeSlot: "",
    vehicleNumber: "",
    serviceType: "",
    pickupAndDrop: "",
    pickupAndDropAddress: "",
    quotationNo: generateQuotationNo(),
    bookingId: generateBookingId(),
  });

  const [errors, setErrors] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false); // State for modal dialog

  // Time slots options
  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
  ];

  // Service types options
  const serviceTypes = [
    "AC Service & Repair",
    "Batteries",
    "Car Spa & Cleaning",
    "Clutch & Body Parts",
    "Denting & Paint",
    "Detailing Service",
    "General Service",
    "Major Service",
    "Oil Change",
    "Periodic Service",
    "Suspension & Fitment",
    "Tyre & Wheel",
    "Windshield & Lights",
  ];

  // Fetch vehicles when the component mounts
  useEffect(() => {
    async function fetchVehicles() {
      if (user && user._id) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/vehicles/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setVehicles(response.data);
        } catch (error) {
          setError("Failed to fetch vehicles.");
          console.error("Error fetching vehicles:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchVehicles();
  }, [user]);

  // Fetch states when the component mounts
  useEffect(() => {
    const fetchedStates = State.getStatesOfCountry("IN");
    setStates(fetchedStates);
  }, []);

  // Fetch cities when a state is selected
  const handleStateChange = (event) => {
    const stateCode = event.target.value;
    setSelectedState(stateCode);
    setSelectedCity("");
    const fetchedCities = City.getCitiesOfState("IN", stateCode);
    setCities(fetchedCities);
  };

  // Handle city selection
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  // Handle select dealer button click
  const handleSelectDealer = (partner) => {
    setSelectedPartner(partner);
    setDialogOpen(true); // Open dialog when dealer is selected
  };

  // const handlePickupAndDropChange = (e) => {
  //   const value = e.target.value === 'Yes' || 1 ? true : false; // Convert 'Yes' to true, 'No' to false
  //   setFormData({
  //     ...formData,
  //     pickupAndDrop: value // Store the boolean value
  //   });
  // };
  const handlePickupAndDropChange = (e) => {
    const value =
      e.target.value === "Yes" ? true : e.target.value === "No" ? false : null;
    setFormData({
      ...formData,
      pickupAndDrop: value, // Store the boolean value or null
    });
  };

  useEffect(() => {
    if (selectedState && selectedCity) {
      const stateName = getStateName(selectedState);
      setLoading(true);
      axios
        .get(
          `${API_BASE_URL}/allPartnerList?state=${stateName}&city=${selectedCity}`
        )
        .then((response) => {
          setAppointments(response.data);
          setError(null);
        })
        .catch((err) => {
          setError("No dealer found in your location.");
          setAppointments([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedState, selectedCity]);

  const getStateName = (stateCode) => {
    const state = states.find((s) => s.isoCode === stateCode);
    return state ? state.name : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(formData.contact)) {
      errors.contact = "Invalid mobile number. It should be a 10-digit number.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.vehicleNumber.trim()) {
      errors.vehicleNumber = "Vehicle registration number is required";
    }
    if (!formData.date.trim()) errors.date = "Date is required";
    if (!formData.timeSlot) errors.timeSlot = "Time slot is required";
    if (!formData.serviceType) errors.serviceType = "Service type is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        // const response = await axios.post(`${API_BASE_URL}/user/bookYourAppointment`, {
        const response = await axios.post(
          `${API_BASE_URL}/estService/register`,
          {
            ...formData,
            partnerId: selectedPartner._id,
          }
        );
        alert("Booking registered successfully!");
        setFormData({
          userId: user._id,
          partnerId: selectedPartner._id,
          name: user.username,
          contact: "",
          email: user.email,
          date: "",
          timeSlot: "",
          vehicleNumber: "",
          serviceType: "",
          pickupAndDrop: "",
          pickupAndDropAddress: formData.pickupAndDrop
            ? formData.pickupAndDropAddress
            : undefined,
        });
        setSelectedPartner(null);
        setDialogOpen(false); // Close dialog after successful booking
      } catch (error) {
        console.error(
          "Error booking appointment:",
          error.response?.data || error.message
        );
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="bg-bg-MASTER min-h-screen py-5">
      <div className="pp max-w-7xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        {/* State dropdown */}
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700"
        >
          Select State:
        </label>
        <select
          id="state"
          value={selectedState}
          onChange={handleStateChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="">--Select State--</option>
          {states.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>

        {/* City dropdown */}
        {selectedState && (
          <>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Select City:
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={handleCityChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">--Select City--</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </>
        )}

        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          {`Dealer in ${selectedCity} ${getStateName(selectedState)}`}
        </h3>

        {loading ? (
          <div className="mt-4 text-gray-600">
            Please select a state and city to continue booking.
          </div>
        ) : error ? (
          <div className="mt-4 text-red-600">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="mt-4 text-gray-600">
            Select state-city to book an appointment.
          </div>
        ) : (
          <div className="appointment-list mt-6 space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="appointment-card p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {appointment.workshopName}
                </h3>
                <div className="mt-2">
                  {/* <strong>Shop Images:</strong> */}
                  <AppointmentImages appointment={appointment} />
                </div>
                <p className="mt-2">
                  <strong>Address:</strong> {appointment.address},{" "}
                  {appointment.city}, {appointment.state}, {appointment.pinCode}
                </p>
                <div className="mt-2">
                  <strong>Live Location:</strong>
                  <p>
                    Latitude: {appointment.liveLocation.lat}, Longitude:{" "}
                    {appointment.liveLocation.lng}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleSelectDealer(appointment);
                  }}
                  className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dialog for booking appointment */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle className="text-lg font-semibold">
            Book Appointment
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.contact}
                helperText={errors.contact}
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                error={!!errors.email}
                helperText={errors.email}
              />
              {/* Vehicle Number selection */}
              <TextField
                select
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.vehicleNumber}
                helperText={errors.vehicleNumber}
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle._id} value={vehicle.vehicleNumber}>
                    {vehicle.vehicleNumber} ({vehicle.brand} {vehicle.model})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                label="Appointment Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0], // No past dates
                  max: new Date(new Date().setDate(new Date().getDate() + 15))
                    .toISOString()
                    .split("T")[0], // No more than 15 days in the future
                }}
              />

              {/* <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
          /> */}
              <TextField
                select
                label="Time Slot"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.timeSlot}
                helperText={errors.timeSlot}
              >
                {timeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Service Type"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.serviceType}
                helperText={errors.serviceType}
              >
                {serviceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Pickup and Drop"
                name="pickupAndDrop"
                value={
                  formData.pickupAndDrop === true
                    ? "Yes"
                    : formData.pickupAndDrop === false
                    ? "No"
                    : ""
                } // Empty if undefined/null
                onChange={handlePickupAndDropChange} // Handle updates
                fullWidth
                margin="normal"
                select
                error={!!errors.pickupAndDrop}
                helperText={errors.pickupAndDrop}
              >
                <MenuItem value="">Select an option</MenuItem>{" "}
                {/* Default empty option */}
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>

              {/* pickupAndDropAddress */}
              <TextField
                label="Address"
                name="pickupAndDropAddress"
                value={formData.pickupAndDropAddress}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.pickupAndDropAddress}
                helperText={errors.pickupAndDropAddress}
              />

              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" color="primary">
                  Book Appointment
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    //   <div class="bg-bg-MASTER min-h-screen py-5">
    //     <div className="pp max-w-7xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
    //   {/* State dropdown */}
    //   <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    //     Select State:
    //   </label>
    //   <select
    //     id="state"
    //     value={selectedState}
    //     onChange={handleStateChange}
    //     className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    //   >
    //     <option value="">--Select State--</option>
    //     {states.map((state) => (
    //       <option key={state.isoCode} value={state.isoCode}>
    //         {state.name}
    //       </option>
    //     ))}
    //   </select>

    //   {/* City dropdown */}
    //   {selectedState && (
    //     <>
    //       <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
    //         Select City:
    //       </label>
    //       <select
    //         id="city"
    //         value={selectedCity}
    //         onChange={handleCityChange}
    //         className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    //       >
    //         <option value="">--Select City--</option>
    //         {cities.map((city) => (
    //           <option key={city.name} value={city.name}>
    //             {city.name}
    //           </option>
    //         ))}
    //       </select>
    //     </>
    //   )}

    //   <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
    //     {`Dealer in ${selectedCity} ${getStateName(selectedState)}`}
    //   </h3>

    //   {loading ? (
    //     <div className="mt-4 text-gray-600 dark:text-gray-300">Please select a state and city to continue booking.</div>
    //   ) : error ? (
    //     <div className="mt-4 text-red-600 dark:text-red-400">{error}</div>
    //   ) : appointments.length === 0 ? (
    //     <div className="mt-4 text-gray-600 dark:text-gray-300">Select state-city to book an appointment.</div>
    //   ) : (
    //     <div className="appointment-list mt-6 space-y-4">
    //       {appointments.map((appointment) => (
    //         <div key={appointment._id} className="appointment-card p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
    //           <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{appointment.workshopName}</h3>
    //           <div className="mt-2">
    //             {/* <strong>Shop Images:</strong> */}
    //             <AppointmentImages appointment={appointment} />
    //             {/* <strong>Shop Images:</strong>
    //             <div className="flex space-x-2 mt-2">
    //               {appointment.shopImages.map((image, index) => (
    //                 <img key={index} src={image} alt="Shop" className="w-32 h-32 object-cover rounded" />
    //               ))}
    //             </div> */}
    //           </div>
    //           <p className="mt-2">
    //             <strong>Address:</strong> {appointment.address}, {appointment.city}, {appointment.state}, {appointment.pinCode}
    //           </p>
    //           <div className="mt-2">
    //             <strong>Live Location:</strong>
    //             <p>
    //               Latitude: {appointment.liveLocation.lat}, Longitude: {appointment.liveLocation.lng}
    //             </p>
    //           </div>
    //           <button
    //             onClick={() => {
    //               handleSelectDealer(appointment);
    //             }}
    //             className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
    //           >
    //             Book Appointment
    //           </button>
    //         </div>
    //       ))}
    //     </div>
    //   )}

    //   {/* Dialog for booking appointment */}
    //   <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
    //     <DialogTitle className="text-lg font-semibold">Book Appointment</DialogTitle>
    //     <DialogContent>
    //       <form onSubmit={handleSubmit}>
    //         <TextField
    //           label="Name"
    //           name="name"
    //           value={formData.name}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //           InputProps={{
    //             readOnly: true,
    //           }}
    //           error={!!errors.name}
    //           helperText={errors.name}
    //         />
    //         <TextField
    //           label="Contact Number"
    //           name="contact"
    //           value={formData.contact}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //           error={!!errors.contact}
    //           helperText={errors.contact}
    //         />
    //         <TextField
    //           label="Email"
    //           name="email"
    //           value={formData.email}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //           InputProps={{
    //             readOnly: true,
    //           }}
    //           error={!!errors.email}
    //           helperText={errors.email}
    //         />
    //         {/* Vehicle Number selection */}
    //         <TextField
    //           select
    //           label="Vehicle Number"
    //           name="vehicleNumber"
    //           value={formData.vehicleNumber}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //           error={!!errors.vehicleNumber}
    //           helperText={errors.vehicleNumber}
    //         >
    //           {vehicles.map((vehicle) => (
    //             <MenuItem key={vehicle._id} value={vehicle.vehicleNumber}>
    //               {vehicle.vehicleNumber} ({vehicle.brand} {vehicle.model})
    //             </MenuItem>
    //           ))}
    //         </TextField>
    //         <TextField
    //           label="Date"
    //           type="date"
    //           name="date"
    //           value={formData.date}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //           error={!!errors.date}
    //           helperText={errors.date}
    //           InputLabelProps={{ shrink: true }}
    //         />
    //         <TextField
    //           select
    //           label="Time Slot"
    //           name="timeSlot"
    //           value={formData.timeSlot}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //           error={!!errors.timeSlot}
    //           helperText={errors.timeSlot}
    //         >
    //           {timeSlots.map((slot) => (
    //             <MenuItem key={slot} value={slot}>
    //               {slot}
    //             </MenuItem>
    //           ))}
    //         </TextField>
    //         <TextField
    //           select
    //           label="Service Type"
    //           name="serviceType"
    //           value={formData.serviceType}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //           error={!!errors.serviceType}
    //           helperText={errors.serviceType}
    //         >
    //           {serviceTypes.map((type) => (
    //             <MenuItem key={type} value={type}>
    //               {type}
    //             </MenuItem>
    //           ))}
    //         </TextField>

    //         <TextField
    //   label="Pickup and Drop"
    //   name="pickupAndDrop"
    //   value={
    //     formData.pickupAndDrop === true
    //       ? 'Yes'
    //       : formData.pickupAndDrop === false
    //       ? 'No'
    //       : ''
    //   } // Empty if undefined/null
    //   onChange={handlePickupAndDropChange} // Handle updates
    //   fullWidth
    //   margin="normal"
    //   select
    //   error={!!errors.pickupAndDrop}
    //   helperText={errors.pickupAndDrop}
    // >
    //   <MenuItem value="">Select an option</MenuItem> {/* Default empty option */}
    //   <MenuItem value="Yes">Yes</MenuItem>
    //   <MenuItem value="No">No</MenuItem>
    // </TextField>

    //         {/* <TextField
    //   label="Pickup and Drop"
    //   name="pickupAndDrop"
    //   value={formData.pickupAndDrop ? 'Yes' : 'No'} // Display 'Yes' if true, 'No' if false
    //   onChange={handlePickupAndDropChange} // Handle updates
    //   fullWidth
    //   margin="normal"
    //   select
    //   error={!!errors.pickupAndDrop}
    //   helperText={errors.pickupAndDrop}
    // >
    //   <MenuItem value="Yes">Yes</MenuItem>
    //   <MenuItem value="No">No</MenuItem>
    // </TextField> */}

    //         {/* <TextField
    //   label="Pickup and Drop"
    //   name="pickupAndDrop"
    //   value={formData.pickupAndDrop ? 'Yes' : 'No'} // Display 'Yes' if true, 'No' if false
    //   onChange={handlePickupAndDropChange} // Use a separate handler for this field
    //   fullWidth
    //   margin="normal"
    //   select
    //   error={!!errors.pickupAndDrop}
    //   helperText={errors.pickupAndDrop}
    // >
    //   <MenuItem value="Yes">Yes</MenuItem>
    //   <MenuItem value="No">No</MenuItem>
    // </TextField> */}
    // {/*

    //         {/* <TextField
    //   label="Pickup and Drop"
    //   name="pickupAndDrop"
    //   value={formData.pickupAndDrop}
    //   onChange={handleChange}
    //   fullWidth
    //   margin="normal"
    //   select
    //   error={!!errors.pickupAndDrop}
    //   helperText={errors.pickupAndDrop}
    // >
    //   <MenuItem value="Yes">Yes</MenuItem>
    //   <MenuItem value="No">No</MenuItem>
    // </TextField> */}

    //         {/* pickupAndDropAddress */}
    //         <TextField
    //           label="Address"
    //           name="pickupAndDropAddress"
    //           value={formData.pickupAndDropAddress}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"

    //           error={!!errors.pickupAndDropAddress}
    //           helperText={errors.pickupAndDropAddress}
    //         />

    //         <DialogActions>
    //           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
    //           <Button type="submit" color="primary">
    //             Book Appointment
    //           </Button>
    //         </DialogActions>
    //       </form>
    //     </DialogContent>
    //   </Dialog>
    // </div>
    //   </div>
  );
};

export default AppointmentBooking;
