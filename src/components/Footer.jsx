import React from "react";

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="text-center py-6 bg-gray-100 text-gray-500">
        © {new Date().getFullYear()} Aurika Labs. All rights reserved.
      </footer>
    </div>
  );
};

export default Footer;
