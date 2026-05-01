import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeClassProvider } from "@/components/ThemeClassProvider";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "Weather App";
const siteDescription =
  "Search any city for current conditions, an hourly outlook, and a 7-day forecast—on a live weather-driven sky. Light and dark mode; Fahrenheit or Celsius.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteTitle,
    template: `%s · ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeClassProvider>{children}</ThemeClassProvider>
      </body>
    </html>
  );
}
