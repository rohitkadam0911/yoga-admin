import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api/v1";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/admin/login`,
                formData,
                {
                    withCredentials: true
                }
            );

            if (!response.data.success) {
                toast.error(response.data.message);
                return;
            }

            if (response.data.token) {
                localStorage.setItem("adminToken", response.data.token);
            }

            toast.success("Admin Login Successful");

            navigate("/admin");

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

                <h1 className="text-3xl font-bold text-center mb-2">
                    YogaConnect
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Admin Login
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Admin email"
                            className="w-full border rounded-xl px-4 py-3"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full border rounded-xl px-4 py-3"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-xl"
                    >
                        {loading ? "Logging in..." : "Admin Login"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;