import { useState, useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

const AppContent = () => {
  const { user, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(true);
  const [mode, setMode] = useState("login");

  if (user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <button
          onClick={() => { setMode("login"); setShowModal(true); }}
          className="bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
        >
          Login
        </button>
        <button
          onClick={() => { setMode("signup"); setShowModal(true); }}
          className="ml-4 bg-purple-600 px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
        >
          Sign Up
        </button>
      </div>
      {showModal && <AuthModal mode={mode} onClose={() => setShowModal(false)} />}
    </>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
