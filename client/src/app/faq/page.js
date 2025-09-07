import React from "react";
import CustomNavbar from "@/components/navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const FAQPage = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "To create an account, simply click the Register button in the top right corner of the page and follow the on-screen instructions.",
    },
    {
      question: "What kind of data does the platform use?",
      answer:
        "Our platform uses a variety of data sources, including real-time market data, historical trends, and publicly available economic indicators to provide comprehensive analysis and insights.",
    },
    {
      question: "How is my data kept secure?",
      answer:
        "We prioritize the security of your data. We use industry-standard encryption protocols and secure servers to protect your personal and financial information. For more details, please review our Privacy Policy.",
    },
    {
      question: "What is Commodity AI?",
      answer:
        "Commodity AI is our upcoming feature that will provide an intelligent, conversational AI assistant to help you with real-time support and personalized insights. It's designed to streamline your experience on the platform.",
    },
    {
      question: "How can I contact customer support?",
      answer: (
        <span>
          If you can't find the answer to your question here, you can contact
          our support team directly. Please visit our{" "}
          <Link href="/help-center" className="text-blue-500 hover:underline">
            Help Center
          </Link>{" "}
          for more information on how to get in touch.
        </span>
      ),
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <CustomNavbar />

      <div className="flex-grow container mx-auto px-4 py-12">
        {/* Main Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111B25] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to the most common questions about our platform and
            services.
          </p>
        </section>

        <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl mx-auto space-y-6 text-gray-700">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b last:border-b-0 pb-6 mb-6">
              <h3 className="text-xl font-semibold text-[#AF0000] mb-2">
                {faq.question}
              </h3>
              <p className="leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default FAQPage;
