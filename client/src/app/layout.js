import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/reduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Commodity",
  description: "E-commerce demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
