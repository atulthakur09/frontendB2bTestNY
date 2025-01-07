import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function MyVehicle() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
          setError("Failed to fetch vehicles / no vehicle found.");
          console.error("Error fetching vehicles:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchVehicles();
  }, [user]);

  const handleOpenDialog = async (vehicleNumber) => {
    setSelectedVehicleNumber(vehicleNumber);
    setOpen(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/vehicles/${vehicleNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setServiceDetails(response.data);
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setServiceDetails(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-bg-MASTER min-h-screen p-4">
  <div className="p-1">
    <h2 className="text-3xl font-bold mb-6">My Vehicle</h2>

    {/* Search Box */}
    <div className="flex items-center mb-2">
      <input
        type="text"
        placeholder="Search by vehicle number"
        value={searchQuery}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md p-2 mr-4 w-1/5"
      />
    </div>

    {/* Display total number of vehicles */}
    <p className="mb-4 text-lg">
      Total Number of Registered Cars: {filteredVehicles.length}
    </p>

    <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-4">
    <Link
  to="/add-vehicle"
  className="inline-block px-4 py-2 text-white font-bold bg-blue-600 rounded hover:bg-blue-500  focus:outline-none focus:ring focus:ring-blue-300"
>
  Register new vehicle
</Link>

</p>

    

    {filteredVehicles.length > 0 ? (
      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">
              <center>S.No</center>
            </th>
            <th className="border px-4 py-2 text-left">
              <center>Vehicle</center>
            </th>
            <th className="border px-4 py-2 text-left">
              <center>Vehicle Number</center>
            </th>
            <th className="border px-4 py-2 text-left">
              <center>Vehicle Color</center>
            </th>
            <th className="border px-4 py-2 text-left">
              <center>Fuel Type</center>
            </th>
            <th className="border px-4 py-2 text-left">
              <center>Odometer Reading</center>
            </th>
            <th className="border px-4 py-2 text-left">
              <center>Contact Number</center>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map((vehicle, index) => (
            <tr key={vehicle._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border px-4 py-2">
                <center>
                  {vehicle.brand} {vehicle.model}
                </center>
              </td>
              <td className="border px-4 py-2">
                <center>{vehicle.vehicleNumber}</center>
              </td>
              <td className="border px-4 py-2">
                <center>{vehicle.vehicleColor}</center>
              </td>
              <td className="border px-4 py-2">
                <center>{vehicle.fuel}</center>
              </td>
              <td className="border px-4 py-2">
                <center>{vehicle.odometer}</center>
              </td>
              <td className="border px-4 py-2">
                <center>{vehicle.mobile}</center>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-red-500 mt-4">No vehicles found.</p>
    )}

    {/* Dialog to show service details */}
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
      <DialogTitle>
        Service Details for {selectedVehicleNumber}
      </DialogTitle>
      <DialogContent>
        {serviceDetails ? (
          <div className="p-4">
            <p className="mb-2">
              <strong>Service Type:</strong> {serviceDetails.serviceType}
            </p>
            <p className="mb-2">
              <strong>Date:</strong> {serviceDetails.date}
            </p>
            <p className="mb-2">
              <strong>Cost:</strong> {serviceDetails.cost}
            </p>
          </div>
        ) : (
          <p>Loading service details...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </div>
</div>

  
  );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material"; // Material-UI for Dialog

// export default function MyVehicle() {
//   const { user } = useAuth();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [open, setOpen] = useState(false); // State to handle Dialog open/close
//   const [serviceDetails, setServiceDetails] = useState(null); // State to hold service details
//   const [selectedVehicleNumber, setSelectedVehicleNumber] = useState(""); // Hold the selected vehicle number
//   const [searchQuery, setSearchQuery] = useState(""); // State for the search query
//   const [filteredVehicles, setFilteredVehicles] = useState([]); // State for filtered vehicles

//   useEffect(() => {
//     async function fetchVehicles() {
//       if (user && user._id) {
//         try {
//           const response = await axios.get(
//             `http://localhost:3777/vehicles/${user._id}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );
//           setVehicles(response.data);
//           setFilteredVehicles(response.data); // Initialize filtered vehicles with all vehicles
//         } catch (error) {
//           setError("Failed to fetch vehicles / no vehicle found.");
//           console.error("Error fetching vehicles:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     }
//     fetchVehicles();
//   }, [user]);

//   const handleOpenDialog = async (vehicleNumber) => {
//     setSelectedVehicleNumber(vehicleNumber); // Save vehicle number for tracking
//     setOpen(true); // Open dialog

//     try {
//       const response = await axios.get(
//         `http://localhost:3777/admin/vehicles/${vehicleNumber}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setServiceDetails(response.data); // Save service details in state
//     } catch (error) {
//       console.error("Error fetching service details:", error);
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpen(false); // Close dialog
//     setServiceDetails(null); // Clear service details when dialog is closed
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value); // Update search query state
//   };

//   const handleSearchClick = () => {
//     const filtered = vehicles.filter((vehicle) =>
//       vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredVehicles(filtered); // Set filtered vehicles based on search query
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="p-1 ">
//   <h2 className="text-3xl font-bold mb-6">My Vehicle</h2>

//   {/* Search Box */}
//   <div className="flex items-center mb-2">
//   <input
//     type="text"
//     placeholder="Search by vehicle number"
//     value={searchQuery}
//     onChange={handleSearchChange}
//     className="border border-gray-300 rounded-md p-2 mr-4 w-1/5"  
//   />
//   <button 
//     onClick={handleSearchClick} 
//     className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
//   >
//     Search
//   </button>
// </div>


//   {/* Display total number of vehicles */}
//   <p className="mb-4 text-lg">Total Number of Registered Cars: {filteredVehicles.length}</p>

//   {filteredVehicles.length > 0 ? (
//     <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="border px-4 py-2 text-left"><center>S.No</center></th>
//           <th className="border px-4 py-2 text-left"><center>Vehicle</center></th>
//           <th className="border px-4 py-2 text-left"><center>Vehicle Number</center></th>
//           <th className="border px-4 py-2 text-left"><center>Vehicle Color</center></th>
//           <th className="border px-4 py-2 text-left"><center>Fuel Type</center></th>
//           <th className="border px-4 py-2 text-left"><center>Odometer Reading</center></th>
//           <th className="border px-4 py-2 text-left"><center>Contact Number</center></th>
//           <th className="border px-4 py-2 text-left"><center>Service Details</center></th>
//           <th className="border px-4 py-2 text-left"><center>Actions</center></th>
//         </tr>
//       </thead>
//       <tbody>
//         {filteredVehicles.map((vehicle, index) => (
//           <tr key={vehicle._id} className="hover:bg-gray-50">
//             <td className="border px-4 py-2 text-center">{index + 1}</td>
//             <td className="border px-18 py-2"> <center>{vehicle.brand} {vehicle.model}</center></td>
//             <td className="border px-4 py-2"><center>{vehicle.vehicleNumber}</center></td>
//             <td className="border px-4 py-2"><center>{vehicle.vehicleColor}</center></td>
//             <td className="border px-4 py-2"><center>{vehicle.fuel}</center></td>
//             <td className="border px-4 py-2"><center>{vehicle.odometer}</center></td>
//             <td className="border px-4 py-2"><center>{vehicle.mobile}</center></td>
//             <td className="border px-4 py-2"><center>
//               <button 
//                 onClick={() => handleOpenDialog(vehicle.vehicleNumber)} 
//                 className="bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700 transition duration-200"
//               >
//                 View
//               </button></center>
//             </td>
//             <td className="border px-4 py-2"><center>
//               <button className="text-blue-600 hover:underline mr-2">Edit</button>
//               <button className="text-red-600 hover:underline">Delete</button>
//               </center>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   ) : (
//     <p className="text-red-500 mt-4">No vehicles found.</p>
//   )}

//   {/* Dialog to show service details */}
//   <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
//     <DialogTitle>Service Details for {selectedVehicleNumber}</DialogTitle>
//     <DialogContent>
//       {serviceDetails ? (
//         <div className="p-4">
//           <p className="mb-2"><strong>Service Type:</strong> {serviceDetails.serviceType}</p>
//           <p className="mb-2"><strong>Date:</strong> {serviceDetails.date}</p>
//           <p className="mb-2"><strong>Cost:</strong> {serviceDetails.cost}</p>
//           {/* Add other service details as needed */}
//         </div>
//       ) : (
//         <p>Loading service details...</p>
//       )}
//     </DialogContent>
//     <DialogActions>
//       <button 
//         onClick={handleCloseDialog} 
//         className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
//       >
//         Close
//       </button>
//     </DialogActions>
//   </Dialog>
// </div>

   
//   );
// }

