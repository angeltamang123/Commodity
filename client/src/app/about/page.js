import React from "react";
import CustomNavbar from "@/components/navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const AboutPage = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <CustomNavbar />

      <div className="flex-grow container mx-auto px-4 py-12 space-y-12">
        {/* About the Developer Section */}
        <section className="bg-gray-50 p-8 rounded-lg shadow-sm">
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "#AF0000" }}
          >
            About the Developer
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Hello! My name is{" "}
            <strong className="font-semibold">Angel Tamang</strong>. This
            project is a demonstration of my skills in full-stack web
            development. You can find out more about me and my work through the
            links below:
          </p>
          <div className="mt-6 space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold" style={{ color: "#AF0000" }}>
                Portfolio:
              </span>{" "}
              <Link
                href="https://www.angel-tamang.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                https://www.angel-tamang.com.np
              </Link>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold" style={{ color: "#AF0000" }}>
                Email:
              </span>{" "}
              <Link
                href="mailto:tamangangel2057@gmail.com"
                className="text-blue-500 hover:underline"
              >
                tamangangel2057@gmail.com
              </Link>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold" style={{ color: "#AF0000" }}>
                LinkedIn:
              </span>{" "}
              <Link
                href="https://www.linkedin.com/in/angel-tamang-28438027a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                https://www.linkedin.com/in/angel-tamang-28438027a/
              </Link>
            </p>
          </div>
        </section>

        {/* About the Project Section */}
        <section className="bg-gray-50 p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#AF0000" }}>
            About This Project
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            This e-commerce web application is a full-stack project built using
            the <strong className="font-semibold">MERN stack</strong>, which
            stands for MongoDB, Express.js, React, and Node.js. It serves as a
            comprehensive prototype to demonstrate modern web development
            practices, including robust data fetching, state management, and a
            responsive user interface.
          </p>
        </section>

        {/* AI Chatbot Integration Section */}
        <section className="bg-gray-50 p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#AF0000" }}>
            AI Chatbot Integration
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            A key feature of this project is the integration of a powerful
            AI-powered chatbot. This functionality is built as a separate
            backend microservice using the{" "}
            <strong className="font-semibold">FastAPI</strong> framework in
            Python. The chatbot uses advanced techniques like{" "}
            <strong className="font-semibold">
              Retrieval-Augmented Generation (RAG)
            </strong>{" "}
            to provide accurate and context-aware responses about products and
            company policies. The chatbot also has the ability to use tools from
            a separate{" "}
            <strong className="font-semibold">fast-mcp server</strong>, enabling
            advanced functionality like web scraping with{" "}
            <strong className="font-semibold">Playwright</strong>.
          </p>
        </section>

        {/* Key Technologies Section */}
        <section className="bg-gray-50 p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#AF0000" }}>
            Key Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-[#111B25]">
                Frontend
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong className="font-semibold">Next.js & React:</strong>{" "}
                  For building a modern, performant, and component-based user
                  interface.
                </li>
                <li>
                  <strong className="font-semibold">
                    Shadcn/ui & Tailwind CSS:
                  </strong>{" "}
                  For a beautiful, responsive, and accessible design system.
                </li>
                <li>
                  <strong className="font-semibold">Redux Toolkit:</strong> For
                  efficient and predictable state management.
                </li>
                <li>
                  <strong className="font-semibold">TanStack Query:</strong> For
                  handling server-side data fetching, caching, and
                  synchronization.
                </li>
                <li>
                  <strong className="font-semibold">TanStack Table:</strong> For
                  building powerful and flexible tables.
                </li>
                <li>
                  <strong className="font-semibold">Axios:</strong> For making
                  HTTP requests to the backend API.
                </li>
                <li>
                  <strong className="font-semibold">
                    Server-Sent Events (SSE) & Fetch API:
                  </strong>{" "}
                  For real-time data streaming to the chatbot.
                </li>
                <li>
                  <strong className="font-semibold">Leaflet & Geoapify:</strong>{" "}
                  For location-based services, including interactive maps and
                  address search.
                </li>
                <li>
                  <strong className="font-semibold">Formik & Yup:</strong> For
                  building forms and managing form validation.
                </li>
                <li>
                  <strong className="font-semibold">Lucide-React:</strong> A
                  library for easily integrating icons.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-[#111B25]">
                Backend
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong className="font-semibold">Node.js & Express:</strong>{" "}
                  The foundation for the server-side API.
                </li>
                <li>
                  <strong className="font-semibold">Mongoose & MongoDB:</strong>{" "}
                  For object modeling and interacting with the database.
                </li>
                <li>
                  <strong className="font-semibold">
                    JSON Web Tokens (JWT):
                  </strong>{" "}
                  For secure user authentication and authorization.
                </li>
                <li>
                  <strong className="font-semibold">Bcryptjs:</strong> For
                  hashing and securely storing user passwords.
                </li>
                <li>
                  <strong className="font-semibold">Multer:</strong> A
                  middleware for handling file uploads, such as product images.
                </li>
                <li>
                  <strong className="font-semibold">Socket.io:</strong> For
                  enabling real-time, bidirectional communication between the
                  client and server.
                </li>
                <li>
                  <strong className="font-semibold">
                    FastAPI (Python), LangChain, & LangGraph:
                  </strong>{" "}
                  A dedicated microservice for the AI chatbot.
                </li>
                <li>
                  <strong className="font-semibold">
                    fast-mcp & Playwright:
                  </strong>{" "}
                  Used for tool-enabled functionality, including web scraping.
                </li>
                <li>
                  <strong className="font-semibold">
                    MongoDB Atlas Vector Search:
                  </strong>{" "}
                  For efficient Retrieval-Augmented Generation (RAG).
                </li>
                <li>
                  <strong className="font-semibold">HuggingFace:</strong> For
                  text-to-vector embedding model and LLM.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default AboutPage;
