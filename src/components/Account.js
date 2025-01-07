import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BusinessCredentials from "./extra-comp/BusinessCredentials";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Account() {
  const { user } = useAuth();
  const [businessDetails, setBusinessDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.email) {
      // Fetch business details using the user's email
      axios
        .get(`${API_BASE_URL}/b2b/fleetGSTINInfo/${user.email}`)
        .then((response) => {
          setBusinessDetails(response.data.data);
        })
        .catch((err) => {
          console.error("Error fetching business details:", err);
          setError(" Business details are not provided/found.");
        });
    }
  }, [user?.email]);

  return (
    <div className="flex flex-col  min-h-screen bg-gray p-6">
      <h2 className="text-3xl font-bold mb-6">Account Info</h2>

      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full">
          <p className="text-lg mb-2">
            <span className="font-semibold">Username:</span> {user.username}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Role:</span> {user.role}
          </p>
        </div>
      )}

      {/* Business Details Section */}
      {businessDetails ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full mt-6">
          <h3 className="text-2xl font-bold mb-4">Business Details</h3>
          <p className="text-lg mb-2">
            <span className="font-semibold">Business Name:</span>{" "}
            {businessDetails.businessName}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">GSTIN:</span> {businessDetails.gstin}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Billing Address:</span>{" "}
            {businessDetails.billingAddress}
          </p>
        </div>
      ) : error ? (
        <p className="text-red-600 mt-6">{error}</p>
      ) : (
        <p className="text-gray-600 mt-6">Loading business details...</p>
      )}

      {/* Render BusinessCredentials only if businessDetails is not found */}
      {!businessDetails && <BusinessCredentials />}
    </div>

    // <div className="flex flex-col items-center min-h-screen bg-gray p-6">
    //   <h2 className="text-3xl font-bold mb-6">Account Info</h2>

    //   {user && (
    //     <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    //       <p className="text-lg mb-2">
    //         <span className="font-semibold">Username:</span> {user.username}
    //       </p>
    //       <p className="text-lg mb-2">
    //         <span className="font-semibold">Email:</span> {user.email}
    //       </p>
    //       <p className="text-lg mb-2">
    //         <span className="font-semibold">Role:</span> {user.role}
    //       </p>
    //     </div>
    //   )}

    //   {/* Business Details Section */}
    //   {businessDetails ? (
    //     <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-6">
    //       <h3 className="text-2xl font-bold mb-4">Business Details</h3>
    //       <p className="text-lg mb-2">
    //         <span className="font-semibold">Business Name:</span>{" "}
    //         {businessDetails.businessName}
    //       </p>
    //       <p className="text-lg mb-2">
    //         <span className="font-semibold">GSTIN:</span> {businessDetails.gstin}
    //       </p>
    //       <p className="text-lg mb-2">
    //         <span className="font-semibold">Billing Address:</span>{" "}
    //         {businessDetails.billingAddress}
    //       </p>
    //     </div>
    //   ) : error ? (
    //     <p className="text-red-600 mt-6">{error}</p>
    //   ) : (
    //     <p className="text-gray-600 mt-6">Loading business details...</p>
    //   )}
    //    <BusinessCredentials/>
    // </div>

  );
}
