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
    const [estimationDetails, setEstimationDetails] = useState([]);
    const [partners, setPartners] = useState([]);

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


    // Fetch estimation service details
    useEffect(() => {
        async function fetchEstimationDetails() {
            if (user && user._id) {
                setLoading(true);
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/user/estService/registerApproval/${user._id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    setEstimationDetails(response.data);
                    setError(null);
                } catch (error) {
                    setError("Error fetching estimation details.");
                    console.error("Error fetching estimation details:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchEstimationDetails();
    }, [user]);

    useEffect(() => {
        async function fetchRegisteredPartner() {
          if (user && user._id) {
            try {
              const response = await axios.get(
                `${API_BASE_URL}/partner/${user._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              setPartners([response.data]); // Wrap response data in an array
            } catch (error) {
              setError("Failed to fetch Partner details.");
              console.error("Error fetching Partner details:", error);
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        }
        fetchRegisteredPartner();
      }, [user]);

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

            {/* Display Estimation Details */}
            {estimationDetails.length > 0 && (
                <div className="estimation-details">
                    <h3 className="text-xl font-bold mb-4">Pre-Estimation Approval Details</h3>
                    <table className="vehicle-details-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Workshop Name</th>
                                <th>Workshop Contact No.</th>
                                <th>Workshop Address</th>
                                <th>Vehicle Number</th>
                                <th>Model</th>
                                <th>Odometer</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>E-mail</th>
                                <th>Address</th>
                                <th>Items</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estimationDetails.map((estimation, index) => (
                                <tr key={index}>
                                    <td>{estimation.workshopName}</td>
                                    <td>{estimation.mobileNumber}</td>
                                    <td>{estimation.saddress}</td>
                                    <td>{estimation.vehicleNumber}</td>
                                    <td>{estimation.model}</td>
                                    <td>{estimation.odometer}</td>
                                    <td>{estimation.username}</td>
                                    <td>{estimation.mobile}</td>
                                    <td>{estimation.email}</td>
                                    <td>{estimation.address}</td>
                                    <td>{estimation.totalAmount}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleItems(index)}
                                            className="toggle-button"
                                        >
                                            {showItemsIndex === index ? 'Hide Items' : 'View Items'}
                                        </button>
                                        {showItemsIndex === index && (
                                            <ul>
                                                {estimation.items.map((item, idx) => (
                                                    <li key={idx}>
                                                        {item.partName} - {item.quantity} x {item.mrp}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>


    );
}
