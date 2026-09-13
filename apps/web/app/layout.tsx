import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pagosync.com"),
  title: {
    default: "PagoSync | Compare Money Transfer Rates & Fees",
    template: "%s | PagoSync",
  },
  description:
    "Compare exchange rates, transfer fees, delivery times, and recipient amounts from international money transfer providers.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.pagosync.com",
    siteName: "PagoSync",
    title: "PagoSync | Compare Money Transfer Rates & Fees",
    description:
      "Compare exchange rates, transfer fees, delivery times, and recipient amounts from international money transfer providers.",
  },
  twitter: {
    card: "summary",
    title: "PagoSync | Compare Money Transfer Rates & Fees",
    description:
      "Compare exchange rates, transfer fees, delivery times, and recipient amounts from international money transfer providers.",
  },
  other: {
    "impact-site-verification": "a5ba1022-6580-4f00-b848-e2a915314844",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  {children}
  <Footer />
</body>
    </html>
  );
}