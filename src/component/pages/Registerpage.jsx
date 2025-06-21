import React from "react";
// import bgForm from "../../assets/bgform2.png";
import RegisterForm from "../Fragments/RegisterForm";

const RegisterPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white"
      // style={{ backgroundImage: `url(${bgForm})`, backgroundSize: "cover" }}
    >
      <div className="bg-white p-8 rounded-md shadow-md w-[350px]">
        <h2 className="text-2xl font-semibold text-center mb-1">EduSkill</h2>
        <p className="text-sm text-center text-blue-600 mb-4">Register</p>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
