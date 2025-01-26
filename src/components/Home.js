import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import bgImage from "../images/download (13).jpg";
import "./Home.css"

//fonts images
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import sprayCanIcon from "../images/spray-can-solid.svg";
import insurance from "../images/car-burst-solid.svg";
import filePen from "../images/file-pen-solid.svg";
import carBattery from "../images/car-battery-solid.svg";
import toolBox from "../images/toolbox-solid.svg";
import calander from "../images/calendar.svg";
import ac from "../images/snowflake-regular.svg";
import wheelCare from "../images/wheel-care.svg";
import cleaning from "../images/Cleaning.svg";
import windshieldLights from "../images/wwwl.svg";
import gear from "../images/gears-solid (1).svg";
import detailingService from "../images/ds.svg";
//car brand
import MarutiSuzuki from "../images/CarBrandLogo/Suzuki.svg";
import BMW from "../images/CarBrandLogo/BMW.svg";
import Audi from "../images/CarBrandLogo/Audi.svg";
import Skoda from "../images/CarBrandLogo/Skoda.svg";
import Hyundai from "../images/CarBrandLogo/Hyundai.svg";
import Fiat from "../images/CarBrandLogo/Fiat.svg";
import Chevrolet from "../images/CarBrandLogo/Chevrolet.svg";
import Toyota from "../images/CarBrandLogo/Toyota.svg";
import Ford from "../images/CarBrandLogo/Ford.svg";
import Mahindra from "../images/CarBrandLogo/Mahindra.svg";
import Tata from "../images/CarBrandLogo/Tata.svg";
import Nissan from "../images/CarBrandLogo/Nissan.svg";
import Volkswagen from "../images/CarBrandLogo/Volkswagen.svg";
import Mercedes from "../images/CarBrandLogo/Mercedes.svg";
import Honda from "../images/CarBrandLogo/Honda.svg";
import Jeep from "../images/CarBrandLogo/Jeep.svg";
import Mitsubishi from "../images/CarBrandLogo/Mitsubishi.svg";
import Isuzu from "../images/CarBrandLogo/Isuzu.svg";
import Porsche from "../images/CarBrandLogo/Porsche.svg";
import Volvo from "../images/CarBrandLogo/Volvo.svg";
import LandRover from "../images/CarBrandLogo/LandRover.svg";
import Kia from "../images/CarBrandLogo/Kia.svg";
import SsangYong from "../images/CarBrandLogo/SsangYong.svg";
import Renault from "../images/CarBrandLogo/Renault.svg";
import Jaguar from "../images/CarBrandLogo/Jaguar.svg";
import ForceMotors from "../images/CarBrandLogo/ForceMotors.svg";
// import MG from "../images/CarBrandLogo/MG.svg";
// import Datsun from "../images/CarBrandLogo/Datsun.svg";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const brands = [
      { name: "Tata", logo: Tata },
          { name: "Mahindra", logo: Mahindra },
          { name: "Maruti Suzuki", logo: MarutiSuzuki },
          { name: "BMW", logo: BMW },
          { name: "Audi", logo: Audi },
          { name: "Skoda", logo: Skoda },
          { name: "Hyundai", logo: Hyundai },
          { name: "Fiat", logo: Fiat },
          { name: "Chevrolet", logo: Chevrolet },
          { name: "Toyota", logo: Toyota },
          { name: "Renault", logo: Renault },
          { name: "Ford", logo: Ford },
          { name: "Nissan", logo: Nissan },
          { name: "Volkswagen", logo: Volkswagen },
          { name: "Mercedes", logo: Mercedes },
          { name: "Honda", logo: Honda },
          { name: "Jeep", logo: Jeep },
          { name: "Mitsubishi", logo: Mitsubishi },
          { name: "Isuzu", logo: Isuzu },
          { name: "Porsche", logo: Porsche },
          { name: "Volvo", logo: Volvo },
          { name: "Jaguar", logo: Jaguar },
          { name: "Land Rover", logo: LandRover },
          { name: "Kia", logo: Kia },
          { name: "SsangYong", logo: SsangYong },
          { name: "Force Motors", logo: ForceMotors },
    ];

  const serviceTypes = [
    {
      name: "Periodic Services",
      icon: (
        <img
          src={calander}
          alt="Calander"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "services/Periodic",
    },

    {
      name: "AC Service & Repair",
      icon: <img src={ac} alt="Ac" style={{ width: "45px", height: "45px" }} />,
      path: "/services/ACServicesAndRepair",
    },

    {
      name: "Batteries",
      icon: (
        <img
          src={carBattery}
          alt="Batteries"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/Batteries",
    },

    {
      name: "Tyres & Wheel Care",
      icon: (
        <img
          src={wheelCare}
          alt="WheelCare"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/TyresAndWheelCare",
    },

    {
      name: "Denting & Painting",
      icon: (
        <img
          src={sprayCanIcon}
          alt="Denting & Painting"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/DentingAndPainting",
    },

    {
      name: "Detailing Services",
      icon: (
        <img
          src={detailingService}
          alt="DetailingService"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/DetailingServices",
    },

    {
      name: "Car Spa & Cleaning",
      icon: (
        <img
          src={cleaning}
          alt="Cleaning"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/CarSpaAndCleaning",
    },

    {
      name: "Car Inspections",
      icon: (
        <img
          src={filePen}
          alt="Car Inspections"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/CarInspection",
    },

    {
      name: "Windshields & Lights",
      icon: (
        <img
          src={windshieldLights}
          alt="WindshieldLights"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/WindshieldsAndLights",
    },

    {
      name: "Suspension & Fitments",
      icon: (
        <img
          src={toolBox}
          alt="Suspension & Fitments"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/SuspensionAndFitments",
    },

    {
      name: "Clutch & Body Parts",
      icon: (
        <img src={gear} alt="Gear" style={{ width: "45px", height: "45px" }} />
      ),
      path: "/services/ClutchAndBodyParts",
    },

    {
      name: "Insurance Claims",
      icon: (
        <img
          src={insurance}
          alt="Insurance Claims"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      path: "/services/InsuranceClaims",
    },
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

      <div className="drmechny">
      {/* Guarantee Section */}
      <div className="guarantee">
        <div className="guarantee-item">Affordable Prices</div>
        <div className="guarantee-item">Free Pickup Drop</div>
        <div className="guarantee-item">Genuine Parts</div>
        <div className="guarantee-item">30 Days Warranty</div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2><strong>How Dr. MechNY Works?</strong></h2>
        <div className="steps">
          {[
            {
              step: "1",
              title: "Select The Perfect Car Service",
              description: "From Dr.MechNY's broad portfolio of services",
              icon: "🚗🚙",
            },
            {
              step: "2",
              title: "Schedule Free Doorstep Pick-up And Drop",
              description: "We offer free pick up and drop for all services booked",
              icon: "🚘",
            },
            {
              step: "3",
              title: "Track Your Car Service Real-Time",
              description: "We will take care of everything from here!",
              icon: "⚙️",
            },
            // {
            //   step: "4",
            //   title: "Earn While We Service",
            //   description: "Spread the word! You get Rs.750. Your friends get Rs.750!",
            //   icon: "🎁",
            // },
          ].map((item, index) => (
            <div className="step" key={index}>
              <div className="step-number">{item.step}</div>
              <div className="step-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="step-icon">{item.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </div>


    <div className="coming-soon">
      {/* Title */}
      <h2> <strong>Coming Soon: Dr.MechNY Mobile App</strong></h2>

      {/* Description */}
      <p>
        Get ready to book a seamless car service experience and enjoy exclusive
        offers with our upcoming app. Stay tuned!
      </p>

      {/* Image Section */}
      <div className="app-preview">
        <img
          src="https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/Website/gm-app-download-update.jpg"
          alt="App Preview"
          className="app-image"
        />
      </div>
    </div>



    <div className="car-brands">
      <h2>
        <span className="highlight">We Serve</span> These Car Brands
      </h2>
      <div className="brands-grid">
        {brands.map((brand, index) => (
          <div className="brand-item" key={index}>
            <img src={brand.logo} alt={brand.name} className="brand-logo" />
          </div>
        ))}
      </div>
    </div>



    
    </div>
  );
}
