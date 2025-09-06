import React from "react";
import Link from "next/link";
import CustomNavbar from "@/components/navbar";
import Footer from "@/components/Footer";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <CustomNavbar />

      <div className="flex-grow flex items-center justify-center p-8 text-center">
        <div className="max-w-xl mx-auto bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-9xl font-bold text-[#AF0000] mb-4">404</h1>
          <h2 className="text-4xl font-semibold text-[#111B25] mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#111B25] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-200"
          >
            Go to Home Page
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default NotFoundPage;
