import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Project from "../components/Project";
import {
  Sparkles,
  LayoutDashboard,
  Rocket,
  Activity,
} from "lucide-react";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null && loading === false) {
      navigate("/signup");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#070710] text-white px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[140px] top-[-120px] left-[-120px]" />
      <div className="absolute w-[350px] h-[350px] bg-pink-500/20 blur-[140px] bottom-[-120px] right-[-120px]" />
      <div className="absolute w-[250px] h-[250px] bg-blue-500/10 blur-[120px] top-[35%] left-[45%]" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b17] shadow-2xl mb-8">
          
          {/* Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 p-6 md:p-10">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Productivity Workspace
            </div>

            {/* Heading */}
            {user && (
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
                  {user.name}
                </span>
              </h1>
            )}

            {/* Subtitle */}
            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              Manage projects, collaborate with your team, track assigned tasks,
              and streamline productivity — all in one workspace.
            </p>

            {/* Mini Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              
              {/* Card 1 */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:border-purple-500/20 transition">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                  <LayoutDashboard className="w-6 h-6 text-purple-400" />
                </div>

                <h3 className="font-semibold text-white mb-1">
                  Smart Workspace
                </h3>

                <p className="text-sm text-gray-400">
                  Organize all projects in one centralized dashboard.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:border-pink-500/20 transition">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-3">
                  <Rocket className="w-6 h-6 text-pink-400" />
                </div>

                <h3 className="font-semibold text-white mb-1">
                  Faster Collaboration
                </h3>

                <p className="text-sm text-gray-400">
                  Work seamlessly with teammates using integrated chat.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:border-blue-500/20 transition">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>

                <h3 className="font-semibold text-white mb-1">
                  Real-Time Progress
                </h3>

                <p className="text-sm text-gray-400">
                  Track tasks, priorities, and project progress efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Section */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b17]/95 backdrop-blur-2xl shadow-2xl">
          
          {/* Inner Glow */}
          <div className="absolute -top-24 right-0 w-72 h-72 bg-purple-500/5 blur-3xl rounded-full" />

          <div className="relative z-10 p-4 md:p-6">
            <Project />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;