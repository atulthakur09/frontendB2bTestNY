import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    serverErrors: null,
    clientErrors: {},
  });

  const errors = {};

  const runValidations = () => {
    if (form.email.trim().length === 0) {
      errors.email = "email is required";
    } else if (!validator.isEmail(form.email)) {
      errors.email = "Incorrect email or password";
    }

    if (form.password.trim().length === 0) {
      errors.password = "password is required";
    } else if (
      form.password.trim().length < 8 ||
      form.password.trim().length > 128
    ) {
      errors.password = "Incorrect email or password ";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = _.pick(form, ["email", "password"]);

    runValidations();

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/users/login`,
          formData
        );
        localStorage.setItem("token", response.data.token);
        const userResponse = await axios.get(`${API_BASE_URL}/users/account`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        handleLogin(userResponse.data);
        navigate("/");
      } catch (err) {
        setForm({
          ...form,
          serverErrors: err.response.data.errors,
          clientErrors: {},
        });
      }
    } else {
      setForm({ ...form, clientErrors: errors });
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const displayErrors = () => {
    let result;
    if (typeof form.serverErrors == "string") {
      result = <p> {form.serverErrors} </p>;
    } else {
      result = (
        <div>
          <h3>Theses errors prohibited the form from being saved: </h3>
          <ul>
            {form.serverErrors.map((ele, i) => {
              return <li key={i}> {ele.msg} </li>;
            })}
          </ul>
        </div>
      );
    }
    return result;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Login
        </h2>

        {form.serverErrors && (
          <div className="mb-4 text-red-600 text-center">{displayErrors()}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter email
            </label>
            <input
              type="text"
              value={form.email}
              onChange={handleChange}
              name="email"
              id="email"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-600"
              placeholder="you@example.com"
              required
            />
            {form.clientErrors.email && (
              <span className="text-red-600 text-sm">
                {form.clientErrors.email}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange}
              name="password"
              id="password"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-600"
              placeholder="********"
              required
            />
            {form.clientErrors.password && (
              <span className="text-red-600 text-sm">
                {form.clientErrors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-800">
            New to Dr.MechNY?
            <Link
              to="/register"
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>

    // <div>

    //     <h2>Login</h2>
    //     { form.serverErrors && displayErrors() }
    //     <form onSubmit={handleSubmit}>
    //         <label htmlFor="email">Enter email</label><br />
    //         <input
    //             type="text"
    //             value={form.email}
    //             onChange={handleChange}
    //             name="email"
    //             id="email"
    //         />
    //         { form.clientErrors.email && <span> { form.clientErrors.email } </span>}
    //          <br />

    //         <label htmlFor="password">Enter password</label><br />
    //         <input
    //             type="password"
    //             value={form.password}
    //             onChange={handleChange}
    //             name="password"
    //             id="password"
    //         />
    //         { form.clientErrors.password && <span> { form.clientErrors.password } </span> }
    //         <br />

    //         <input type="submit" />
    //     </form>
    // </div>
  );
}
