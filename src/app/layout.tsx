import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOT EMIN RACE — The Fastest Fingers on Avalanche",
  description:
    "An elite underground typing race built for the fastest minds on Avalanche. Prove your speed. Claim your rank.",
  openGraph: {
    title: "HOT EMIN RACE",
    description: "Human Speed Is The New Alpha. Race on Avalanche.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full bg-black text-gray-200 antialiased overflow-x-hidden">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(5, 10, 26, 0.95)",
              color: "#e0e0e0",
              border: "1px solid rgba(255, 32, 32, 0.5)",
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
