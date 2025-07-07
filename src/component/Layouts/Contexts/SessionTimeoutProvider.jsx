import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Pastikan path ini benar

// --- Komponen Modal ---
// Didefinisikan di sini untuk kemudahan, bisa juga diimpor dari file lain.
const TimeoutModal = ({ onLogout }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
    <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-sm mx-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Sesi Anda Telah Berakhir
      </h2>
      <p className="text-gray-600 mb-6">
        Untuk alasan keamanan, sesi Anda telah ditutup karena tidak ada
        aktivitas.
      </p>
      <button
        onClick={onLogout}
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        Login Kembali
      </button>
    </div>
  </div>
);

// --- Provider Utama ---
export const SessionTimeoutProvider = ({ children, timeoutInMinutes = 15 }) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Menggunakan useRef untuk menyimpan ID timeout agar tidak memicu re-render
  const timeoutIdRef = useRef(null);

  // Fungsi untuk logout dan redirect. Dibuat dengan useCallback agar tidak dibuat ulang terus-menerus.
  const handleLogoutAndRedirect = useCallback(() => {
    logout(); // Hapus token dan data user dari localStorage
    navigate("/login"); // Arahkan ke halaman login
    setIsTimedOut(false); // Sembunyikan modal
  }, [logout, navigate]);

  // Fungsi untuk mereset timer
  const resetTimeout = useCallback(() => {
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setIsTimedOut(true); // Tampilkan modal saat timeout
    }, timeoutInMinutes * 60 * 1000);
  }, [timeoutInMinutes]);

  // Atur dan bersihkan event listener
  useEffect(() => {
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    const eventListener = () => resetTimeout();

    // Tambahkan event listener untuk mereset timer
    events.forEach((event) => {
      window.addEventListener(event, eventListener);
    });

    // Mulai timer saat komponen dimuat
    resetTimeout();

    // Fungsi cleanup untuk menghapus listener saat komponen di-unmount
    return () => {
      clearTimeout(timeoutIdRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, eventListener);
      });
    };
  }, [resetTimeout]);

  return (
    <>
      {children}
      {isTimedOut && <TimeoutModal onLogout={handleLogoutAndRedirect} />}
    </>
  );
};
