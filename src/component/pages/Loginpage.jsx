import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../../services/api"; 
import LoginForm from "../Fragments/LoginForm"; 


const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");

    if (isLoggedIn === "true") {
      if (role === "admin" || role === "ketua") {
        navigate("/admindashboard"); 
      } else if (role === "peserta") {
        navigate("/"); 
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { 
        username,
        password,
      });

      const data = response.data;

      const userRoleFromAPI = data.user ? data.user.peran : undefined;

      if (data.access_token) {
        localStorage.setItem("jwt", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user)); 
        localStorage.setItem("userRole", userRoleFromAPI);
        
        setAuthToken(data.access_token); 
      } else {
        // PERINGATAN: access_token TIDAK ditemukan dalam respons login API.
        // Ini menandakan masalah di backend yang tidak mengembalikan token.
      }

      localStorage.setItem("isLoggedIn", "true"); 

      if (userRoleFromAPI === "admin" || userRoleFromAPI === "ketua") {
        navigate("/admindashboard");
        window.location.reload()
      } else if (userRoleFromAPI === "peserta") {
        navigate("/");
        window.location.reload()
      } else {
        setError("Unauthorized role");
        setAuthToken(null);
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        localStorage.removeItem("isLoggedIn");
      }

    } catch (err) {
      setError(
        "Login gagal: " +
          (err.response?.data?.error || "Cek kembali username dan password")
      );
      setAuthToken(null);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("isLoggedIn");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full h-screen bg-cover bg-center flex items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-md w-[350px]">
          <h2 className="text-2xl font-semibold text-center mb-1">EduSkill</h2>
          <p className="text-sm text-center text-blue-600 mb-4">Login</p>

          <LoginForm
            username={username}
            password={password}
            onUsernameChange={(e) => setUsername(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
          />

          <p className="text-xs text-center text-gray-600 mt-3">
            Belum memiliki akun?{" "}
            <Link to="/regis" className="text-blue-600 hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
