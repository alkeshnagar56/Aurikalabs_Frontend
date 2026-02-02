import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Project from "../components/Project";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null && loading === false) {
      navigate("/signup");
    }
  }, [user, loading, navigate]);

  return (
    <>
    <div className="p-4 text-2xl  ">
      {user&&(<h1>Welcome, {user.name}</h1>)}
      <p className="text-xl text-gray-500">lets start where we left off</p>
    </div>
      <Project/>
    </>
  );
}

export default Dashboard;
