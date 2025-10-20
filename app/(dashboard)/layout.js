import { Inter } from "next/font/google";
import "../(site)/globals.css";
import Providers from "../providers";
// import ChatWidget from "./components/ai-chat/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IvyWay - Expert Online Tutoring Platform",
  description:
    "Connect with qualified tutors for personalized learning experiences",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          {/* <ChatWidget /> */}
        </Providers>
      </body>
    </html>
  );
}
