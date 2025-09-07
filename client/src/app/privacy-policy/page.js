import React from "react";
import CustomNavbar from "@/components/navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <CustomNavbar />

      <div className="flex-grow container mx-auto px-4 py-12">
        {/* Main Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111B25] mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy outlines how we
            collect, use, and protect your personal information.
          </p>
        </section>

        <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl mx-auto space-y-8 text-gray-700">
          {/* Introduction */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Introduction
            </h2>
            <p className="leading-relaxed">
              This Privacy Policy describes how your personal information is
              collected, used, and shared when you visit or make a purchase from
              this website (&quot;the Site&quot;).
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Information We Collect
            </h2>
            <p className="leading-relaxed">
              When you visit the Site, we automatically collect certain
              information about your device, including your web browser, IP
              address, time zone, and some of the cookies that are installed on
              your device. Additionally, as you browse the Site, we collect
              information about the individual web pages or products that you
              view, what websites or search terms referred you to the Site, and
              information about how you interact with the Site.
            </p>
            <p className="leading-relaxed mt-4">
              When you make a purchase or attempt to make a purchase through the
              Site, we collect certain information from you, including your
              name, billing address, shipping address, payment information,
              email address, and phone number.
            </p>
          </div>

          {/* How We Use Your Information */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              We use the Order Information that we collect generally to fulfill
              any orders placed through the Site (including processing your
              payment information, arranging for shipping, and providing you
              with invoices and/or order confirmations). Additionally, we use
              this Order Information to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Communicate with you;</li>
              <li>Screen our orders for potential risk or fraud; and</li>
              <li>
                When in line with the preferences you have shared with us,
                provide you with information or advertising relating to our
                products or services.
              </li>
            </ul>
          </div>

          {/* Sharing Your Information */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Sharing Your Information
            </h2>
            <p className="leading-relaxed">
              We share your Personal Information with third parties to help us
              use your Personal Information, as described above. We may also
              share your Personal Information to comply with applicable laws and
              regulations, to respond to a subpoena, search warrant, or other
              lawful request for information we receive, or to otherwise protect
              our rights.
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Your Rights
            </h2>
            <p className="leading-relaxed">
              You have the right to access personal information we hold about
              you and to ask that your personal information be corrected,
              updated, or deleted. If you would like to exercise this right,
              please contact us through the contact information below.
            </p>
          </div>

          {/* Changes to This Policy */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time in order to
              reflect, for example, changes to our practices or for other
              operational, legal, or regulatory reasons. We will notify you of
              any changes by posting the new Privacy Policy on this page.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Contact Us
            </h2>
            <p className="leading-relaxed">
              For more information about our privacy practices, if you have
              questions, or if you would like to make a complaint, please
              contact us by email at{" "}
              <Link
                href="mailto:tamangangel2057@gmail.com"
                className="text-blue-500 hover:underline"
              >
                tamangangel2057@gmail.com
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default PrivacyPolicyPage;
