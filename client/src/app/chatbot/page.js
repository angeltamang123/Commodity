import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import CustomNavbar from "@/components/navbar";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <Chatbot />
      <Footer />
    </div>
  );
}
