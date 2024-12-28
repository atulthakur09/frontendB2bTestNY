import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validator from "validator";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export default function Service() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [_id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [model, setModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [address, setAddress] = useState("");
  const [odometer, setOdometer] = useState("");
  const [lastOdometer, setLastOdometer] = useState(0);
  const [items, setItems] = useState([
    { itemNumber: "", partName: "", quantity: "", mrp: "" },
  ]);
  const [clientErrors, setClientErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);

  const runValidations = () => {
    const errors = {};
    const mobileStr = String(mobile).trim();
    if (!username.trim()) errors.username = "Username is required";
    if (!mobileStr) errors.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(mobileStr))
      errors.mobile = "Invalid mobile number. It should be a 10-digit number.";
    if (!model.trim()) errors.model = "Vehicle model is required";
    if (!vehicleNumber.trim())
      errors.vehicleNumber = "Vehicle registration number is required";
    else if (!validator.isAlphanumeric(vehicleNumber.replace(/\s/g, "")))
      errors.vehicleNumber = "Invalid vehicle registration number format";
    if (!address.trim()) errors.address = "Address is required";

    if (!validator.isEmail(email)) errors.email = "Invalid email format";
    
    if (!odometer) errors.odometer = "Odometer reading is required";
    else if (parseInt(odometer, 10) <= lastOdometer)
      errors.odometer = `Odometer reading must be greater than the previous value of ${lastOdometer}`;

    return errors;
  };

  const handleBlur = async () => {
    if (vehicleNumber.trim()) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/admin/vehicles/${vehicleNumber}`
        );
        const { data } = response;
        setUsername(data.username || "");
        setId(data._id || "");
        setEmail(data.email || "");
        setMobile(data.mobile || "");
        setModel(`${data.brand} ${data.model}` || "");
        setAddress(data.address || "");
        setLastOdometer(data.odometer || 0);
        setOdometer("");
      } catch (err) {
        setClientErrors((prev) => ({
          ...prev,
          vehicleNumber: "Vehicle not found",
        }));
        setUsername("");
        setId("");
        setEmail("");
        setMobile("");
        setModel("");
        setAddress("");
        setLastOdometer(0);
        setOdometer("");
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () =>
    setItems([
      ...items,
      { itemNumber: "", partName: "", quantity: "", mrp: "" },
    ]);

  const handleRemoveItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  const calculateTotal = () =>
    items.reduce(
      (total, item) =>
        total + (parseFloat(item.mrp) || 0) * (parseInt(item.quantity) || 1),
      0
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = runValidations();
    if (Object.keys(errors).length === 0) {
      const formData = {
        username,
        email,
        mobile,
        model,
        vehicleNumber,
        address,
        odometer,
        items,
        totalAmount: calculateTotal(),
      };
      try {
        await axios.post(`${API_BASE_URL}/service/register`, formData);
        navigate("/service-center");
      } catch (err) {
        setServerErrors(err.response?.data.errors || ["Server error"]);
      }
    } else {
      setClientErrors(errors);
    }
  };

  return (
    <div>
      <h2>Vehicle Service</h2>
      {serverErrors && (
        <div>
          <h3>These errors prohibited the form from being saved:</h3>
          <ul>
            {serverErrors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="vehicleNumber">Vehicle Number</label>
        <input
          type="text"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          onBlur={handleBlur}
          id="vehicleNumber"
          placeholder="Enter your vehicle number"
        />
        {clientErrors.vehicleNumber && (
          <span>{clientErrors.vehicleNumber}</span>
        )}
        <br />
        <label htmlFor="model">Vehicle</label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          id="model"
          placeholder="Enter your vehicle"
        />
        {clientErrors.model && <span>{clientErrors.model}</span>}
        <br />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          placeholder="Enter your Email"
        />
        {clientErrors.email && <span>{clientErrors.email}</span>}
        <br />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          placeholder="Enter your username"
        />
        {clientErrors.username && <span>{clientErrors.username}</span>}
        <br />
        <label htmlFor="mobile">Mobile Number</label>
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          id="mobile"
          placeholder="Enter your mobile number"
        />
        {clientErrors.mobile && <span>{clientErrors.mobile}</span>}
        <br />
        <label htmlFor="address">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          id="address"
          placeholder="Enter your address"
        />
        {clientErrors.address && <span>{clientErrors.address}</span>}
        <br />
        <label htmlFor="odometer">Odometer</label>
        <input
          type="number"
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
          id="odometer"
          placeholder="Enter odometer value"
        />
        {clientErrors.odometer && <span>{clientErrors.odometer}</span>}
        <br />
        <label>Items</label>
        {items.map((item, index) => (
          <div key={index}>
            <span>#{index + 1}.</span> {/* Serial number */}
            <input
              type="text"
              placeholder="Item Number"
              value={item.itemNumber}
              onChange={(e) =>
                handleItemChange(index, "itemNumber", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Part Name"
              value={item.partName}
              onChange={(e) =>
                handleItemChange(index, "partName", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="MRP"
              value={item.mrp}
              onChange={(e) => handleItemChange(index, "mrp", e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveItem(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>
        <br />
        <label>Total Amount</label>
        <input type="text" value={calculateTotal()} readOnly />
        <br />
        <input type="submit" value="Submit Record" />
      </form>
    </div>
  );
}

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import validator from "validator";

// export default function Service() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [_id, setId] = useState("");
//   const [email, setEmail] = useState("");
//   const [model, setModel] = useState("");
//   const [vehicleNumber, setVehicleNumber] = useState("");
//   const [address, setAddress] = useState("");
//   const [odometer, setOdometer] = useState("");
//   const [lastOdometer, setLastOdometer] = useState(0);
//   const [items, setItems] = useState([
//     { itemNumber: "", partName: "", quantity: "", mrp: "" },
//   ]);
//   const [clientErrors, setClientErrors] = useState({});
//   const [serverErrors, setServerErrors] = useState(null);

//   const runValidations = () => {
//     const errors = {};
//     const mobileStr = String(mobile).trim();
//     if (!username.trim()) errors.username = "Username is required";
//     if (!mobileStr) errors.mobile = "Mobile number is required";
//     else if (!/^[0-9]{10}$/.test(mobileStr))
//       errors.mobile = "Invalid mobile number. It should be a 10-digit number.";
//     if (!model.trim()) errors.model = "Vehicle model is required";
//     if (!vehicleNumber.trim())
//       errors.vehicleNumber = "Vehicle registration number is required";
//     else if (!validator.isAlphanumeric(vehicleNumber.replace(/\s/g, "")))
//       errors.vehicleNumber = "Invalid vehicle registration number format";
//     if (!address.trim()) errors.address = "Address is required";

//     if (!validator.isEmail(email)) errors.email = "Invalid email format";
    
//     if (!odometer) errors.odometer = "Odometer reading is required";
//     else if (parseInt(odometer, 10) <= lastOdometer)
//       errors.odometer = `Odometer reading must be greater than the previous value of ${lastOdometer}`;

//     return errors;
//   };

//   const handleBlur = async () => {
//     if (vehicleNumber.trim()) {
//       try {
//         const response = await axios.get(
//           `http://localhost:3777/admin/vehicles/${vehicleNumber}`
//         );
//         const { data } = response;
//         setUsername(data.username || "");
//         setId(data._id || "");
//         setEmail(data.email || "");
//         setMobile(data.mobile || "");
//         setModel(`${data.brand} ${data.model}` || "");
//         setAddress(data.address || "");
//         setLastOdometer(data.odometer || 0);
//         setOdometer("");
//       } catch (err) {
//         setClientErrors((prev) => ({
//           ...prev,
//           vehicleNumber: "Vehicle not found",
//         }));
//         setUsername("");
//         setId("");
//         setEmail("");
//         setMobile("");
//         setModel("");
//         setAddress("");
//         setLastOdometer(0);
//         setOdometer("");
//       }
//     }
//   };

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index][field] = value;
//     setItems(newItems);
//   };

//   const handleAddItem = () =>
//     setItems([
//       ...items,
//       { itemNumber: "", partName: "", quantity: "", mrp: "" },
//     ]);

//   const handleRemoveItem = (index) =>
//     setItems(items.filter((_, i) => i !== index));

//   const calculateTotal = () =>
//     items.reduce(
//       (total, item) =>
//         total + (parseFloat(item.mrp) || 0) * (parseInt(item.quantity) || 1),
//       0
//     );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = runValidations();
//     if (Object.keys(errors).length === 0) {
//       const formData = {
//         username,
//         // _id,
//         email,
//         mobile,
//         model,
//         vehicleNumber,
//         address,
//         odometer,
//         items,
//         totalAmount: calculateTotal(),
//       };
//       try {
//         await axios.post("http://localhost:3777/service/register", formData);
//         navigate("/service-center");
//       } catch (err) {
//         setServerErrors(err.response?.data.errors || ["Server error"]);
//       }
//     } else {
//       setClientErrors(errors);
//     }
//   };

//   return (
//     <div>
//       <h2>Vehicle Service</h2>
//       {serverErrors && (
//         <div>
//           <h3>These errors prohibited the form from being saved:</h3>
//           <ul>
//             {serverErrors.map((error, i) => (
//               <li key={i}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="vehicleNumber">Vehicle Number</label>
//         <input
//           type="text"
//           value={vehicleNumber}
//           onChange={(e) => setVehicleNumber(e.target.value)}
//           onBlur={handleBlur}
//           id="vehicleNumber"
//           placeholder="Enter your vehicle number"
//         />
//         {clientErrors.vehicleNumber && (
//           <span>{clientErrors.vehicleNumber}</span>
//         )}
//         <br />
//         <label htmlFor="model">Vehicle</label>
//         <input
//           type="text"
//           value={model}
//           onChange={(e) => setModel(e.target.value)}
//           id="model"
//           placeholder="Enter your vehicle"
//         />
//         {clientErrors.model && <span>{clientErrors.model}</span>}
//         <br />
//         <label htmlFor="email">Email</label>
//         <input
//           type="text"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           id="email"
//           placeholder="Enter your Email"
//         />
//         {clientErrors.email && <span>{clientErrors.email}</span>}
//         <br />



//         {/* <label htmlFor="_id">ID</label>
//         <input
//           type="text"
//           value={_id}
//           onChange={(e) => setId(e.target.value)}
//           id="_id"
//           placeholder="Enter your id"
//         />
//         {clientErrors._id && <span>{clientErrors._id}</span>} */}



        
//         <br />
//         <label htmlFor="username">Username</label>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           id="username"
//           placeholder="Enter your username"
//         />
//         {clientErrors.username && <span>{clientErrors.username}</span>}
//         <br />
//         <label htmlFor="mobile">Mobile Number</label>
//         <input
//           type="text"
//           value={mobile}
//           onChange={(e) => setMobile(e.target.value)}
//           id="mobile"
//           placeholder="Enter your mobile number"
//         />
//         {clientErrors.mobile && <span>{clientErrors.mobile}</span>}
//         <br />
//         <label htmlFor="address">Address</label>
//         <input
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           id="address"
//           placeholder="Enter your address"
//         />
//         {clientErrors.address && <span>{clientErrors.address}</span>}
//         <br />
//         <label htmlFor="odometer">Odometer</label>
//         <input
//           type="number"
//           value={odometer}
//           onChange={(e) => setOdometer(e.target.value)}
//           id="odometer"
//           placeholder="Enter odometer value"
//         />
//         {clientErrors.odometer && <span>{clientErrors.odometer}</span>}
//         <br />
//         <label>Items</label>
//         {items.map((item, index) => (
//           <div key={index}>
//             <input
//               type="text"
//               placeholder="Item Number"
//               value={item.itemNumber}
//               onChange={(e) => handleItemChange(index, "itemNumber", e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Part Name"
//               value={item.partName}
//               onChange={(e) => handleItemChange(index, "partName", e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="MRP"
//               value={item.mrp}
//               onChange={(e) => handleItemChange(index, "mrp", e.target.value)}
//             />
//             <button type="button" onClick={() => handleRemoveItem(index)}>
//               Remove
//             </button>
//           </div>
//         ))}
//         <button type="button" onClick={handleAddItem}>
//           Add Item
//         </button>
//         <br />
//         <label>Total Amount</label>
//         <input type="text" value={calculateTotal()} readOnly />
//         <br />
//         <input type="submit" value="Submit Record" />
//       </form>
//     </div>
//   );
// }
