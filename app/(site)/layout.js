import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import SessionExpiredModal from "@/app/components/SessionExpiredModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IvyWay - Expert Online Tutoring Platform",
  description: "IvyWay - Where Learning Meets Opportunity",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/ico" }, // Replace favicon.ico with logo.png
    ],
    apple: [
      { url: "/favicon.ico" }, // Also use logo.png for Apple devices
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <SessionExpiredModal />
        </Providers>
      </body>
    </html>
  );
}
