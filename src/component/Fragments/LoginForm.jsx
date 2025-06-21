import React from "react";
import { useNavigate, Link } from "react-router-dom";
import InputWithLabel from "../Elements/Input/index";
import Button from "../Elements/Button/index";
import ErrorMessage from "../Elements/Message/ErrorMessage";
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  error,
  loading,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <InputWithLabel
        label="Username"
        type="text"
        placeholder="Username anda"
        value={username}
        onChange={onUsernameChange}
        icon={FaUser}
      />

      <InputWithLabel
        label="Password"
        type="password"
        placeholder="Password anda"
        value={password}
        onChange={onPasswordChange}
        icon={FaLock}
      />
      <p className="text-xs text-right text-gray-600 mt-3">
        <Link to="/lupapassword" className="text-blue-600 hover:underline">
          Lupa Password?
        </Link>
      </p>
      <ErrorMessage message={error} />

    <div className="w-full flex justify-center mt-6">
        <Button
            loading={loading}
            type="submit"
            variant="dark"
            size="md"
            className="w-full py-2 text-sm"
        >
            Masuk
        </Button>
    </div>

    </form>
  );
};

export default LoginForm;
