"use client";
import React from "react";
import CustomNavbar from "@/components/navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

const HelpCenterPage = () => {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <CustomNavbar />

      <div className="flex-grow container mx-auto px-4 py-12">
        {/* Main Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111B25] mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant support, find helpful resources, or contact our team
            directly.
          </p>
        </section>

        {/* AI Notice Section */}
        <section className="text-center mb-12">
          <div
            onClick={() => {
              router.push("/chatbot");
            }}
            className="p-8 bg-[#AF0000] text-white rounded-xl shadow-lg transform transition-transform cursor-pointer hover:scale-105 duration-300"
          >
            <div className="flex justify-center mb-4">
              <MessageSquare size={50} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              ✨ Commodity AI: Comma is here!
            </h2>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto">
              We&apos;ve built an advanced AI agent to provide you with instant,
              intelligent customer support. Get ready for a seamless,
              conversational help experience, Try now!
            </p>
          </div>
        </section>

        {/* Get In Touch Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#111B25] text-center mb-6">
            Get in Touch
          </h2>
          <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="mailto:tamangangel2057@gmail.com"
              className="group flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Mail
                size={36}
                className="text-[#AF0000] group-hover:text-[#8F0000] transition-colors"
              />
              <p className="mt-4 text-xl font-semibold text-[#111B25]">
                Email Us
              </p>
              <p className="text-gray-500 text-sm mt-1 text-center">
                Get a detailed response within 24 hours.
              </p>
            </Link>
            <Link
              href="/faq"
              className="group flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Phone
                size={36}
                className="text-[#AF0000] group-hover:text-[#8F0000] transition-colors"
              />
              <p className="mt-4 text-xl font-semibold text-[#111B25]">
                Call Us
              </p>
              <p className="text-gray-500 text-sm mt-1 text-center">
                Our support team is available during business hours.
              </p>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default HelpCenterPage;
