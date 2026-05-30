// src/components/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-[#070711]/80 backdrop-blur-xl overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[180px] bg-purple-600/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-[220px] h-[220px] bg-pink-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">

          {/* Brand Section */}
          <div className="max-w-sm text-center lg:text-left">

            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Aurika Labs
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              A collaborative workspace for managing projects,
              tracking tasks, and improving team productivity with
              a modern experience.
            </p>

            {/* Socials */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-5">

              <a
                href="https://github.com/alkeshnagar56"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <Github size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="mailto:support@aurikalabs.com"
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-center lg:text-left">

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                Product
              </h4>

              <div className="flex flex-col gap-3 text-sm text-gray-400">

                <Link
                  to="/dashboard"
                  className="hover:text-white transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/assignedtasks"
                  className="hover:text-white transition"
                >
                  Tasks
                </Link>

                <Link
                  to="/associatedprojects"
                  className="hover:text-white transition"
                >
                  Projects
                </Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                Company
              </h4>

              <div className="flex flex-col gap-3 text-sm text-gray-400">

                <button className="text-left hover:text-white transition">
                  About
                </button>

                <button className="text-left hover:text-white transition">
                  Contact
                </button>

                <button className="text-left hover:text-white transition">
                  Careers
                </button>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                Legal
              </h4>

              <div className="flex flex-col gap-3 text-sm text-gray-400">

                <button className="text-left hover:text-white transition">
                  Privacy Policy
                </button>

                <button className="text-left hover:text-white transition">
                  Terms of Service
                </button>

                <button className="text-left hover:text-white transition flex items-center gap-1">
                  Documentation
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Aurika Labs. All rights reserved.
          </p>

          <p className="text-sm text-gray-500 text-center md:text-right">
            Designed & Developed by{" "}
            <span className="text-purple-400 font-medium">
              Alkesh Nagar
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;