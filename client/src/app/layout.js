import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/reduxProvider";

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
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
