import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Rally Ranch Pickleball | Book Your Court",
  description:
    "Book your pickleball court at Rally Ranch. Open daily 4 PM – 11 PM, extended until 12 AM on Thu–Sat. Easy online reservation with GCash payment.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rally Ranch",
  },
  openGraph: {
    title: "Rally Ranch Pickleball",
    description: "Book your court online. Starting at ₱150/session.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}
