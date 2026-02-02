import { useContext, useEffect } from "react";
import "./App.css";
import RouteFile from "./RouteFile";
import { AuthContext } from "./context/AuthContext";
import { fetchUserProfile } from "./services/authService";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, setUser, setLoading } = useContext(AuthContext);
  useEffect(() => {
    const Profile = async () => {
      try {
        const res = await fetchUserProfile();
        setUser(res.data);
      } catch (err) {
        if (err.response.data.message !== "Unauthorized access") {

        } else {
          console.error(
            "User is not valid or token not found",
            err.response?.data
          );
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    Profile();
  }, [setUser, setLoading]);

  return (
    <div>
      <RouteFile />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
