import type { Metadata } from "next";
import Script from "next/script";
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
    default: "Compare International Money Transfer Rates & Fees | PagoSync",
    template: "%s | PagoSync",
  },
  description:
    "Compare international money transfer exchange rates, fees, delivery times and recipient amounts across providers such as Wise, Remitly and Western Union.",

  openGraph: {
    type: "website",
    url: "https://www.pagosync.com",
    siteName: "PagoSync",
    title: "Compare International Money Transfer Rates & Fees | PagoSync",
    description:
      "Compare international money transfer exchange rates, fees, delivery times and recipient amounts across providers such as Wise, Remitly and Western Union.",
  },

  twitter: {
    card: "summary",
    title: "Compare International Money Transfer Rates & Fees | PagoSync",
    description:
      "Compare international money transfer exchange rates, fees, delivery times and recipient amounts across providers such as Wise, Remitly and Western Union.",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J95E8Q7J5D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J95E8Q7J5D');
          `}
        </Script>
      </body>
    </html>
  );
}