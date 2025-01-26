import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import zxcvbn from "zxcvbn";

// Environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Reusable TextInput Component
const TextInput = ({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  error,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      id={id}
      placeholder={placeholder}
      className="border border-gray-300 rounded-md p-2 w-full"
    />
    {error && (
      <span className="text-red-600 text-sm" role="alert" aria-live="polite">
        {error}
      </span>
    )}
  </div>
);

export default function Register() {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role] = useState("b2b");
  const [serverErrors, setServerErrors] = useState(null);
  const [clientErrors, setClientErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Validation Logic
  const runValidations = (formData) => {
    const errors = {};

    if (formData.username.trim().length === 0) {
      errors.username = "Username is required";
    }

    if (formData.email.trim().length === 0) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (formData.password.trim().length === 0) {
      errors.password = "Password is required";
    } else if (
      formData.password.trim().length < 8 ||
      formData.password.trim().length > 128
    ) {
      errors.password = "Password should be between 8 - 128 characters";
    }

    if (formData.confirmPassword.trim().length === 0) {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { username, email, password, confirmPassword, role };

    const validationErrors = runValidations(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post(`${API_BASE_URL}/users/register`, formData);
        navigate("/login");
      } catch (err) {
        setServerErrors(
          err.response?.data?.errors || ["Unexpected error occurred."]
        );
      }
    } else {
      setClientErrors(validationErrors);
    }
  };

  // Password Strength Meter
  const handlePasswordChange = (value) => {
    setPassword(value);
    const strength = zxcvbn(value).score;
    setPasswordStrength(strength);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray p-6">
      <h2 className="text-3xl font-bold mb-6">Register With Us</h2>

      {/* Server-side Errors */}
      {serverErrors && (
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
          <h3 className="font-semibold">
            These errors prohibited the form from being saved:
          </h3>
          <ul className="list-disc pl-5">
            {serverErrors.map((error, index) => (
              <li key={index} className="text-sm">
                {error.msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        {/* Username */}
        <TextInput
          label="Enter Username"
          id="username"
          placeholder="e.g., JohnDoe123"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={clientErrors.username}
        />

        {/* Email */}
        <TextInput
          label="Enter Email"
          id="email"
          placeholder="e.g., johndoe@example.com"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={clientErrors.email}
        />

        {/* Password */}
        <TextInput
          label="Enter Password"
          id="password"
          placeholder="Minimum 8 characters "
          type="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          error={clientErrors.password}
        />
        {passwordStrength !== null && (
          <div className="text-sm">
            Password Strength:{" "}
            <span
              className={`font-bold ${
                passwordStrength < 2 ? "text-red-600" : "text-green-600"
              }`}
            >
              {
                ["Weak", "Fair", "Good", "Strong", "Very Strong"][
                  passwordStrength
                ]
              }
            </span>
          </div>
        )}

        {/* Confirm Password */}
        <TextInput
          label="Confirm Password"
          id="confirmPassword"
          placeholder="Re-enter your password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={clientErrors.confirmPassword}
        />

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-light text-gray-900">
              I accept the{" "}
              <Link
                to="/terms"
                className="font-medium text-primary-600 hover:underline"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Create an account
        </button>

        {/* Redirect to Login */}
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import validator from 'validator';
// import zxcvbn from 'zxcvbn';

// // Environment variable for API URL
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ;

// // Reusable TextInput Component
// const TextInput = ({ label, id, type, value, onChange, error }) => (
//     <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <input
//             type={type}
//             value={value}
//             onChange={onChange}
//             id={id}
//             className="border border-gray-300 rounded-md p-2 w-full"
//         />
//         {error && <span className="text-red-600 text-sm" role="alert" aria-live="polite">{error}</span>}
//     </div>
// );

// export default function Register() {
//     const navigate = useNavigate();

//     // Form state
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [email, setEmail] = useState('');
//     const [role] = useState('b2b');
//     const [serverErrors, setServerErrors] = useState(null);
//     const [clientErrors, setClientErrors] = useState({});
//     const [passwordStrength, setPasswordStrength] = useState(null);
//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//     // Validation Logic
//     const runValidations = (formData) => {
//         const errors = {};

//         if (formData.username.trim().length === 0) {
//             errors.username = 'Username is required';
//         }

//         if (formData.email.trim().length === 0) {
//             errors.email = 'Email is required';
//         } else if (!validator.isEmail(formData.email)) {
//             errors.email = 'Invalid email format';
//         }

//         if (formData.password.trim().length === 0) {
//             errors.password = 'Password is required';
//         } else if (formData.password.trim().length < 8 || formData.password.trim().length > 128) {
//             errors.password = 'Password should be between 8 - 128 characters and use ';
//         }

//         if (formData.confirmPassword.trim().length === 0) {
//             errors.confirmPassword = 'Confirm password is required';
//         } else if (formData.password !== formData.confirmPassword) {
//             errors.confirmPassword = 'Passwords do not match';
//         }

//         return errors;
//     };

//     // Form Submission Handler
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = { username, email, password, confirmPassword, role };

//         const validationErrors = runValidations(formData);
//         if (Object.keys(validationErrors).length === 0) {
//             try {
//                 await axios.post(`${API_BASE_URL}/users/register`, formData);
//                 navigate('/login');
//             } catch (err) {
//                 setServerErrors(err.response?.data?.errors || ['Unexpected error occurred.']);
//             }
//         } else {
//             setClientErrors(validationErrors);
//         }
//     };

//     // Password Strength Meter
//     const handlePasswordChange = (value) => {
//         setPassword(value);
//         const strength = zxcvbn(value).score;
//         setPasswordStrength(strength);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray p-6">
//             <h2 className="text-3xl font-bold mb-6">Register With Us</h2>

//             {/* Server-side Errors */}
//             {serverErrors && (
//                 <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
//                     <h3 className="font-semibold">These errors prohibited the form from being saved:</h3>
//                     <ul className="list-disc pl-5">
//                         {serverErrors.map((error, index) => (
//                             <li key={index} className="text-sm">{error.msg}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6">
//                 {/* Username */}
//                 <TextInput
//                     label="Enter Username"
//                     id="username"
//                     placeholder="Username"
//                     type="text"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     error={clientErrors.username}
//                 />

//                 {/* Email */}
//                 <TextInput
//                     label="Enter Email"
//                     id="email"
//                     placeholder="your@example.com"
//                     type="text"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     error={clientErrors.email}
//                 />

//                 {/* Password */}
//                 <TextInput
//                     label="Enter Password"
//                     id="password"
//                     placeholder="Password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => handlePasswordChange(e.target.value)}
//                     error={clientErrors.password}
//                 />
//                 {passwordStrength !== null && (
//                     <div className="text-sm">
//                         Password Strength:{' '}
//                         <span
//                             className={`font-bold ${
//                                 passwordStrength < 2 ? 'text-red-600' : 'text-green-600'
//                             }`}
//                         >
//                             {['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength]}
//                         </span>
//                     </div>
//                 )}

//                 {/* Confirm Password */}
//                 <TextInput
//                     label="Confirm Password"
//                     id="confirmPassword"
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     error={clientErrors.confirmPassword}
//                 />

//                 {/* Terms and Conditions */}
//                 <div className="flex items-start">
//                     <div className="flex items-center h-5">
//                         <input
//                             id="terms"
//                             type="checkbox"
//                             className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
//                             required
//                         />
//                     </div>
//                     <div className="ml-3 text-sm">
//                         <label htmlFor="terms" className="font-light text-gray-900">
//                             I accept the{' '}
//                             <Link
//                                 to="/terms"
//                                 className="font-medium text-primary-600 hover:underline"
//                             >
//                                 Terms and Conditions
//                             </Link>
//                         </label>
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
//                 >
//                     Create an account
//                 </button>

//                 {/* Redirect to Login */}
//                 <p className="mt-4 text-sm text-gray-600">
//                     Already have an account?{' '}
//                     <Link to="/login" className="text-blue-600 hover:text-blue-700 underline">
//                         Login here
//                     </Link>
//                 </p>
//             </form>
//         </div>
//     );
// }

// // import { useState } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import axios from 'axios';
// // import validator from 'validator';

// // export default function Register() {
// //     const navigate = useNavigate();
// //     const [username, setUsername] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [confirmPassword, setConfirmPassword] = useState('');
// //     const [email, setEmail] = useState('');
// //     const [role] = useState('b2b');
// //     const [serverErrors, setServerErrors] = useState(null);
// //     const [clientErrors, setClientErrors] = useState({});
// //     const errors = {};

// //     const runValidations = () => {
// //         if (username.trim().length === 0) {
// //             errors.username = 'Username is required';
// //         }

// //         if (email.trim().length === 0) {
// //             errors.email = 'Email is required';
// //         } else if (!validator.isEmail(email)) {
// //             errors.email = 'Invalid email format';
// //         }

// //         if (password.trim().length === 0) {
// //             errors.password = 'Password is required';
// //         } else if (password.trim().length < 8 || password.trim().length > 128) {
// //             errors.password = 'Password should be between 8 - 128 characters';
// //         }

// //         if (confirmPassword.trim().length === 0) {
// //             errors.confirmPassword = 'Confirm password is required';
// //         } else if (password !== confirmPassword) {
// //             errors.confirmPassword = 'Passwords do not match';
// //         }
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         const formData = { username, email, password, role };

// //         runValidations();

// //         if (Object.keys(errors).length === 0) {
// //             try {
// //                 await axios.post('http://localhost:3777/users/register', formData);
// //                 navigate('/login');
// //             } catch (err) {
// //                 setServerErrors(err.response.data.errors);
// //             }
// //         } else {
// //             setClientErrors(errors);
// //         }
// //     };

// //     // const handleCheckEmail = async () => {
// //     //     if (validator.isEmail(email)) {
// //     //         const response = await axios.get(`http://localhost:3777/users/checkemail?email=${email}`);
// //     //         if (response.data.is_email_registered) {
// //     //             setClientErrors({ email: 'Email is already registered' });
// //     //         }
// //     //     }
// //     // };

// //     return (
// //         <div className="flex flex-col items-center justify-center min-h-screen bg-gray p-6">
// //             <h2 className="text-3xl font-bold mb-6">Register With Us</h2>

// //             {serverErrors && (
// //                 <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
// //                     <h3 className="font-semibold">These errors prohibited the form from being saved:</h3>
// //                     <ul className="list-disc pl-5">
// //                         {serverErrors.map((ele, i) => (
// //                             <li key={i} className="text-sm">{ele.msg}</li>
// //                         ))}
// //                     </ul>
// //                 </div>
// //             )}

// //             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6">
// //                 <div>
// //                     <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Enter Username</label>
// //                     <input
// //                         type="text"
// //                         value={username}
// //                         onChange={e => setUsername(e.target.value)}
// //                         id="username"
// //                         className="border border-gray-300 rounded-md p-2 w-full"
// //                     />
// //                     {clientErrors.username && <span className="text-red-600 text-sm">{clientErrors.username}</span>}
// //                 </div>

// //                 <div>
// //                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Enter Email</label>
// //                     <input
// //                         type="text"
// //                         value={email}
// //                         onChange={e => setEmail(e.target.value)}
// //                         // onBlur={handleCheckEmail}
// //                         id="email"
// //                         className="border border-gray-300 rounded-md p-2 w-full"
// //                     />
// //                     {clientErrors.email && <span className="text-red-600 text-sm">{clientErrors.email}</span>}
// //                 </div>

// //                 <div>
// //                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Enter Password</label>
// //                     <input
// //                         type="password"
// //                         value={password}
// //                         onChange={e => setPassword(e.target.value)}
// //                         id="password"
// //                         className="border border-gray-300 rounded-md p-2 w-full"
// //                     />
// //                     {clientErrors.password && <span className="text-red-600 text-sm">{clientErrors.password}</span>}
// //                 </div>

// //                 <div>
// //                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
// //                     <input
// //                         type="password"
// //                         value={confirmPassword}
// //                         onChange={e => setConfirmPassword(e.target.value)}
// //                         id="confirmPassword"
// //                         className="border border-gray-300 rounded-md p-2 w-full"
// //                     />
// //                     {clientErrors.confirmPassword && <span className="text-red-600 text-sm">{clientErrors.confirmPassword}</span>}
// //                 </div>

// //                 {/* Terms and Conditions */}
// //       <div className="flex items-start">
// //         <div className="flex items-center h-5">
// //           <input
// //             id="terms"
// //             type="checkbox"
// //             className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600"
// //             required
// //           />
// //         </div>
// //         <div className="ml-3 text-sm">
// //           <label htmlFor="terms" className="font-light text-gray-900 dark:text-gray-800">
// //             I accept the <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Terms and Conditions</a>
// //           </label>
// //         </div>
// //       </div>

// //                 <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">
// //                     Create an account
// //                 </button>
// //                 <p className="mt-4 text-sm text-gray-600">
// //                 Already have an account?{' '}
// //                 <Link to="/login" className="text-blue-600 hover:text-blue-700 underline">
// //                     Login here
// //                 </Link>
// //             </p>
// //             </form>

// //         </div>
// //     );
// // }
