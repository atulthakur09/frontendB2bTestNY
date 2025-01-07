import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import bgImage from "../images/download (13).jpg";

//fonts images
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarDays } from '@fortawesome/free-regular-svg-icons'; 
import sprayCanIcon from '../images/spray-can-solid.svg'; 
import insurance from "../images/car-burst-solid.svg"
import filePen from "../images/file-pen-solid.svg"
import carBattery from "../images/car-battery-solid.svg"
import toolBox from "../images/toolbox-solid.svg"
import calander from "../images/calendar.svg"
import ac from "../images/snowflake-regular.svg"
import wheelCare from "../images/wheel-care.svg"
import cleaning from "../images/Cleaning.svg"
import windshieldLights from "../images/wwwl.svg"
import gear from "../images/gears-solid (1).svg"
import detailingService from "../images/ds.svg"


export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate();

  const serviceTypes = [
    { 
      name: "Periodic Services",
        icon:<img src={calander} alt="Calander" style={{ width: '45px', height: '45px' }} />,
        path: "services/Periodic" 
    },

    { name: "AC Service & Repair", 
      icon:<img src={ac} alt="Ac" style={{ width: '45px', height: '45px' }} />,
        path: "/services/ACServicesAndRepair" },

    { name: "Batteries",
        icon: <img src={carBattery} alt="Batteries" style={{ width: '45px', height: '45px' }} />,
        path: "/services/Batteries" },

    { name: "Tyres & Wheel Care", 
        icon: <img src={wheelCare} alt="WheelCare" style={{ width: '45px', height: '45px' }} />, 
        path: "/services/TyresAndWheelCare" },

    { 
      name: "Denting & Painting",
        icon: <img src={sprayCanIcon} alt="Denting & Painting" style={{ width: '45px', height: '45px' }} />,
        path: "/services/DentingAndPainting" 
    },

    { name: "Detailing Services", 
      icon: <img src={detailingService} alt="DetailingService" style={{ width: '45px', height: '45px' }} />, 
        path: "/services/DetailingServices" },

    { name: "Car Spa & Cleaning", 
      icon: <img src={cleaning} alt="Cleaning" style={{ width: '45px', height: '45px' }} />, 
        path: "/services/CarSpaAndCleaning" },

    { name: "Car Inspections", 
        icon: <img src={filePen} alt="Car Inspections" style={{ width: '45px', height: '45px' }} />,               
        path: "/services/CarInspection" },

    { name: "Windshields & Lights",  
      icon: <img src={windshieldLights} alt="WindshieldLights" style={{ width: '45px', height: '45px' }} />,
      path: "/services/WindshieldsAndLights" },

    { name: "Suspension & Fitments", 
        icon:  <img src={toolBox} alt="Suspension & Fitments" style={{ width: '45px', height: '45px' }} />, 
        path: "/services/SuspensionAndFitments" },

    { name: "Clutch & Body Parts", 
      icon:<img src={gear} alt="Gear" style={{ width: '45px', height: '45px' }} />, 
      path: "/services/ClutchAndBodyParts" },

    { name: "Insurance Claims",
        icon: <img src={insurance} alt="Insurance Claims" style={{ width: '45px', height: '45px' }} />,
        path: "/services/InsuranceClaims" },
  ];

  const handleServiceClick = (path) => {
    navigate(path);
  };
  return (
    <div className="bg-bg-MASTER px-6 py-8 mx-auto">
  <div className="flex flex-col items-center min-h-screen bg-white p-6">
    <h2 className="text-3xl font-bold mb-8">Home</h2>
    <div className="mb-8">
      {!user ? (
        <p className="text-lg">Welcome Guest</p>
      ) : (
        <p className="text-lg">Welcome {user.username}</p>
      )}
    </div>

    <div className="w-full">
      {/* Customer-specific content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {serviceTypes.map((service, index) => (
          <button
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 transform transition-transform hover:scale-105"
            onClick={() => handleServiceClick(service.path)}
          >
            <div className="flex items-center justify-center mb-6 text-primary-600 text-4xl">
              {service.icon}
            </div>
            <div className="text-center text-xl font-semibold text-gray-900">
              {service.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
</div>



  )
}