import { useRef, useState } from "react";
import rightArrow from "../../images/svg/arrow-left-blue.svg";
import leftArrow from "../../images/svg/arrow-right-blue.svg";

function ImageSlider({ images }) {
  const sliderRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScrollLeft = () => {
    sliderRef.current.scrollBy({ left: -150, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    sliderRef.current.scrollBy({ left: 150, behavior: "smooth" });
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="relative mt-2">
      <strong>Workshop Images:</strong>
      <div className="flex items-center space-x-2 mt-2">
        {/* Left Scroll Button */}
        {images.length > 3 && (
          <button
            onClick={handleScrollLeft}
            className="absolute left-0 bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full z-10"
            style={{ left: "10px" }}
          >
            <img
              src={rightArrow}
              alt="Left Arrow"
              style={{ width: "25px", height: "25px" }}
            />
          </button>
        )}

        {/* Image Container */}
        <div
          ref={sliderRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4 w-full h-55 bg-gray-100 rounded-lg p-2"
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Shop ${index + 1}`}
              className="w-92 h-52 object-cover rounded cursor-pointer"
              onClick={() => openModal(image)}
            />
          ))}
        </div>

        {/* Right Scroll Button */}
        {images.length > 3 && (
          <button
            onClick={handleScrollRight}
            className="absolute right-0 bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full z-10"
            style={{ right: "10px" }}
          >
            <img
              src={leftArrow}
              alt="Right Arrow"
              style={{ width: "25px", height: "25px" }}
            />
          </button>
        )}
      </div>

      {/* Modal for Large Image View */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Large View"
              className="max-w-full max-h-screen rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppointmentImages({ appointment }) {
  return <ImageSlider images={appointment.shopImages} />;
}

// import { useRef, useState } from "react";
// import rightArrow from '../../images/svg/arrow-left-blue.svg';
// import leftArrow from '../../images/svg/arrow-right-blue.svg';

// function ImageSlider({ images }) {
//     const sliderRef = useRef(null);
//     const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image
//     const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

//     const handleScrollLeft = () => {
//         sliderRef.current.scrollBy({ left: -150, behavior: "smooth" });
//     };

//     const handleScrollRight = () => {
//         sliderRef.current.scrollBy({ left: 150, behavior: "smooth" });
//     };

//     const openModal = (image) => {
//         setSelectedImage(image); // Set the clicked image
//         setIsModalOpen(true); // Open the modal
//     };

//     const closeModal = () => {
//         setIsModalOpen(false); // Close the modal
//         setSelectedImage(null); // Clear the selected image
//     };

//     return (
//         <div className="relative mt-2">
//             <strong>Workshop Images:</strong>
//             <div className="flex items-center space-x-2 mt-2">
//                 {/* Left Scroll Button */}
//                 {/* <button
//           onClick={handleScrollLeft}
//           className="absolute left-0 bg-gray-300 hover:bg-gray-400 text-black px-3 py-2 rounded-full z-10"
//         >
//           <img src={rightArrow} alt="Calendar" style={{ width: '45px', height: '45px' }} />
//         </button> */}
//                 <button
//                     onClick={handleScrollLeft}
//                     className="absolute left-0 bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full z-10"
//                     style={{ left: '1px' }} // Optional: Adjust this for better alignment if needed
//                 >
//                     <img
//                         src={rightArrow}
//                         alt="Left Arrow"
//                         style={{ width: '25px', height: '25px' }} // Ensure icon size
//                     />
//                 </button>

//                 {/* Image Container */}
//                 <div
//                     ref={sliderRef}
//                     className="flex overflow-x-scroll scrollbar-hide space-x-4 w-full h-36 bg-gray-100 rounded-lg p-2"
//                 >
//                     {images.map((image, index) => (
//                         <img
//                             key={index}
//                             src={image}
//                             alt={`Shop ${index + 1}`}
//                             className="w-52 h-52 object-cover rounded cursor-pointer"
//                             onClick={() => openModal(image)} // Handle image click
//                         />
//                     ))}
//                 </div>

//                 {/* Right Scroll Button */}
//                 <button
//                     onClick={handleScrollRight}
//                     className="absolute right-0 bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full z-10"
//                     style={{ right: '10px' }} // Optional: Adjust this for better alignment if needed
//                 >
//                     <img
//                         src={leftArrow}
//                         alt="Right Arrow"
//                         style={{ width: '25px', height: '25px' }} // Ensure icon size
//                     />
//                 </button>

//                 {/* <button
//           onClick={handleScrollRight}
//           className="absolute right-0 bg-gray-300 hover:bg-gray-400 text-black px-3 py-2 rounded-full z-10"
//         >
//           ▶
//         </button> */}
//             </div>

//             <div>

//                 {/* Modal for Large Image View */}
//                 {isModalOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
//                         <div className="relative">
//                             <img
//                                 src={selectedImage}
//                                 alt="Large View"
//                                 className="max-w-full max-h-screen rounded-lg"
//                             />
//                             <button
//                                 onClick={closeModal}
//                                 className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full hover:bg-gray-200"
//                             >
//                                 ✕
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default function AppointmentImages({ appointment }) {
//     return <ImageSlider images={appointment.shopImages} />;
// }
