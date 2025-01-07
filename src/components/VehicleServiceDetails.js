import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './VehicleServiceDetails.css'; 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export default function VehicleServiceDetails() {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleNumber, setSelectedVehicleNumber] = useState("");
    const [vehicleDetails, setVehicleDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showItemsIndex, setShowItemsIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [filteredVehicles, setFilteredVehicles] = useState([]); // Stores filtered vehicles

    // Fetch all vehicles
    useEffect(() => {
        async function fetchVehicles() {
            if (user && user._id) {
                setLoading(true);
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
                    setFilteredVehicles(response.data); // Initialize filtered vehicles
                    setError(null);  // Reset any previous error
                } catch (error) {
                    setError(" vehicles not found / register your vehicle.");
                    console.error("Error fetching vehicles:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchVehicles();
    }, [user]);

    // Fetch service details for selected vehicle
    useEffect(() => {
        async function fetchVehicleServiceDetails() {
            if (user && selectedVehicleNumber) {
                setLoading(true);
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/service/register/${selectedVehicleNumber}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    setVehicleDetails(response.data);
                    setError(null);  // Reset error if data is found
                } catch (error) {
                    setError(`No service history found for vehicle ${selectedVehicleNumber}`);
                    setVehicleDetails([]);  // Clear the vehicle details on error
                    console.error('Error fetching vehicle details:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchVehicleServiceDetails();
    }, [selectedVehicleNumber, user]);

    const handleVehicleNumberChange = (event) => {
        setSelectedVehicleNumber(event.target.value);
    };

    const handleToggleItems = (index) => {
        setShowItemsIndex(showItemsIndex === index ? null : index); 
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toUpperCase()); 
    };

    const handleSearchClick = () => {
        const filtered = vehicles.filter((vehicle) =>
            vehicle.vehicleNumber.toUpperCase().includes(searchQuery)
        );
        setFilteredVehicles(filtered);
        
        // If a vehicle number matches the search, select it and fetch details
        if (filtered.length > 0) {
            setSelectedVehicleNumber(filtered[0].vehicleNumber); // Automatically select the first matching vehicle
        } else {
            setSelectedVehicleNumber(""); // Reset if no matches found
        }
    };

    // When a vehicle is selected from dropdown, fetch service details
    useEffect(() => {
        if (selectedVehicleNumber) {
            // Call the function to fetch details
            const fetchVehicleDetails = async () => {
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/service/register/${selectedVehicleNumber}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    setVehicleDetails(response.data);
                    setError(null);  // Reset error if data is found
                } catch (error) {
                    setError(`No service history found for vehicle ${selectedVehicleNumber}`);
                    setVehicleDetails([]);  // Clear the vehicle details on error
                }
            };
            fetchVehicleDetails();
        }
    }, [selectedVehicleNumber]); // Fetch vehicle details when the selected vehicle changes

    return (
        <div className="bg-bg-MASTER min-h-screen p-4">
            <h2 className='text-3xl font-bold mb-6'>Vehicle Service Details</h2>

            {/* Search Box */}
            <div className="search-box flex items-center space-x-4 mb-6">
  <input
    type="text"
    placeholder="Search by vehicle number"
    value={searchQuery}
    onChange={handleSearchChange}
    className="vehicle-search-input w-1/5  p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    onClick={handleSearchClick}
    className="search-button w-28 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
  >
    Search
  </button>
</div>


            {/* Dropdown for selecting vehicle */}
            <div className="selection-container">
                <label htmlFor="vehicleNumber">Select Vehicle: </label>
                <select 
                    id="vehicleNumber" 
                    value={selectedVehicleNumber} 
                    onChange={handleVehicleNumberChange}
                    className="vehicle-select"
                >
                    <option value="">-- Select a Vehicle --</option>
                    {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle, index) => (
                            <option key={index} value={vehicle.vehicleNumber}>
                                {vehicle.brand} {vehicle.model} ({vehicle.vehicleNumber})
                            </option>
                        ))
                    ) : (
                        <option disabled>No vehicles match the search</option>
                    )}
                </select>
            </div>

            {/* Show error or service details */}
            {error ? (
                <p className="error">{error}</p>
            ) : (
                vehicleDetails.length > 0 && (
                    <table className="vehicle-details-table">
                        <thead>
                            <tr>
                                <th>Vehicle</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Odometer</th>
                                <th>Total Amount</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicleDetails.map((vehicle, index) => (
                                <tr key={index}>
                                    <td>{vehicle.brand} {vehicle.model} ({vehicle.vehicleNumber})</td>
                                    <td>{vehicle.createdAt.slice(0, 10).split('-').reverse().join('-')}</td>
                                    <td>{vehicle.createdAt.slice(11, 19)}</td>
                                    <td>{vehicle.odometer}</td>
                                    <td>{vehicle.totalAmount}</td>
                                    <td>
                                        <button onClick={() => handleToggleItems(index)} className="toggle-button">
                                            {showItemsIndex === index ? 'Hide Items' : 'View Items'}
                                        </button>
                                        {showItemsIndex === index && (
                                            <table className="items-table">
                                                <thead>
                                                    <tr>
                                                        <th>Item Number</th>
                                                        <th>Part Name</th>
                                                        <th>Quantity</th>
                                                        <th>MRP</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vehicle.items.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>{item.itemNumber}</td>
                                                            <td>{item.partName}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.mrp}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            {/* Loading spinner */}
            {loading && <p className="loading">Loading...</p>}
        </div>
    );
}


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import './VehicleServiceDetails.css'; 

// export default function VehicleServiceDetails() {
//     const { user } = useAuth();
//     const [vehicles, setVehicles] = useState([]);
//     const [selectedVehicleNumber, setSelectedVehicleNumber] = useState("");
//     const [vehicleDetails, setVehicleDetails] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [showItemsIndex, setShowItemsIndex] = useState(null); // Tracks which row to show items for

//     // Fetch all vehicles
//     useEffect(() => {
//         async function fetchVehicles() {
//             if (user && user._id) {
//                 setLoading(true);
//                 try {
//                     const response = await axios.get(
//                         `http://localhost:3777/vehicles/${user._id}`,
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//                             },
//                         }
//                     );
//                     setVehicles(response.data);
//                 } catch (error) {
//                     setError("Failed to fetch vehicles.");
//                     console.error("Error fetching vehicles:", error);
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         }
//         fetchVehicles();
//     }, [user]);

//     // Fetch service details
//     useEffect(() => {
//         async function fetchVehicleServiceDetails() {
//             if (user && selectedVehicleNumber) {
//                 setLoading(true);
//                 try {
//                     const response = await axios.get(
//                         `http://localhost:3777/service/register/${selectedVehicleNumber}`,
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${localStorage.getItem('token')}`
//                             }
//                         }
//                     );
//                     setVehicleDetails(response.data);
//                 } catch (error) {
//                     setError(`No vehicle service history found for ${selectedVehicleNumber}`);
//                     console.error('Error fetching vehicle details:', error);
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         }
//         fetchVehicleServiceDetails();
//     }, [selectedVehicleNumber, user]);

//     const handleVehicleNumberChange = (event) => {
//         setSelectedVehicleNumber(event.target.value);
//     };

//     const handleToggleItems = (index) => {
//         setShowItemsIndex(showItemsIndex === index ? null : index); // Toggle the selected row
//     };

//     if (loading) return <p className="loading">Loading...</p>;
//     if (error) return <p className="error">{error}</p>;

//     return (
//         <div className="vehicle-service-details">
//             <h2>Vehicle Service Details</h2>

//             <div className="selection-container">
//                 <label htmlFor="vehicleNumber">Select Vehicle: </label>
//                 <select 
//                     id="vehicleNumber" 
//                     value={selectedVehicleNumber} 
//                     onChange={handleVehicleNumberChange}
//                     className="vehicle-select"
//                 >
//                     <option value="">  -- Select a Vehicle  --</option>
//                     {vehicles.map((vehicle, index) => (
//                         <option key={index} value={vehicle.vehicleNumber}>
//                             {vehicle.brand} {vehicle.model} ( {vehicle.vehicleNumber} )
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {vehicleDetails.length > 0 ? (
//                 <table className="vehicle-details-table">
//                     <thead>
//                         <tr>
//                             <th>Vehicle</th>
//                             <th>Date</th>
//                             <th>Time</th>
//                             <th>Odometer</th>
//                             <th>Total Amount</th>
//                             <th>Items</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {vehicleDetails.map((vehicle, index) => (
//                             <tr key={index}>
//                                 <td>{vehicle.brand} {vehicle.model} ({vehicle.vehicleNumber})</td>
//                                 <td>{vehicle.createdAt.slice(0, 10).split('-').reverse().join('-')}</td>
//                                 <td>{vehicle.createdAt.slice(11, 19)}</td>
//                                 <td>{vehicle.odometer}</td>
//                                 <td>{vehicle.totalAmount}</td>
//                                 <td>
//                                     <button onClick={() => handleToggleItems(index)} className="toggle-button">
//                                         {showItemsIndex === index ? 'Hide Items' : 'View Items'}
//                                     </button>
//                                     {showItemsIndex === index && (
//                                         <table className="items-table">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Item Number</th>
//                                                     <th>Part Name</th>
//                                                     <th>Quantity</th>
//                                                     <th>MRP</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {vehicle.items.map((item, idx) => (
//                                                     <tr key={idx}>
//                                                         <td>{item.itemNumber}</td>
//                                                         <td>{item.partName}</td>
//                                                         <td>{item.quantity}</td>
//                                                         <td>{item.mrp}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <p>No vehicle selected, please select to display details.</p>
//             )}
//         </div>
//     );
// }





// /* for list formate details */


// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { useAuth } from '../context/AuthContext';
// // import './VehicleServiceDetails.css'; 

// // export default function VehicleServiceDetails() {
// //     const { user } = useAuth();
// //     const [vehicles, setVehicles] = useState([]); 
// //     const [selectedVehicleNumber, setSelectedVehicleNumber] = useState(""); 
// //     const [vehicleDetails, setVehicleDetails] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState(null);
// //     const [showItems, setShowItems] = useState(false); // State for toggling item details

// //     // Fetch all vehicles
// //     useEffect(() => {
// //         async function fetchVehicles() {
// //             if (user && user._id) {
// //                 setLoading(true);
// //                 try {
// //                     const response = await axios.get(
// //                         `http://localhost:3777/vehicles/${user._id}`,
// //                         {
// //                             headers: {
// //                                 Authorization: `Bearer ${localStorage.getItem("token")}`,
// //                             },
// //                         }
// //                     );
// //                     setVehicles(response.data); 
// //                 } catch (error) {
// //                     setError("Failed to fetch vehicles.");
// //                     console.error("Error fetching vehicles:", error);
// //                 } finally {
// //                     setLoading(false);
// //                 }
// //             }
// //         }
// //         fetchVehicles();
// //     }, [user]);

// //     // Fetch service details
// //     useEffect(() => {
// //         async function fetchVehicleServiceDetails() {
// //             if (user && selectedVehicleNumber) {
// //                 setLoading(true);
// //                 try {
// //                     const response = await axios.get(
// //                         `http://localhost:3777/service/register/${selectedVehicleNumber}`,
// //                         {
// //                             headers: {
// //                                 Authorization: `Bearer ${localStorage.getItem('token')}`
// //                             }
// //                         }
// //                     );
// //                     setVehicleDetails(response.data);
// //                 } catch (error) {
// //                     setError(`No vehicle service history found for ${selectedVehicleNumber}`);
// //                     console.error('Error fetching vehicle details:', error);
// //                 } finally {
// //                     setLoading(false);
// //                 }
// //             }
// //         }
// //         fetchVehicleServiceDetails();
// //     }, [selectedVehicleNumber, user]);

// //     const handleVehicleNumberChange = (event) => {
// //         setSelectedVehicleNumber(event.target.value);
// //     };

// //     const handleToggleItems = () => {
// //         setShowItems(!showItems);
// //     };

// //     if (loading) return <p className="loading">Loading...</p>;
// //     if (error) return <p className="error">{error}</p>;

// //     return (
// //         <div className="vehicle-service-details">
// //             <h2>Vehicle Service Details</h2>

// //             <div className="selection-container">
// //                 <label htmlFor="vehicleNumber">Select Vehicle: </label>
// //                 <select 
// //                     id="vehicleNumber" 
// //                     value={selectedVehicleNumber} 
// //                     onChange={handleVehicleNumberChange}
// //                     className="vehicle-select"
// //                 >
// //                     <option value="">  -- Select a Vehicle  --</option>
// //                     {vehicles.map((vehicle, index) => (
// //                         <option key={index} value={vehicle.vehicleNumber}>
// //                             {vehicle.brand} {vehicle.model} ( {vehicle.vehicleNumber} )
// //                         </option>
// //                     ))}
// //                 </select>
// //             </div>

// //             {vehicleDetails.length > 0 ? (
// //                 <div className="vehicle-details-container">
// //                     {vehicleDetails.map((vehicle, index) => (
// //                         <div key={index} className="vehicle-detail-card">
// //                             <p><strong>Vehicle:</strong> {vehicle.brand} {vehicle.model} ( {vehicle.vehicleNumber} )</p>
// //                             {/* <p><strong>Date:</strong> {vehicle.createdAt.slice(0,10)}</p> */}
// //                             <p><strong>Date:</strong> {vehicle.createdAt.slice(0, 10).split('-').reverse().join('-')}</p>

// //                             <p><strong>Time:</strong> {vehicle.createdAt.slice(11,19)}</p>
// //                             {/* <p><strong>Fuel Type:</strong> {vehicle.fuel}</p> */}
// //                             <p><strong>Odometer:</strong> {vehicle.odometer}</p>

// //                             <h3>
// //                                 Items
// //                                 <button onClick={handleToggleItems} className="toggle-button">
// //                                     {showItems ? 'Hide Items' : 'Show Items'}
// //                                 </button>
// //                             </h3>
// //                             {showItems && (
// //                                 <ul className="item-list">
// //                                     {vehicle.items.map((item, idx) => (
// //                                         <li key={idx} className="item-card">
// //                                             <p><strong>Item Number:</strong> {item.itemNumber}</p>
// //                                             <p><strong>Part Name:</strong> {item.partName}</p>
// //                                             <p><strong>Quantity:</strong> {item.quantity}</p>
// //                                             <p><strong>MRP:</strong> {item.mrp}</p>
// //                                         </li>
// //                                     ))}
// //                                 </ul>
// //                             )}

// //                             <p><strong>Total Amount:</strong> {vehicle.totalAmount}</p>
// //                             <hr />
// //                         </div>
// //                     ))}
// //                 </div>
// //             ) : (
// //                 <p>No vehicle selected, please select to display details .</p>
// //             )}
// //         </div>
// //     );
// // }


// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import { useAuth } from '../context/AuthContext';
// // // import './VehicleServiceDetails.css'; 

// // // export default function VehicleServiceDetails() {
// // //     const { user } = useAuth();
// // //     const [vehicles, setVehicles] = useState([]); 
// // //     const [selectedVehicleNumber, setSelectedVehicleNumber] = useState(""); 
// // //     const [vehicleDetails, setVehicleDetails] = useState([]);
// // //     const [loading, setLoading] = useState(false);
// // //     const [error, setError] = useState(null);

// // //     // Fetch all vehicles
// // //     useEffect(() => {
// // //         async function fetchVehicles() {
// // //             if (user && user._id) {
// // //                 setLoading(true);
// // //                 try {
// // //                     const response = await axios.get(`http://localhost:3434/vehicles/${user._id}`,
// // //                         {
// // //                             headers: {
// // //                                 Authorization: `Bearer ${localStorage.getItem("token")}`,
// // //                             },
// // //                         }
// // //                     );
// // //                     setVehicles(response.data); 
// // //                 } catch (error) {
// // //                     setError("Failed to fetch vehicles.");
// // //                     console.error("Error fetching vehicles:", error);
// // //                 } finally {
// // //                     setLoading(false);
// // //                 }
// // //             }
// // //         }
// // //         fetchVehicles();
// // //     }, [user]);

// // //     // Fetch service details
// // //     useEffect(() => {
// // //         async function fetchVehicleServiceDetails() {
// // //             if (user && selectedVehicleNumber) {
// // //                 setLoading(true);
// // //                 try {
// // //                     const response = await axios.get(`http://localhost:3434/service/register/${selectedVehicleNumber}`,
// // //                         {
// // //                             headers: {
// // //                                 Authorization: `Bearer ${localStorage.getItem('token')}`
// // //                             }
// // //                         }
// // //                     );
// // //                     setVehicleDetails(response.data);
// // //                 } catch (error) {
// // //                     setError('Failed to fetch vehicle details.');
// // //                     console.error('Error fetching vehicle details:', error);
// // //                 } finally {
// // //                     setLoading(false);
// // //                 }
// // //             }
// // //         }
// // //         fetchVehicleServiceDetails();
// // //     }, [selectedVehicleNumber, user]);

// // //     const handleVehicleNumberChange = (event) => {
// // //         setSelectedVehicleNumber(event.target.value);
// // //     };

// // //     if (loading) return <p className="loading">Loading...</p>;
// // //     if (error) return <p className="error">{error}</p>;

// // //     return (
// // //         <div className="vehicle-service-details">
// // //             <h2>Vehicle Service Details </h2>

            
// // //             <div className="selection-container">
// // //                 <label htmlFor="vehicleNumber">Select Vehicle: </label>
// // //                 <select 
// // //                     id="vehicleNumber" 
// // //                     value={selectedVehicleNumber} 
// // //                     onChange={handleVehicleNumberChange}
// // //                     className="vehicle-select"
// // //                 >
// // //                     <option value="">-- Select a Vehicle Number --</option>
// // //                     {vehicles.map((vehicle, index) => (
// // //                         <option key={index} value={vehicle.vehicleNumber}>
// // //                             {vehicle.brand} {vehicle.model} ( {vehicle.fuel.toUpperCase()} ) ( {vehicle.vehicleNumber} )
// // //                         </option>
// // //                     ))}
// // //                 </select>
// // //             </div>

            
// // //             {vehicleDetails.length > 0 ? (
// // //                 <div className="vehicle-details-container">
// // //                     {vehicleDetails.map((vehicle, index) => (
// // //                         <div key={index} className="vehicle-detail-card">
// // //                             <p><strong>Vehicle:</strong> {vehicle.brand} {vehicle.model} ( {vehicle.vehicleNumber} )</p>
// // //                             <p><strong>Date:</strong> {vehicle.createdAt.slice(0,10)}</p>
// // //                             <p><strong>Time:</strong> {vehicle.createdAt.slice(11,19)}</p>
// // //                             <p><strong>Odometer:</strong> {vehicle.odometer}</p>

// // //                             <h3>Items</h3>
// // //                             <ul className="item-list">
// // //                                 {vehicle.items.map((item, idx) => (
// // //                                     <li key={idx} className="item-card">
// // //                                         <p><strong>Item Number:</strong> {item.itemNumber}</p>
// // //                                         <p><strong>Part Name:</strong> {item.partName}</p>
// // //                                         <p><strong>Quantity:</strong> {item.quantity}</p>
// // //                                         <p><strong>MRP:</strong> {item.mrp}</p>
// // //                                     </li>
// // //                                 ))}
// // //                             </ul>

// // //                             <p><strong>Total Amount:</strong> {vehicle.totalAmount}</p>
// // //                             <hr />
// // //                         </div>
// // //                     ))}
// // //                 </div>
// // //             ) : (
// // //                 <p>No vehicle details found.</p>
// // //             )}
// // //         </div>
// // //     );
// // // }
