import { Geist, Geist_Mono,Inter,Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({subsets:['latin']})
const spaceGrotesk = Space_Grotesk({subsets:['latin'],weight:['300','400','500','600','700']})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PriceWise",
  description: "Track product prices effortlessly and save money on your shopping",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <main className="max-w-10xl mx-auto">
            <Navbar/>
        {children}
          </main>
      </body>
    </html>
  );
}
