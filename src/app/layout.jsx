import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProviderWrapper from './ReduxProviderWrapper'; 
import Navbar from "./navbar/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lee Tattoozzz",
  description: "Lee Tattoozzz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProviderWrapper>
          <Navbar />
          <main>{children}</main>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}
