import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  // return (
  //   <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e3f2fd] to-white text-gray-800">
  //     {/* Hero Section */}
  //     <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16">
  //       <h2 className="text-4xl md:text-5xl font-bold mb-6">
  //         Your Daily Productivity Partner
  //       </h2>
  //       <p className="text-lg text-gray-600 max-w-2xl mb-8">
  //         Aurika Labs helps you manage tasks, track goals, and boost your workflow with an intuitive, minimal interface.
  //       </p>
  //       <Link
  //         to="/signup"
  //         className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
  //       >
  //         Get Started for Free
  //       </Link>
  //     </main>

  //     {/* Features Section */}
  //     <section className="bg-white py-16 px-6">
  //       <h3 className="text-3xl font-semibold text-center mb-12 text-blue-800">Why Aurika Labs?</h3>
  //       <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
  //         <div>
  //           <h4 className="text-xl font-semibold mb-2">Smart Task Manager</h4>
  //           <p className="text-gray-600">Create, edit, and organize your tasks with priority and tags.</p>
  //         </div>
  //         <div>
  //           <h4 className="text-xl font-semibold mb-2">Progress Dashboard</h4>
  //           <p className="text-gray-600">Visualize your productivity with interactive charts and summaries.</p>
  //         </div>
  //         <div>
  //           <h4 className="text-xl font-semibold mb-2">Cross-Platform Access</h4>
  //           <p className="text-gray-600">Access your workspace from desktop, tablet, or mobile.</p>
  //         </div>
  //       </div>
  //     </section>

  //   </div>
  // );

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b17] text-white relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-30 blur-[140px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[300px] h-[300px] bg-pink-500 opacity-30 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Build Your{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Productivity
          </span>{" "}
          System
        </h2>

        <p className="text-gray-400 max-w-2xl mb-10 text-lg">
          Aurika Labs helps you manage tasks, track goals, and boost your
          workflow with a powerful and intuitive experience.
        </p>

        <Link
          to="/signup"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 hover:shadow-purple-500/40 transition duration-300"
        >
          Get Started for Free
        </Link>
      </main>

      {/* Features Section */}
      <section className="py-20 px-6 relative z-10">
        <h3 className="text-3xl md:text-4xl font-semibold text-center mb-16">
          Why Aurika Labs?
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:translate-y-[-5px] hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-3">Smart Task Manager</h4>
            <p className="text-gray-400">
              Create, edit, and organize your tasks with priority and tags.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:translate-y-[-5px] hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-3">Progress Dashboard</h4>
            <p className="text-gray-400">
              Visualize your productivity with interactive charts and summaries.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:translate-y-[-5px] hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-3">
              Cross-Platform Access
            </h4>
            <p className="text-gray-400">
              Access your workspace from desktop, tablet, or mobile.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
