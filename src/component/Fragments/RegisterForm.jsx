import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputWithLabel from "../Elements/Input/index";
import ErrorMessage from "../Elements/Message/ErrorMessage";
import Button from "../Elements/Button/index";
import { FaEnvelope, FaUser, FaSignature, FaPhone, FaLock } from "react-icons/fa";

const RegisterForm = () => {
    const navigate = useNavigate();
    
    const PASSWORD_MIN_LENGTH = 8;
    const PASSWORD_MAX_LENGTH = 20;
    const PHONE_MIN_LENGTH = 8;
    const PHONE_MAX_LENGTH = 15;

    const [form, setForm] = useState({
        email: "",
        username: "",
        name: "",
        nomor_telp: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        username: "",
        name: "",
        nomor_telp: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const validateNomorTelp = (nomor) => {
        const cleanedNumber = nomor.replace(/[\s-]/g, "");
        
        if (!/^\d+$/.test(cleanedNumber) || cleanedNumber.length === 0) {
            return "Nomor telepon hanya boleh berisi angka";
        }
        
        if (cleanedNumber.length < PHONE_MIN_LENGTH || cleanedNumber.length > PHONE_MAX_LENGTH) {
            return `Nomor telepon harus antara ${PHONE_MIN_LENGTH}-${PHONE_MAX_LENGTH} digit`;
        }

        return "";
    };

    const validatePassword = (password) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return `Password minimal ${PASSWORD_MIN_LENGTH} karakter`;
        }
        
        if (password.length > PASSWORD_MAX_LENGTH) {
            return `Password maksimal ${PASSWORD_MAX_LENGTH} karakter`;
        }
        
        return "";
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return "Password dan konfirmasi password tidak sama";
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        if (name === "nomor_telp") {
            const errorMsg = validateNomorTelp(value);
            setFieldErrors(prev => ({ ...prev, nomor_telp: errorMsg }));
        } else if (name === "password") {
            const errorMsg = validatePassword(value);
            setFieldErrors(prev => ({ ...prev, password: errorMsg }));
            if (form.password_confirmation) {
                const confirmErrorMsg = validateConfirmPassword(value, form.password_confirmation);
                setFieldErrors(prev => ({ ...prev, password_confirmation: confirmErrorMsg }));
            }
        } else if (name === "password_confirmation") {
            const errorMsg = validateConfirmPassword(form.password, value);
            setFieldErrors(prev => ({ ...prev, password_confirmation: errorMsg }));
        }

        if (error) setError("");
    };

    const validateForm = () => {
        const errors = {
            email: "",
            username: "",
            name: "",
            nomor_telp: validateNomorTelp(form.nomor_telp),
            password: validatePassword(form.password),
            password_confirmation: validateConfirmPassword(form.password, form.password_confirmation),
        };
        
        setFieldErrors(errors);
        
        return !Object.values(errors).some(error => error !== "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!validateForm()) {
            setError("Harap perbaiki kesalahan pada formulir");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    const serverErrors = {};
                    Object.keys(data.errors).forEach(key => {
                        serverErrors[key] = data.errors[key][0];
                    });
                    setFieldErrors(prev => ({ ...prev, ...serverErrors }));
                    setError("Terdapat kesalahan pada data yang dimasukkan");
                } else {
                    setError(data.message || "Gagal mendaftar");
                }
            } else {
                setSuccess("Registrasi berhasil! Mengalihkan ke halaman login...");
                setForm({
                    email: "",
                    username: "",
                    name: "",
                    nomor_telp: "",
                    password: "",
                    password_confirmation: "",
                });
                setFieldErrors({
                    email: "",
                    username: "",
                    name: "",
                    nomor_telp: "",
                    password: "",
                    password_confirmation: "",
                });
                setTimeout(() => {
                    navigate("/login", { 
                        state: { 
                            message: "Registrasi berhasil! Silakan login dengan akun Anda.",
                            email: form.email 
                        }
                    });
                }, 2000);
            }
        } catch (err) {
            setError("Terjadi kesalahan saat mendaftar");
        }

        setLoading(false);
    };

    const hasErrors = Object.values(fieldErrors).some(error => error !== "");

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputWithLabel
                label="Email"
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                icon={FaEnvelope}
                name="email"
                required
                error={fieldErrors.email}
            />
            <InputWithLabel
                label="Username"
                type="text"
                placeholder="Masukkan username"
                value={form.username}
                onChange={handleChange}
                icon={FaUser}
                name="username"
                required
                error={fieldErrors.username}
            />
            <InputWithLabel
                label="Nama Lengkap"
                type="text"
                placeholder="Masukkan nama"
                value={form.name}
                onChange={handleChange}
                icon={FaSignature}
                name="name"
                required
                error={fieldErrors.name}
            />
            <div>
                <InputWithLabel
                    label="Nomor Telp"
                    type="text"
                    placeholder="Masukkan nomor telepon"
                    value={form.nomor_telp}
                    onChange={handleChange}
                    icon={FaPhone}
                    name="nomor_telp"
                    required
                    error={fieldErrors.nomor_telp}
                />
                {fieldErrors.nomor_telp && (
                    <div className="text-red-500 text-xs mt-1">{fieldErrors.nomor_telp}</div>
                )}
            </div>
            <div>
                <InputWithLabel
                    label="Password"
                    type="password"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={handleChange}
                    icon={FaLock}
                    name="password"
                    required
                    error={fieldErrors.password}
                />
                {fieldErrors.password && (
                    <div className="text-red-500 text-xs mt-1">{fieldErrors.password}</div>
                )}
            </div>
            <div>
                <InputWithLabel
                    label="Konfirmasi Password"
                    type="password"
                    placeholder="Masukkan ulang password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    icon={FaLock}
                    name="password_confirmation"
                    required
                    error={fieldErrors.password_confirmation}
                />
                {fieldErrors.password_confirmation && (
                    <div className="text-red-500 text-xs mt-1">{fieldErrors.password_confirmation}</div>
                )}
            </div>
            {error && <ErrorMessage message={error} />}
            {success && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-md mb-4 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {success}
                </div>
            )}
            <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-3 rounded">
                <p className="font-medium mb-1">Ketentuan Password:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Minimal {PASSWORD_MIN_LENGTH} karakter</li>
                    <li>Maksimal {PASSWORD_MAX_LENGTH} karakter</li>
                </ul>
                <p className="font-medium mb-1 mt-2">Ketentuan Nomor Telepon:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Hanya boleh mengandung angka (0-9)</li>
                    <li>Panjang antara {PHONE_MIN_LENGTH}-{PHONE_MAX_LENGTH} digit</li>
                </ul>
            </div>
            <div className="w-full flex justify-center mt-6">
                <Button
                    loading={loading}
                    type="submit"
                    variant="dark"
                    size="md"
                    className="w-full py-2 text-sm"
                    disabled={loading || success || hasErrors}
                >
                    {loading ? "Mendaftar..." : success ? "Berhasil!" : "Daftar"}
                </Button>
            </div>
            <p className="text-xs text-center text-gray-600 mt-3">
                Sudah memiliki akun? <Link to="/login" className="text-blue-600 hover:underline">Login sekarang</Link>
            </p>
        </form>
    );
};

export default RegisterForm;