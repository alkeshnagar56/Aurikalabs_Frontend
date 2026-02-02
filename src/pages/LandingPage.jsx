import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e3f2fd] to-white text-gray-800">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Your Daily Productivity Partner
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Aurika Labs helps you manage tasks, track goals, and boost your workflow with an intuitive, minimal interface.
        </p>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Get Started for Free
        </Link>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <h3 className="text-3xl font-semibold text-center mb-12 text-blue-800">Why Aurika Labs?</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          <div>
            <h4 className="text-xl font-semibold mb-2">Smart Task Manager</h4>
            <p className="text-gray-600">Create, edit, and organize your tasks with priority and tags.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Progress Dashboard</h4>
            <p className="text-gray-600">Visualize your productivity with interactive charts and summaries.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Cross-Platform Access</h4>
            <p className="text-gray-600">Access your workspace from desktop, tablet, or mobile.</p>
          </div>
        </div>
      </section>


    </div>
  );
};

export default LandingPage;
