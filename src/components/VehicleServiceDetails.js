import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./VehicleServiceDetails.css";
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

  // Fetch all vehicles for dropdown
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
          setError(null); // Reset any previous error
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
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setVehicleDetails(response.data);
          setError(null); // Reset error if data is found
        } catch (error) {
          setError(
            `No service history found for vehicle ${selectedVehicleNumber}`
          );
          setVehicleDetails([]); // Clear the vehicle details on error
          console.error("Error fetching vehicle details:", error);
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
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setVehicleDetails(response.data);
          setError(null); // Reset error if data is found
        } catch (error) {
          setError(
            `No service history found for vehicle ${selectedVehicleNumber}`
          );
          setVehicleDetails([]); // Clear the vehicle details on error
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
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
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

  const updateEstimation = async (estimationId, updatedData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/estService/update/${estimationId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Update successful:", response.data);
      // Optionally, refresh the data or update the local state here
    } catch (error) {
      console.error("Error updating estimation:", error);
    }
  };

  const handleApproval = (estimation, isApproved) => {
    const status = isApproved ? "Approved" : "Rejected";
    updateEstimation(estimation._id, { status });
  };

  // const handleApproval1 = (estimation, isApproved) => {
  //   const additionalDismantalStatus = isApproved ? "Approved" : "Rejected";
  //   updateEstimation(estimation._id, { additionalDismantalStatus });
  // };
  const handleApproval1 = (estimation, isApproved) => {
    // Determine additionalDismantalStatus based on isApproved
    const additionalDismantalStatus = isApproved ? "Approved" : "Rejected";

    // Prepare the update data
    const updateData = { additionalDismantalStatus };

    // If additionalDismantalStatus is "Rejected", set dismantaleCompleted to "In Progress"
    if (!isApproved) {
      updateData.dismantaleCompleted = "In Progress";
    }

    // Call the update function
    updateEstimation(estimation._id, updateData);
  };

  const handleUpdate = (estimation, comment) => {
    updateEstimation(estimation._id, { comment });
  };
  // const handleApproval2 = (estimation, isApproved) => {
  //   const preInvoiceStatus = isApproved ? "Approved" : "Rejected";
  //   updateEstimation(estimation._id, { preInvoiceStatus });

  // };
  const handleApproval2 = (estimation, isApproved) => {
    const preInvoiceStatus = isApproved ? "Approved" : "Rejected";
    const updatedData = { preInvoiceStatus };

    // If preInvoiceStatus is "Rejected", set preInvoice to "N/A"
    if (preInvoiceStatus === "Rejected") {
      updatedData.preInvoice = "N/A";
      updatedData.preInvoiceStatus = "N/A";
    }
    if (preInvoiceStatus === "Approved") {
      updatedData.finalInvoiceApproval = "Approved";
    }

    // Update the estimation with the modified data
    updateEstimation(estimation._id, updatedData);
  };

  const handleUpdate2 = (estimation, preInvoiceComment) => {
    updateEstimation(estimation._id, { preInvoiceComment });
  };

  const handleAtanaPvtLtdPreInvoice = (estimation) => {
    sendEstID(estimation._id);
    console.log("id 157", estimation._id);
    // console.log("id 158",)
  };

  const navigate = useNavigate();
  const sendEstID = async (estimationId) => {
    console.log("162 Estimation ID:", estimationId);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/invoice/${estimationId}`
      );
      console.log("Fetched Data:", response.data); // Debugging
      navigate("/invoice", { state: { invoiceData: response.data } }); // Pass state
      console.log("Navigating with data:", response.data);
    } catch (err) {
      console.error("Error fetching service data:", err);
      setError("Failed to fetch service data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-MASTER min-h-screen p-4">
      <h2 className="text-3xl font-bold mb-6">Vehicle Service Details</h2>

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
                  <td className="bg-white">
                    {vehicle.brand} {vehicle.model} ({vehicle.vehicleNumber})
                  </td>
                  <td className="bg-white">
                    {vehicle.createdAt
                      .slice(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")}
                  </td>
                  <td className="bg-white">
                    {vehicle.createdAt.slice(11, 19)}
                  </td>
                  <td className="bg-white">{vehicle.odometer}</td>
                  <td className="bg-white">{vehicle.totalAmount}</td>
                  <td className="bg-white">
                    <button
                      onClick={() => handleToggleItems(index)}
                      className="toggle-button"
                    >
                      {showItemsIndex === index ? "Hide Items" : "View Items"}
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
                              <td className="bg-white">{item.itemNumber}</td>
                              <td className="bg-white">{item.partName}</td>
                              <td className="bg-white">{item.quantity}</td>
                              <td className="bg-white">{item.mrp}</td>
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

      {estimationDetails.length > 0 && (
        <div className="estimation-details">
          <h3 className="text-xl font-bold mb-4">Workshop Current Details</h3>

          <div className="table-wrapper overflow-x-auto">
            <table className="vehicle-details-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Workshop Name</th>
                  <th>Workshop Contact No.</th>
                  <th>Workshop Email</th>
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
                  <th>Status</th>
                  <th>Preliminary Approval / Reject</th>
                  <th>Comment/review</th>
                  <th>Comment</th>

                  <th>Additional Dismantle Approval / Reject</th>
                  <th>Additional Dismantle Comment/review</th>

                  <th>Pre Invoice Status</th>
                  <th>View Pre Invoice</th>
                  <th>Pre Invoice Comment</th>
                  <th>Enter Pre Invoice Comment</th>
                  <th>Pre Invoice Approval / Reject</th>
                  <th>Pre Invoice Action</th>
                </tr>
              </thead>
              <tbody>
                {estimationDetails
                  .filter(
                    (estimation) => estimation.vehicleInOut === "IN"
                    // &&

                    // if (estimation.status === "N/A") then dont display
                  )
                  .map((estimation, index) => (
                    <tr key={index}>
                      <td className="bg-white">{estimation.workshopName}</td>
                      <td className="bg-white">{estimation.workshopMobile}</td>
                      <td className="bg-white">{estimation.workshopEmail}</td>
                      <td className="bg-white">{estimation.workshopAddress}</td>
                      <td className="bg-white">{estimation.vehicleNumber}</td>
                      <td className="bg-white">{estimation.model}</td>
                      <td className="bg-white">{estimation.odometer}</td>
                      <td className="bg-white">{estimation.username}</td>
                      <td className="bg-white">{estimation.mobile}</td>
                      <td className="bg-white">{estimation.email}</td>
                      <td className="bg-white">{estimation.address}</td>
                      <td className="bg-white">
                        <table className="table-auto border-collapse border border-gray-300 dark:border-gray-600 w-full text-sm">
                          <thead>
                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                              S.No
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                              Item No.
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                              Part Name
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                              Rate
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                              Qty
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                              Tax
                            </th>
                            <th className="border  dark:border-gray-600 px-2 py-1">
                              MRP
                            </th>
                          </thead>
                          <tbody>
                            {estimation.items.map((item, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                              >
                                <td className="border border-gray-300 dark:border-gray-600 text-black px-2 py-1">
                                  {index + 1}
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 text-black px-2 py-1">
                                  {item.itemNumber}
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 text-black px-2 py-1">
                                  {item.partName}
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 text-black px-2 py-1">
                                  ₹{item.rate}
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 text-black px-2 py-1">
                                  {item.quantity}
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 text-black px-2 py-1">
                                  {item.tax}%
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 text-black px-2 py-1">
                                  ₹{item.mrp}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                      <td className="bg-white">{estimation.totalAmount}</td>
                      <td className="bg-white">{estimation.status}</td>

                      <td className="bg-white">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 ml-2"
                          onClick={() => handleApproval(estimation, true)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                          onClick={() => handleApproval(estimation, false)}
                        >
                          Reject
                        </button>
                      </td>
                      <td className="bg-white">{estimation.comment}</td>

                      <td className="bg-white">
                        <input
                          type="text"
                          placeholder="Enter comment"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onBlur={(e) =>
                            handleUpdate(estimation, e.target.value)
                          }
                        />
                      </td>

                      <td className="bg-white">
                        {estimation.additionalDismantalStatus}
                      </td>
                      <td className="bg-white">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 ml-2"
                          onClick={() => handleApproval1(estimation, true)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                          onClick={() => handleApproval1(estimation, false)}
                        >
                          Reject
                        </button>
                      </td>

                      <td>
                        <center
                          className={`${
                            estimation.preInvoice === "N/A"
                              ? "text-red-600"
                              : estimation.preInvoice === "Invoice Generated"
                              ? "text-green-600"
                              : "text-gray-500"
                          } font-semibold`}
                        >
                          {estimation.preInvoice}
                        </center>
                      </td>

                      <td className="bg-white">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 ml-2"
                          onClick={() =>
                            handleAtanaPvtLtdPreInvoice(estimation)
                          }
                        >
                          View Pre-Invoice
                        </button>
                      </td>
                      <td className="bg-white">
                        {estimation.preInvoiceComment}
                      </td>

                      <td className="bg-white">
                        <input
                          type="text"
                          placeholder="Enter comment"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onBlur={(e) =>
                            handleUpdate2(estimation, e.target.value)
                          }
                        />
                      </td>
                      {/* <td className="bg-white">
                      {estimation.preInvoiceStatus}
                    </td> */}
                      <td className="bg-white">
                        <center>
                          <span
                            style={{
                              color:
                                estimation.preInvoiceStatus === "Approved"
                                  ? "green"
                                  : estimation.preInvoiceStatus ===
                                      "Rejected" ||
                                    estimation.preInvoiceStatus === "N/A"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            <strong>{estimation.preInvoiceStatus}</strong>
                          </span>
                        </center>
                      </td>

                      <td className="bg-white">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 ml-2"
                          onClick={() => handleApproval2(estimation, true)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                          onClick={() => handleApproval2(estimation, false)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
