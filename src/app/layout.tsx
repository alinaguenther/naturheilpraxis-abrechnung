import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Naturheilpraxis",
    template: "%s | Naturheilpraxis",
  },
  description: "Naturheilpraxis - Patientenverwaltung und Terminplanung",
  keywords: ["Naturheilpraxis", "Patientenverwaltung", "Terminplanung", "Heilpraktiker"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}
