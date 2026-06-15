import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
            "https://expense-sharing-app-b8cu.onrender.com/users/login",
            {
                email: formData.email,
                password: formData.password,
            }
        );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("RESPONSE:", error.response);
        console.log("DATA:", error.response?.data);

        alert(
            JSON.stringify(error.response?.data) ||
            "Invalid Credentials"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Expense Sharing App
          </h1>

          <p className="text-gray-400 mt-2">
            Login to continue
          </p>
        </div>
        <div className="mt-6 text-center">
            <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                to="/register"
                className="text-blue-500 hover:text-blue-400"
                >
                Register
                </Link>
            </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;