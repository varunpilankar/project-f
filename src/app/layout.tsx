import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const geistSans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900", });
const geistMono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900", });
export const metadata: Metadata = { title: "LittleSprouts", description: "E-Commerce for Newborns and Toddlers", };
export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head><link rel="stylesheet" href="/design/design-system.css" /></head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
