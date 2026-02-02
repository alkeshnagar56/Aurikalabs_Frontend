import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import AssociatedProjects from "./pages/AssociatedProjects";
import Profile from "./pages/Profile";
import AssignedTasks from "./pages/AssignedTasks";
import ChatRoom from "./components/ChatRoom";

const RouteFile = () => {
  return (
    <Router>
      <Navbar />
      <MainRoutes />
    </Router>
  );
};

const MainRoutes = () => {
  const location = useLocation();

  // hide footer on chat pages
  const hideFooter = location.pathname.startsWith("/chat/");

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/project/task/:id" element={<TaskDetails />} />
        <Route path="/associatedprojects" element={<AssociatedProjects />} />
        <Route path="/assignedtasks" element={<AssignedTasks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat/:conversationType/:conversationId" element={<ChatRoom />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
};

export default RouteFile;
