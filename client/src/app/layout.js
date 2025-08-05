import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/reduxProvider";
import { Toaster } from "sonner";
import QueryProvider from "@/components/QueryProvider";

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
          <QueryProvider>{children}</QueryProvider>
        </ReduxProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
