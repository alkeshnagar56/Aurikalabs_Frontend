// src/App.jsx

import { useContext, useEffect } from "react";
import "./App.css";

import RouteFile from "./RouteFile";

import { AuthContext } from "./context/AuthContext";
import { fetchUserProfile } from "./services/authService";

import { Toaster } from "react-hot-toast";

import "react-datepicker/dist/react-datepicker.css";
import "./styles/datepicker.css";

function App() {
  const { setUser, setLoading } = useContext(AuthContext);

  useEffect(() => {
    const Profile = async () => {
      try {
        const res = await fetchUserProfile();

        setUser(res.data);
      } catch (err) {
        if (err.response?.data?.message !== "Unauthorized access") {
          console.error(err);
        }

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    Profile();
  }, [setUser, setLoading]);

  return (
    <div className="relative min-h-screen bg-[#070711] text-white">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[140px]" />

        <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-pink-500/20 blur-[140px]" />
      </div>

      <RouteFile />

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
