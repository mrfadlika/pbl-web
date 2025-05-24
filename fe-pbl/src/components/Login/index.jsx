import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin");
    }
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await axios
      .post("https://laravel-be.raffifadlika.com/api/auth/login", formData)
      .then((response) => {
        localStorage.setItem("token", response.data.access_token);
        navigate("/");
      })
      .catch((error) => {
        setValidation(error.response.data);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <h5 className="text-center text-gray-500 mb-6">Lost and Found</h5>

        {validation.error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
            {validation.error}
          </div>
        )}

        <form onSubmit={loginHandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            {validation.email && (
              <p className="text-sm text-red-600 mt-1">{validation.email[0]}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
            />
            {validation.password && (
              <p className="text-sm text-red-600 mt-1">{validation.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Masuk
          </button>

          {/* <hr className="my-6" />

          <p className="text-center text-sm">
            Belum punya akun?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              daftar sekarang
            </a>
          </p> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
