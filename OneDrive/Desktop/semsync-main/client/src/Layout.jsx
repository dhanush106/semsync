// src/components/Layout.jsx
import React from "react";
import Navbar from "./components/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-clay-50 text-clay-900">
      <Navbar />
      <main className="flex-1 p-6 overflow-auto max-w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
