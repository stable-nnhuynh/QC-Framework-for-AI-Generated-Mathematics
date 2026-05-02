import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nguyen Ngoc Huynh — QC Framework for AI-Generated Mathematics",
  description:
    "Comprehensive Quality Control Framework for AI-Generated Mathematics. A personal project demonstrating expertise in mathematical content QA, error taxonomy design, and expert audit workflows.",
  keywords: [
    "Mathematics Content Specialist",
    "AI Quality Assurance",
    "LaTeX",
    "Linear Algebra",
    "Error Taxonomy",
    "OpenStax",
    "Portfolio",
  ],
  authors: [{ name: "Nguyen Ngoc Huynh" }],
  openGraph: {
    title: "Nguyen Ngoc Huynh — QC Framework for AI-Generated Mathematics",
    description:
      "Interactive portfolio showcasing AI math content QA: Error Taxonomy, Expert SOP, and Golden Dataset case studies.",
    type: "website",
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
