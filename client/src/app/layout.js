import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/reduxProvider";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "@/components/QueryProvider";
import NotificationSocket from "@/lib/NotificationSocket";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Commodity",
  description: "E-commerce demo",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto", // CSS variable name for Tailwind
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body className={inter.className}>
        <ReduxProvider>
          <NotificationSocket />
          <QueryProvider>{children}</QueryProvider>
        </ReduxProvider>
        <Toaster richColors />
        {/* Using React-toastify for real time notification toast as two Toasters with ids from sonner isn't working */}
        <ToastContainer position="top-center" autoClose={5000} />
      </body>
    </html>
  );
}
