"use client";

import React from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Send,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import CommodityLogo from "./commodityLogo";
import Link from "next/link";

const Footer = () => {
  const darkBackgroundColor = "#111B25";
  const primaryRed = "#AF0000";
  const mutedTextColor = "#a0a0a0";

  return (
    <footer
      className="w-full mt-2 text-white py-12"
      style={{ backgroundColor: darkBackgroundColor }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <CommodityLogo
                className="text-2xl"
                style={{ color: primaryRed }}
              />
              <h1 className="text-2xl font-bold">COMMODITY</h1>
            </div>
            <p className="text-sm" style={{ color: mutedTextColor }}>
              Commodity is an E-commerce website prototype build using MERN
              Stack.
            </p>

            {/* Social Media Icons */}
            {/* <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
                style={{ color: mutedTextColor }}
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
                style={{ color: mutedTextColor }}
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
                style={{ color: mutedTextColor }}
              >
                <Youtube size={20} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
                style={{ color: mutedTextColor }}
              >
                <Send size={20} />
              </a>
            </div> */}
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-bold mb-2">Quick Links</h2>
            <Link
              href="/about"
              className="text-sm hover:underline transition-colors duration-200"
              style={{ color: mutedTextColor }}
            >
              About
            </Link>
            <Link
              href="/help-center"
              className="text-sm hover:underline transition-colors duration-200"
              style={{ color: mutedTextColor }}
            >
              Help Center
            </Link>
          </div>

          {/* Company Section */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-bold mb-2">Company</h2>
            <Link
              href="/privacy-policy"
              className="text-sm hover:underline transition-colors duration-200"
              style={{ color: mutedTextColor }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm hover:underline transition-colors duration-200"
              style={{ color: mutedTextColor }}
            >
              Terms & Conditions
            </Link>
            <Link
              href="/faq"
              className="text-sm hover:underline transition-colors duration-200"
              style={{ color: mutedTextColor }}
            >
              FAQs
            </Link>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-bold mb-2">Contact</h2>
            <div className="flex items-center space-x-2">
              <Phone size={16} style={{ color: mutedTextColor }} />
              <p className="text-sm" style={{ color: mutedTextColor }}>
                +1 (416) 555-0188
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} style={{ color: mutedTextColor }} />
              <p className="text-sm" style={{ color: mutedTextColor }}>
                tamangangel2057@gmail.com
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} style={{ color: mutedTextColor }} />
              <p className="text-sm" style={{ color: mutedTextColor }}>
                Kathmandu, Nepal
              </p>
            </div>
          </div>
        </div>

        {/* Separator line and Copyright */}
        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: mutedTextColor }}
        >
          <div className="flex justify-center">
            <p className="text-sm" style={{ color: mutedTextColor }}>
              © 2025 Commodity. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
