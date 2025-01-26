import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function MyAppointment() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    async function fetchAppointments() {
      if (user && user._id) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/AppointmentsList/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setAppointments(response.data);
        } catch (error) {
          setError("No appointments found.");
          console.error("Error fetching appointments:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchAppointments();
  }, [user]);

  const handleAddNewAppointment = () => {
    navigate("/appointment-booking"); // Redirect to the Appointment Booking page
  };

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/AppointmentsList/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAppointments(
        appointments.filter((appointment) => appointment._id !== appointmentId)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleEdit = (appointmentId) => {
    // Redirect to edit appointment page or show a modal for editing
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-bg-MASTER min-h-screen py-5">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white border-gray-300">
            <thead>
              <tr className="bg-gray-100 justify-center">
                <th className="border border-gray-300 px-4 py-2">
                  Appointment Date
                </th>
                <th className="border border-gray-300 px-4 py-2">Time Slot</th>
                <th className="border border-gray-300 px-4 py-2">
                  Service Type
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Vehicle Number
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  pickup & Drop
                </th>
                <th className="border border-gray-300 px-4 py-2">Address</th>

                {/* <th className="border border-gray-300 px-4 py-2">Status</th> */}
                {/* <th className="border border-gray-300 px-4 py-2">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-gray-50 justify-center"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    <center>
                      {appointment.date
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}{" "}
                    </center>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <center> {appointment.timeSlot}</center>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <center> {appointment.serviceType}</center>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <center>{appointment.vehicleNumber} </center>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <center> {appointment.pickupAndDrop ? "Yes" : "No"}</center>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <center> {appointment.pickupAndDropAddress}</center>
                  </td>

                  {/* <td className="border border-gray-300 px-4 py-2">{appointment.status}</td> */}
                  {/* <td className="border border-gray-300 px-4 py-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(appointment._id)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(appointment._id)}>Delete</button>
              </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No appointments found.</p>
      )}

      <br />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
        onClick={handleAddNewAppointment}
      >
        Add New Appointment
      </button>
    </div>

    // <div>
    //   <h2>My Appointments</h2>
    //   {appointments.length > 0 ? (
    //     <table border={1}>
    //       <thead>
    //         <tr>
    //           <th>Appointment Date</th>
    //           <th>Time Slot</th>
    //           <th>Service Type</th>
    //           <th>Vehicle Number</th>
    //           <th>Status</th>
    //           <th>Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {appointments.map((appointment) => (
    //           <tr key={appointment._id}>
    //             {/* <td>{appointment.date.slice(0, 10)}</td> */}
    //             <td>{appointment.date.slice(0, 10).split('-').reverse().join('-')}</td>

    //             <td>{appointment.timeSlot}</td>
    //             <td>{appointment.serviceType}</td>
    //             <td>{appointment.vehicleNumber}</td>
    //             <td>{appointment.status}</td>
    //             <td>
    //               <button onClick={() => handleEdit(appointment._id)}>Edit</button>
    //               <button onClick={() => handleDelete(appointment._id)}>Delete</button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   ) : (
    //     <p>No appointments found.</p>
    //   )}
    //   <br/>
    //   <button onClick={handleAddNewAppointment}>Add New Appointment</button>
    // </div>
  );
}
