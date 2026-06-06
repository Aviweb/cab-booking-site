import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CabInsta - Premium Cab Booking Service",
  description: "Book premium cabs instantly with CabInsta. Safe, reliable, and comfortable transportation with professional drivers across India. 24/7 service available.",
  keywords: "cab booking, taxi service, ride sharing, airport transfer, car rental, India taxi",
  authors: [{ name: "CabInsta Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-secondary-900 h-full text-secondary-900 dark:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
