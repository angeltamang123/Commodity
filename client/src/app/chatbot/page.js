import Chatbot from "@/components/Chatbot";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-xl font-bold">Commodity Chatbot</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <Chatbot />
      </main>
    </div>
  );
}
