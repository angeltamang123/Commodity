import React from "react";
import CustomNavbar from "@/components/navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const TermsAndConditionsPage = () => {
  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <CustomNavbar />

      <div className="flex-grow container mx-auto px-4 py-12">
        {/* Main Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111B25] mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </section>

        <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl mx-auto space-y-8 text-gray-700">
          {/* Introduction */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Agreement to Terms
            </h2>
            <p className="leading-relaxed">
              By accessing or using the services provided by this website
              (&quot;the Site&quot;), you agree to be bound by these Terms and
              Conditions. If you do not agree to all of these terms, you are not
              authorized to use the Site.
            </p>
          </div>

          {/* Use of the Website */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Use of the Site
            </h2>
            <p className="leading-relaxed">
              You agree to use the Site only for lawful purposes and in a way
              that does not infringe on the rights of, restrict, or inhibit
              anyone else&apos;s use and enjoyment of the Site. Prohibited
              behavior includes harassing or causing distress or inconvenience
              to any other user, transmitting obscene or offensive content, or
              disrupting the normal flow of dialogue within the Site.
            </p>
          </div>

          {/* User Accounts */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              User Accounts
            </h2>
            <p className="leading-relaxed">
              If you create an account on the Site, you are responsible for
              maintaining the security of your account and you are fully
              responsible for all activities that occur under the account. You
              must immediately notify us of any unauthorized use of your account
              or any other breaches of security.
            </p>
          </div>

          {/* Intellectual Property */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Intellectual Property
            </h2>
            <p className="leading-relaxed">
              The Site and its original content, features, and functionality are
              owned by us and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property
              or proprietary rights laws.
            </p>
          </div>

          {/* Prohibited Activities */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Prohibited Activities
            </h2>
            <p className="leading-relaxed">
              You may not access or use the Site for any purpose other than that
              for which we make the Site available. The Site may not be used in
              connection with any commercial endeavors except those that are
              specifically endorsed or approved by us.
            </p>
          </div>

          {/* Disclaimers */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Disclaimer of Warranties
            </h2>
            <p className="leading-relaxed">
              The Site is provided on an &quot;as-is&quot; and
              &quot;as-available&quot; basis. Your use of the Site and our
              services is at your sole risk. We expressly disclaim all
              warranties of any kind, whether express or implied, including, but
              not limited to, the implied warranties of merchantability, fitness
              for a particular purpose, and non-infringement.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              In no event will we, or our affiliates, be liable for any direct,
              indirect, incidental, special, consequential, or punitive damages,
              including, without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the Site.
            </p>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Governing Law
            </h2>
            <p className="leading-relaxed">
              These Terms shall be governed and construed in accordance with the
              laws of [Your State/Country], without regard to its conflict of
              law provisions.
            </p>
          </div>

          {/* Changes to the Terms */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Changes to These Terms
            </h2>
            <p className="leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. By continuing to access or use our Site
              after those revisions become effective, you agree to be bound by
              the revised terms.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-3xl font-bold text-[#AF0000] mb-4">
              Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us at
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

export default TermsAndConditionsPage;
