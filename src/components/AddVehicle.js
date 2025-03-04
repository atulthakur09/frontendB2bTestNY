import React, { useState, useEffect } from "react";
import axios from "axios";
import validator from "validator";
import { useAuth } from "../context/AuthContext";
// import "./AddVehicle.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function AddVehicle() {
  const { userId, user } = useAuth();
  const [username, setUsername] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [fuel, setFuel] = useState("");
  const [odometer, setOdometer] = useState("");
  const [color, setColor] = useState("");
  const [email, setEmail] = useState("");

  const [chassisNumber, setChassisNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [dateOfRCReg, setdateOfRCReg] = useState("");
  const [clientErrors, setClientErrors] = useState({});

  const [mobile, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // Fetch user details if user is logged in
      setUsername(user.username || "");
      setEmail(user.email || "");
      setContact(user.mobile || "");
    } else {
      // Redirect to login page if user is not logged in
      alert("Please login to add Vehicle");
      window.location.href = "/login";
    }
  }, [user]);

  const vehicleModels = {
    Audi: [
      "A3",
      "A4",
      "A6",
      "A8",
      "A8 L",
      "e-Tron",
      "e-Tron GT",
      "Q2",
      "Q3",
      "Q3 Sportback",
      "Q5",
      "Q7",
      "Q8",
      "Q8 Sportback e-Tron",
      "Q8 e-Tron",
      "RS Q8",
      "RS5",
      "S5 Sportback",
    ],
    // "Aston Martin":["DB12","DBX","Vantage"],
    BMW: [
      "2 Series Gran Coupe",
      "3 Series",
      "3 Series Gran Limousine",
      "5 Series",
      "6 Series Gran Turismo",
      "7 Series",
      "8 Series",
      "M2",
      "M4 Competition",
      "M8 Coupe Competition",
      "i4",
      "i5",
      "i7",
      "iX",
      "iX1",
      "X1",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "XM",
      "Z4",
    ],
    // Bentley:["Bentayga","Continental","Fly Spur"],
    Byd: ["Seal", "Atto 3", "E6"],
    Citroen: ["Basalt", "C3", "C3 Aircross", "eC3", "C5 Aircross"],
    // Ferrari:["812","296 GTB","F8 Tributo","Roma","SF90 Stradale"],
    Ford: [
      "Aspire",
      "EcoSport",
      "Endeavour",
      "Fiesta",
      "Figo",
      "Freestyle",
      "Ikon",
      "Mustang",
    ],
    Force: ["Gurkha", "Gurkha 5 Door", "Urbania"],
    Honda: ["Amaze", "City", "City Hybrid", "Elevate", "WR-V", "Jazz"],
    Hyundai: [
      "Alcazar",
      "Aura",
      "Creta",
      "Elantra",
      "Exter",
      "Grand i10 Nios",
      "i20",
      "IONIQ 5",
      "Kona EV",
      "Tucson",
      "Venue",
      "Verna",
    ],
    ISUZU: ["D-MAX", "Hi-Lander", "MU-X", "S-CAB-Z", "S-CAB", "V-Cross"],
    Jaguar: ["F-Pace", "F-Type", "I-Pace", "XE", "XF"],
    Jeep: ["Compass", "Grand Cherokee ", "Meridian", "Wrangler"],
    Kia: ["Carnival", "Carens", "Seltos", "Sonet", "EV6"],
    "Land Rover": [
      "Defender",
      "Discovery",
      "Discovery Sport",
      "Range Rover",
      "Range Rover EV",
      "Range Rover Evoque",
      "Range Rover Sport",
      "Range Rover Velar",
    ],
    // Lamborghini:["Huracan EVO","Revuelto","Urus"],
    // Lexus: [
    //     "ES",
    //     "LC 500H",
    //     "LM",
    //     "LS",
    //     "LX",
    //     "RX",
    //     "NX"],
    Mahindra: [
      "Alturas G4",
      "Bolero",
      "Bolero Camper",
      "Bolero Pickup",
      "Bolero Neo",
      "Bolero Neo Plus",
      "Marazzo",
      "Scorpio Classic",
      "Scorpio N",
      "Thar",
      "Thar ROXX",
      "XUV 3XO",
      "XUV300",
      "XUV400 EV",
      "XUV500",
      "XUV700",
    ],
    "Maruti Suzuki": [
      "A-Star",
      "Alto K10",
      "Alto",
      "Baleno",
      "Brezza",
      "Celerio",
      "Ciaz",
      "Dzire",
      "Eeco",
      "Ertiga",
      "Fronx",
      "Grand Vitara",
      "Ignis",
      "Invicto",
      "Jimny",
      "S-Presso",
      "Super Carry",
      "Swift",
      "Wagon R",
      "XL6",
    ],
    // Maserati :["Ghibli","Grecale","Gran Cabrio","Gran Turismo","Levante","Quattoporte"],
    "Mercedes-Benz": [
      "A-Class",
      "A-Class Limousine",
      "AMG A 45 S",
      "AMG E 53 Cabriolet",
      "AMG EQS ",
      "AMG GT",
      "AMG C43",
      "AMG GLA 35",
      "AMG GLE 53",
      "AMG GT 4 Door Coupe",
      "AMG S 63",
      "AMG SL",
      "B-Class",
      "C-Class",
      "CLE Cabriolet",
      "E-Class",
      "EQA",
      "EQB",
      "EQE",
      "EQS",
      "G-Class",
      "GLA",
      "GLB",
      "GLC",
      "GLC 43",
      "GLE",
      "GLS",
      "Maybach EQS",
      "Maybach S-Class",
      "S-Class",
    ],
    // Mclaren :["750S","GT"],
    MG: ["Astor", "Comet EV", "Gloster", "Hector", "Hector Plus", "ZS EV"],
    Mini: [
      "Cooper ",
      "Cooper Countryman",
      "Cooper Countryman EV",
      "Cooper S",
      "Cooper SE",
    ],
    Mitsubishi: [
      "Cedia",
      "Challenger",
      "FTO",
      "Lancer",
      "Lancer Evolution X",
      "Montero",
      "Outlander",
      "Pajero",
    ],
    Nissan: ["Kicks", "Magnite", "X-Trail"],
    // "Rolls-Royce" :["Cullinan","Ghost","Phantom","Spectre"],
    Renault: ["Duster", "Kiger", "Kwid", "Triber"],
    // Porsche:[
    //     "718",
    //     "911",
    //     "Cayenne",
    //     "Cayenne Coupe",
    //     "Macan",
    //     "Macan EV",
    //     "Panamera",
    //     "Taycan"
    // ],
    Skoda: ["Kodiaq", "Kushaq", "Octavia", "Rapid", "Superb", "Slavia"],
    "Tata Motors": [
      "Altroz",
      "Curvv",
      "Curvv EV",
      "Harrier",
      "Nano",
      "Nexon",
      "Nexon EV",
      "Punch",
      "Punch EV",
      "Safari",
      "Tiago",
      "Tiago EV",
      "Tigor",
      "Tigor EV",
    ],
    Toyota: [
      "Camry",
      "Fortuner",
      "Fortuner Legender",
      "Glanza",
      "Hilux",
      "Innova Crysta",
      "Innova Hycross",
      "Land Cruiser 300",
      "Rumion",
      "Taisor",
      "Urban Cruiser Hyryder",
      "Vellfire",
    ],
    Volkswagen: ["Polo", "Vento", "Taigun", "Tiguan", "Virtus"],
    Volvo: [
      "C40 Recharge (EV)",
      "S60",
      "S90",
      "XC40",
      "XC40 Recharge (EV)",
      "XC60",
      "XC90",
    ],
    // Add more vehicle models here
  };

  const fuelTypes = [
    "Compressed Natural Gas (CNG)",
    "Diesel",
    "EV (ELECTRIC VEHICLE)",
    // "Liquid Petroleum Gas (LPG)",
    "Petrol",
  ];

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (e) => {
    const date = e.target.value;
    if (new Date(date) > new Date()) {
      setClientErrors({ date: "Future dates are not allowed." });
    } else {
      setClientErrors({ date: "" });
      setdateOfRCReg(date);
    }
  };

  const runValidations = () => {
    const errors = {};

    if (vehicleNumber.trim().length === 0) {
      errors.vehicleNumber = "Vehicle registration number is required";
    } else if (!validator.isAlphanumeric(vehicleNumber.replace(/\s/g, ""))) {
      errors.vehicleNumber = "Invalid Vehicle registration number format";
    }

    if (color.trim().length === 0) {
      errors.color = "Vehicle color is required";
    }

    if (odometer.trim().length === 0) {
      errors.odometer = "Odometer reading is required";
    } else if (!validator.isNumeric(odometer)) {
      errors.odometer = "Invalid odometer reading format";
    }

    if (mobile.trim().length === 0) {
      errors.mobile = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      errors.mobile = "Invalid mobile number. It should be a 10-digit number.";
    }

    if (email.trim().length === 0) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
      errors.email = "Invalid email format";
    }

    if (address.trim().length === 0) {
      errors.address = "Address is required";
    }

    return errors;
  };

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setBrand(selectedBrand);
    setModels(vehicleModels[selectedBrand] || []);
    setModel("");
  };

  const resetForm = () => {
    setUsername(user.username || "");
    setVehicleNumber("");
    setBrand("");
    setModel("");
    setModels([]);
    setFuel("");
    setOdometer("");
    setColor("");
    setEmail(user.email || "");
    setContact(user.mobile || "");

    setChassisNumber("");
    setEngineNumber("");
    setdateOfRCReg("");

    setAddress("");
    setErrors({});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = runValidations();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/addVehicle`, {
        userId: user._id,
        username,
        vehicleNumber,
        vehicleColor: color,
        brand,
        model,
        fuel,
        odometer,
        email,
        chassisNumber,
        engineNumber,
        dateOfRCReg,
        mobile,
        address,
      });

      console.log("Vehicle registered:", response.data);

      // Reset after submission
      resetForm();

      // Show success alert
      alert("Successfully Vehicle Registered");
    } catch (error) {
      console.error("There was an error registering the vehicle!", error);
      setErrors({
        ...errors,
        form: "Failed to register the vehicle. Please try again later.",
      });
    }
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const validationErrors = runValidations();
  //     if (Object.keys(validationErrors).length > 0) {
  //       setErrors(validationErrors);
  //       return;
  //     }

  //     try {
  //       const response = await axios.post("http://localhost:3777/users/addVehicle", {
  //         userId: user._id,
  //         username,
  //         vehicleNumber,
  //         vehicleColor: color,
  //         brand,
  //         model,
  //         fuel,
  //         odometer,
  //         email,
  //         mobile,
  //         address,
  //       });

  //       console.log("Vehicle registered:", response.data);

  //       // Reset after submission
  //       resetForm();
  //     } catch (error) {
  //       console.error("There was an error registering the vehicle!", error);
  //       setErrors({ ...errors, form: "Failed to register the vehicle. Please try again later." });
  //     }
  //   };

  const handleCheckVehicleNumber = async () => {
    if (vehicleNumber.trim().length > 0) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/users/checkVehicleNumber?vehicleNumber=${vehicleNumber}`
        );
        if (response.data.is_vehicleNumber_registered) {
          setErrors((prev) => ({
            ...prev,
            vehicleNumber: "Vehicle Number is already registered",
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCheckMobile = async () => {
    if (mobile.trim().length > 0) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/users/checkmobile?mobile=${mobile}`
        );
        if (response.data.is_mobile_registered) {
          setErrors((prev) => ({
            ...prev,
            mobile: "Mobile Number is already registered",
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-bg-MASTER min-h-screen py-5">
      <h1 className="text-3xl font-semibold text-center text-white-900  mb-6">
        Vehicle Registration Form
      </h1>
      <div className="App max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-white-800">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label
              htmlFor="username"
              className="block text-white-700 dark:text-white-300"
            >
              Name:{" "}
            </label>
            <input
              type="text"
              placeholder="Enter name"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
          </div>

          <div>
            <label
              htmlFor="vehicleNumber"
              className="block text-white-700 dark:text-white-300"
            >
              Vehicle Number:
            </label>
            <input
              type="text"
              placeholder="Enter Vehicle Number"
              id="vehicleNumber"
              value={vehicleNumber.toUpperCase()}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              onBlur={handleCheckVehicleNumber}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
            {errors.vehicleNumber && (
              <span className="text-red-600 text-sm">
                {errors.vehicleNumber}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="color"
              className="block text-white-700 dark:text-white-300"
            >
              Color:
            </label>
            <input
              type="text"
              placeholder="Enter Vehicle Color"
              id="color"
              value={color.toUpperCase()}
              onChange={(e) => setColor(e.target.value.toUpperCase())}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
            {errors.color && (
              <span className="text-red-600 text-sm">{errors.color}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="brand"
              className="block text-white-700 dark:text-white-300"
            >
              Brand:
            </label>
            <select
              id="brand"
              value={brand}
              onChange={handleBrandChange}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            >
              <option value="">Select Brand</option>
              {Object.keys(vehicleModels).map((brandName) => (
                <option key={brandName} value={brandName}>
                  {brandName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-white-700 dark:text-white-300"
            >
              Model:
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            >
              <option value="">Select Model</option>
              {models.map((modelName) => (
                <option key={modelName} value={modelName}>
                  {modelName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="fuel"
              className="block text-white-700 dark:text-white-300"
            >
              Fuel Type:
            </label>
            <select
              id="fuel"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map((fuelType) => (
                <option key={fuelType} value={fuelType}>
                  {fuelType}
                </option>
              ))}
            </select>
          </div>

          {/* adding new */}
          <div>
            <label
              htmlFor="engineNumber"
              className="block text-white-700 dark:text-white-300"
            >
              Engine Number:
            </label>
            <input
              type="text"
              placeholder="Enter Engine Number"
              id="engineNumber"
              value={engineNumber.toUpperCase()}
              onChange={(e) => setEngineNumber(e.target.value.toUpperCase())}
              // onBlur={handleCheckVehicleNumber}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
            {errors.engineNumber && (
              <span className="text-red-600 text-sm">
                {errors.engineNumber}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="chassisNumber"
              className="block text-white-700 dark:text-white-300"
            >
              Vehicle Number(VIN):
            </label>
            <input
              type="text"
              placeholder="Enter chassis Number (17 digit number)"
              id="chassisNumber"
              value={chassisNumber.toUpperCase()}
              onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
              // onBlur={handleCheckChassisNumber}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
            {errors.chassisNumber && (
              <span className="text-red-600 text-sm">
                {errors.chassisNumber}
              </span>
            )}
          </div>

          {/* date of reg on rc card   not more then todays date*/}
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-white-700 dark:text-white-300"
            >
              Date of Registration on RC Card:
            </label>

            <input
              type="date"
              value={dateOfRCReg}
              onChange={handleDateChange}
              id="date"
              max={today} // Restrict to today or earlier
              className="mt-1 block w-full border border-white-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {clientErrors.date && (
              <span className="text-red-600">{clientErrors.date}</span>
            )}
          </div>

          {/* end new */}

          <div>
            <label
              htmlFor="odometer"
              className="block text-white-700 dark:text-white-300"
            >
              Odometer Reading:
            </label>
            <input
              type="text"
              placeholder="Enter Odometer Reading"
              id="odometer"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
            {errors.odometer && (
              <span className="text-red-600 text-sm">{errors.odometer}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-white-700 dark:text-white-300"
            >
              Email:
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              id="email"
              value={email}
              readOnly
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
            {errors.email && (
              <span className="text-red-600 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block text-white-700 dark:text-white-300"
            >
              Contact Number:
            </label>
            <input
              type="text"
              placeholder="Enter Contact Number"
              id="mobile"
              value={mobile}
              onChange={(e) => setContact(e.target.value)}
              onBlur={handleCheckMobile}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
            {errors.mobile && (
              <span className="text-red-600 text-sm">{errors.mobile}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-white-700 dark:text-white-300"
            >
              Address:
            </label>
            <textarea
              placeholder="Enter Address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:text-white-300"
            />
            {errors.address && (
              <span className="text-red-600 text-sm">{errors.address}</span>
            )}
          </div>

          {errors.form && (
            <span className="text-red-600 text-sm">{errors.form}</span>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-black font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

    // <div className="App">
    //   <h1>Vehicle Registration Form</h1>
    //   <form onSubmit={handleSubmit}>
    //     <label htmlFor="username">Name: </label>
    //     <input
    //       type="text"
    //       placeholder="Enter name"
    //       id="username"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //       required
    //     />
    //     <br />

    //     <label htmlFor="vehicleNumber">Vehicle Number:</label>
    //     <input
    //       type="text"
    //       placeholder="Enter Vehicle Number"
    //       id="vehicleNumber"
    //       value={vehicleNumber.toUpperCase()}
    //       onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
    //       onBlur={handleCheckVehicleNumber}
    //     />
    //     {errors.vehicleNumber && <span className="error">{errors.vehicleNumber}</span>}
    //     <br />

    //     <label htmlFor="color">Color:</label>
    //     <input
    //       type="text"
    //       placeholder="Enter Vehicle Color"
    //       id="color"
    //       value={color.toUpperCase()}
    //       onChange={(e) => setColor(e.target.value.toUpperCase())}
    //     />
    //     {errors.color && <span className="error">{errors.color}</span>}
    //     <br />

    //     <label htmlFor="brand">Brand:</label>
    //     <select id="brand" value={brand} onChange={handleBrandChange}>
    //       <option value="">Select Brand</option>
    //       {Object.keys(vehicleModels).map((brandName) => (
    //         <option key={brandName} value={brandName}>
    //           {brandName}
    //         </option>
    //       ))}
    //     </select>
    //     <br />

    //     <label htmlFor="model">Model:</label>
    //     <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
    //       <option value="">Select Model</option>
    //       {models.map((modelName) => (
    //         <option key={modelName} value={modelName}>
    //           {modelName}
    //         </option>
    //       ))}
    //     </select>
    //     <br />

    //     <label htmlFor="fuel">Fuel Type:</label>
    //     <select id="fuel" value={fuel} onChange={(e) => setFuel(e.target.value)}>
    //       <option value="">Select Fuel Type</option>
    //       {fuelTypes.map((fuelType) => (
    //         <option key={fuelType} value={fuelType}>
    //           {fuelType}
    //         </option>
    //       ))}
    //     </select>
    //     <br />

    //     <label htmlFor="odometer">Odometer Reading:</label>
    //     <input
    //       type="text"
    //       placeholder="Enter Odometer Reading"
    //       id="odometer"
    //       value={odometer}
    //       onChange={(e) => setOdometer(e.target.value)}
    //     />
    //     {errors.odometer && <span className="error">{errors.odometer}</span>}
    //     <br />

    //     <label htmlFor="email">Email:</label>
    //     <input
    //       type="text"
    //       placeholder="Enter Email"
    //       id="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //     {errors.email && <span className="error">{errors.email}</span>}
    //     <br />

    //     <label htmlFor="mobile">Contact Number:</label>
    //     <input
    //       type="text"
    //       placeholder="Enter Contact Number"
    //       id="mobile"
    //       value={mobile}
    //       onChange={(e) => setContact(e.target.value)}
    //       onBlur={handleCheckMobile}
    //     />
    //     {errors.mobile && <span className="error">{errors.mobile}</span>}
    //     <br />

    //     <label htmlFor="address">Address:</label>
    //     <textarea
    //       placeholder="Enter Address"
    //       id="address"
    //       value={address}
    //       onChange={(e) => setAddress(e.target.value)}
    //     />
    //     {errors.address && <span className="error">{errors.address}</span>}
    //     <br />

    //     {errors.form && <span className="error">{errors.form}</span>}

    //     <button type="submit">Submit</button>
    //   </form>
    // </div>
  );
}

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import validator from "validator";
// import { useAuth } from "../context/AuthContext";
// // import "./AddVehicle.css";
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// export default function AddVehicle() {
//   const { userId, user } = useAuth();
//   const [username, setUsername] = useState("");
//   const [vehicleNumber, setVehicleNumber] = useState("");
//   const [brand, setBrand] = useState("");
//   const [model, setModel] = useState("");
//   const [models, setModels] = useState([]);
//   const [fuel, setFuel] = useState("");
//   const [odometer, setOdometer] = useState("");
//   const [color, setColor] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setContact] = useState("");
//   const [address, setAddress] = useState("");
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (user) {
//       // Fetch user details if user is logged in
//       setUsername(user.username || "");
//       setEmail(user.email || "");
//       // setContact(user.mobile || "");
//     } else {
//       // Redirect to login page if user is not logged in
//       alert("Please login to add Vehicle");
//       window.location.href = "/login";
//     }
//   }, [user]);

//   const vehicleModels = {
//     Audi: ["A3", "A4", "A6", "A8","A8 L","e-Tron","e-Tron GT", "Q2", "Q3","Q3 Sportback", "Q5", "Q7", "Q8","Q8 Sportback e-Tron","Q8 e-Tron","RS Q8","RS5","S5 Sportback"],
//     // "Aston Martin":["DB12","DBX","Vantage"],
//     BMW: [
//       "2 Series Gran Coupe",
//       "3 Series",
//       "3 Series Gran Limousine",
//       "5 Series",
//       "6 Series Gran Turismo",
//       "7 Series",
//       "8 Series",
//       "M2",
//       "M4 Competition",
//       "M8 Coupe Competition",
//       "i4",
//       "i5",
//       "i7",
//       "iX",
//       "iX1",
//       "X1",
//       "X3",
//       "X4",
//       "X5",
//       "X6",
//       "X7",
//       "XM",
//       "Z4",
//     ],
//     // Bentley:["Bentayga","Continental","Fly Spur"],
//     Byd:["Seal","Atto 3","E6"],
//     Citroen: ["Basalt","C3","C3 Aircross","eC3", "C5 Aircross"],
//     // Ferrari:["812","296 GTB","F8 Tributo","Roma","SF90 Stradale"],
//     Ford: ["Aspire","EcoSport", "Endeavour","Fiesta", "Figo", "Freestyle" ,"Ikon","Mustang"],
//     Force:["Gurkha","Gurkha 5 Door","Urbania"],
//     Honda: ["Amaze", "City","City Hybrid","Elevate" ,"WR-V", "Jazz"],
//     Hyundai: [
//       "Alcazar",
//       "Aura",
//       "Creta",
//       "Elantra",
//       "Exter",
//       "Grand i10 Nios",
//       "i20",
//       "IONIQ 5",
//       "Kona EV",
//       "Tucson",
//       "Venue",
//       "Verna",
//     ],
//     ISUZU:["D-MAX",
//         "Hi-Lander",
//         "MU-X",
//         "S-CAB-Z",
//         "S-CAB",
//         "V-Cross"
//     ],
//     Jaguar: ["F-Pace", "F-Type", "I-Pace","XE", "XF"],
//     Jeep: ["Compass", "Grand Cherokee " ,"Meridian", "Wrangler"],
//     Kia: ["Carnival", "Carens", "Seltos", "Sonet", "EV6"],
//     "Land Rover": [
//       "Defender",
//       "Discovery",
//       "Discovery Sport",
//       "Range Rover",
//       "Range Rover EV",
//       "Range Rover Evoque",
//       "Range Rover Sport",
//       "Range Rover Velar",
//     ],
//     // Lamborghini:["Huracan EVO","Revuelto","Urus"],
//     // Lexus: [
//     //     "ES",
//     //     "LC 500H",
//     //     "LM",
//     //     "LS",
//     //     "LX",
//     //     "RX",
//     //     "NX"],
//     Mahindra: [
//       "Alturas G4",
//       "Bolero",
//       "Bolero Camper",
//       "Bolero Pickup",
//       "Bolero Neo",
//       "Bolero Neo Plus",
//       "Marazzo",
//       "Scorpio Classic",
//       "Scorpio N",
//       "Thar",
//       "Thar ROXX",
//       "XUV 3XO",
//       "XUV300",
//       "XUV400 EV",
//       "XUV500",
//       "XUV700",
//     ],
//     "Maruti Suzuki": [
//       "A-Star",
//       "Alto K10",
//       "Alto",
//       "Baleno",
//       "Brezza",
//       "Celerio",
//       "Ciaz",
//       "Dzire",
//       "Eeco",
//       "Ertiga",
//       "Fronx",
//       "Grand Vitara",
//       "Ignis",
//       "Invicto",
//       "Jimny",
//       "S-Presso",
//       "Super Carry",
//       "Swift",
//       "Wagon R",
//       "XL6",
//     ],
//     // Maserati :["Ghibli","Grecale","Gran Cabrio","Gran Turismo","Levante","Quattoporte"],
//     "Mercedes-Benz": [
//       "A-Class",
//       "A-Class Limousine",
//       "AMG A 45 S",
//       "AMG E 53 Cabriolet",
//       "AMG EQS ",
//       "AMG GT",
//       "AMG C43",
//       "AMG GLA 35",
//       "AMG GLE 53",
//       "AMG GT 4 Door Coupe",
//       "AMG S 63",
//       "AMG SL",
//       "B-Class",
//       "C-Class",
//       "CLE Cabriolet",
//       "E-Class",
//       "EQA",
//       "EQB",
//       "EQE",
//       "EQS",
//       "G-Class",
//       "GLA",
//       "GLB",
//       "GLC",
//       "GLC 43",
//       "GLE",
//       "GLS",
//       "Maybach EQS",
//       "Maybach S-Class",
//       "S-Class",
//     ],
//     // Mclaren :["750S","GT"],
//     MG: ["Astor","Comet EV", "Gloster", "Hector", "Hector Plus", "ZS EV"],
//     Mini:[
//         "Cooper ",
//         "Cooper Countryman",
//         "Cooper Countryman EV",
//         "Cooper S",
//         "Cooper SE",
//     ],
//     Mitsubishi:["Cedia","Challenger","FTO","Lancer","Lancer Evolution X", "Montero","Outlander","Pajero" ],
//     Nissan: ["Kicks", "Magnite", "X-Trail"],
//     // "Rolls-Royce" :["Cullinan","Ghost","Phantom","Spectre"],
//     Renault: ["Duster", "Kiger", "Kwid", "Triber"],
//     // Porsche:[
//     //     "718",
//     //     "911",
//     //     "Cayenne",
//     //     "Cayenne Coupe",
//     //     "Macan",
//     //     "Macan EV",
//     //     "Panamera",
//     //     "Taycan"
//     // ],
//     Skoda: ["Kodiaq", "Kushaq", "Octavia", "Rapid", "Superb", "Slavia"],
//     "Tata Motors": [
//       "Altroz",
//       "Curvv",
//       "Curvv EV",
//       "Harrier",
//       "Nano",
//       "Nexon",
//       "Nexon EV",
//       "Punch",
//       "Punch EV",
//       "Safari",
//       "Tiago",
//       "Tiago EV",
//       "Tigor",
//       "Tigor EV"

//     ],
//     Toyota: [
//       "Camry",
//       "Fortuner",
//       "Fortuner Legender",
//       "Glanza",
//       "Hilux",
//       "Innova Crysta",
//       "Innova Hycross",
//       "Land Cruiser 300",
//       "Rumion",
//       "Taisor",
//       "Urban Cruiser Hyryder",
//       "Vellfire"
//     ],
//     Volkswagen: ["Polo", "Vento", "Taigun", "Tiguan", "Virtus"],
//     Volvo: ["C40 Recharge (EV)","S60", "S90", "XC40","XC40 Recharge (EV)", "XC60", "XC90"]
//     // Add more vehicle models here
//   };

//   const fuelTypes = [
//     "Compressed Natural Gas (CNG)",
//     "Diesel",
//     "EV (ELECTRIC VEHICLE)",
//     // "Liquid Petroleum Gas (LPG)",
//     "Petrol",
//   ];

//   const runValidations = () => {
//     const errors = {};

//     if (vehicleNumber.trim().length === 0) {
//       errors.vehicleNumber = "Vehicle registration number is required";
//     } else if (!validator.isAlphanumeric(vehicleNumber.replace(/\s/g, ""))) {
//       errors.vehicleNumber = "Invalid Vehicle registration number format";
//     }

//     if (color.trim().length === 0) {
//       errors.color = "Vehicle color is required";
//     }

//     if (odometer.trim().length === 0) {
//       errors.odometer = "Odometer reading is required";
//     } else if (!validator.isNumeric(odometer)) {
//       errors.odometer = "Invalid odometer reading format";
//     }

//     if (mobile.trim().length === 0) {
//       errors.mobile = "Contact number is required";
//     } else if (!/^[0-9]{10}$/.test(mobile)) {
//       errors.mobile = "Invalid mobile number. It should be a 10-digit number.";
//     }

//     if (email.trim().length === 0) {
//       errors.email = "Email is required";
//     } else if (!validator.isEmail(email)) {
//       errors.email = "Invalid email format";
//     }

//     if (address.trim().length === 0) {
//       errors.address = "Address is required";
//     }

//     return errors;
//   };

//   const handleBrandChange = (e) => {
//     const selectedBrand = e.target.value;
//     setBrand(selectedBrand);
//     setModels(vehicleModels[selectedBrand] || []);
//     setModel("");
//   };

//   const resetForm = () => {
//     setUsername(user.username || "");
//     setVehicleNumber("");
//     setBrand("");
//     setModel("");
//     setModels([]);
//     setFuel("");
//     setOdometer("");
//     setColor("");
//     setEmail(user.email || "");
//     setContact(user.mobile || "");
//     setAddress("");
//     setErrors({});
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = runValidations();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_BASE_URL}/users/addVehicle`, {
//         userId: user._id,
//         username,
//         vehicleNumber,
//         vehicleColor: color,
//         brand,
//         model,
//         fuel,
//         odometer,
//         email,
//         mobile,
//         address,
//       });
//       // alert("Vehicle registered successfully!");

//       console.log("Vehicle registered:", response.data);

//       // Reset after submission
//       resetForm();

//       // Show success alert
//       alert("Successfully Vehicle Registered");

//     } catch (error) {
//       console.error("There was an error registering the vehicle!", error);
//       setErrors({ ...errors, form: "Failed to register the vehicle. Please try again later." });
//     }
//   };

// const handleCheckVehicleNumber = async () => {
//   if (vehicleNumber.trim().length > 0) {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}users/checkVehicleNumber?vehicleNumber=${vehicleNumber}`
//       );
//       if (response.data.is_vehicleNumber_registered) {
//         setErrors((prev) => ({
//           ...prev,
//           vehicleNumber: "Vehicle Number is already registered",
//         }));
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }
// };

//   const handleCheckMobile = async () => {
//     if (mobile.trim().length > 0) {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/users/checkmobile?mobile=${mobile}`
//         );
//         if (response.data.is_mobile_registered) {
//           setErrors((prev) => ({
//             ...prev,
//             mobile: "Mobile Number is already registered",
//           }));
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   return (
//     <div className="App p-6 bg-white-50 min-h-screen">
//   <h1 className="text-3xl font-bold mb-6">Vehicle Registration Form</h1>
//   <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
//     <div className="mb-4">
//       <label htmlFor="username" className="block text-sm font-medium text-white-700 text-left">Name:</label>
//       <input
//         type="text"
//         placeholder="Enter name"
//         id="username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         required
//         readOnly
//         className="mt-1 block w-full border border-white-300 rounded-md p-2"
//       />
//     </div>

//     <div className="mb-4">
//       <label htmlFor="vehicleNumber" className="block text-sm font-medium text-white-700 text-left">Vehicle Number:</label>
//       <input
//         type="text"
//         placeholder="Enter Vehicle Number"
//         id="vehicleNumber"
//         value={vehicleNumber.toUpperCase()}
//         onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
//         onBlur={handleCheckVehicleNumber}
//         className="mt-1 block w-full border border-white-300 rounded-md p-2"
//       />
//       {errors.vehicleNumber && <span className="text-red-600 text-sm">{errors.vehicleNumber}</span>}
//     </div>

//     <div className="mb-4">
//       <label htmlFor="color" className="block text-sm font-medium text-white-700 text-left">Color:</label>
//       <input
//         type="text"
//         placeholder="Enter Vehicle Color"
//         id="color"
//         value={color.toUpperCase()}
//         onChange={(e) => setColor(e.target.value.toUpperCase())}
//         className="mt-1 block w-full border border-white-300 rounded-md p-2"
//       />
//       {errors.color && <span className="text-red-600 text-sm">{errors.color}</span>}
//     </div>

//     <div className="mb-4">
//       <label htmlFor="brand" className="block text-sm font-medium text-white-700 text-left">Brand:</label>
//       <select id="brand" value={brand} onChange={handleBrandChange} className="mt-1 block w-full border border-white-300 rounded-md p-2">
//         <option value="">Select Brand</option>
//         {Object.keys(vehicleModels).map((brandName) => (
//           <option key={brandName} value={brandName}>
//             {brandName}
//           </option>
//         ))}
//       </select>
//     </div>

//     <div className="mb-4">
//       <label htmlFor="model" className="block text-sm font-medium text-white-700 text-left">Model:</label>
//       <select id="model" value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 block w-full border border-white-300 rounded-md p-2">
//         <option value="">Select Model</option>
//         {models.map((modelName) => (
//           <option key={modelName} value={modelName}>
//             {modelName}
//           </option>
//         ))}
//       </select>
//     </div>

//     <div className="mb-4">
//       <label htmlFor="fuel" className="block text-sm font-medium text-white-700 text-left">Fuel Type:</label>
//       <select id="fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} className="mt-1 block w-full border border-white-300 rounded-md p-2">
//         <option value="">Select Fuel Type</option>
//         {fuelTypes.map((fuelType) => (
//           <option key={fuelType} value={fuelType}>
//             {fuelType}
//           </option>
//         ))}
//       </select>
//     </div>

//     <div className="mb-4">
//       <label htmlFor="odometer" className="block text-sm font-medium text-white-700 text-left">Odometer Reading:</label>
//       <input
//         type="text"
//         placeholder="Enter Odometer Reading"
//         id="odometer"
//         value={odometer}
//         onChange={(e) => setOdometer(e.target.value)}
//         className="mt-1 block w-full border border-white-300 rounded-md p-2"
//       />
//       {errors.odometer && <span className="text-red-600 text-sm">{errors.odometer}</span>}
//     </div>

//     <div className="mb-4">
//       <label htmlFor="email" className="block text-sm font-medium text-white-700 text-left">Email:</label>
//       <input
//         type="text"
//         placeholder="Enter Email"
//         id="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         readOnly
//         className="mt-1 block w-full border border-white-300 rounded-md p-2"
//       />
//       {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
//     </div>

//     <label htmlFor="mobile" className="block text-sm font-medium text-white-700 text-left">Contact Number:</label>
//     <input
//   type="Number" // Change this from "text" to "tel"
//   placeholder="Enter Contact Number"
//   id="mobile"
//   value={mobile}
//   onChange={(e) => setContact(e.target.value)}
//   onBlur={handleCheckMobile}
//   className="mt-1 block w-full border border-white-300 rounded-md p-2"
// />

//     <div className="mb-4">
//       <label htmlFor="address" className="block text-sm font-medium text-white-700 text-left">Address:</label>
//       <textarea
//         placeholder="Enter Address"
//         id="address"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         className="mt-1 block w-full border border-white-300 rounded-md p-2"
//       />
//       {errors.address && <span className="text-red-600 text-sm">{errors.address}</span>}
//     </div>

//     {errors.form && <span className="text-red-600 text-sm">{errors.form}</span>}

//     <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">Submit</button>
//   </form>
// </div>

//   );
// }
