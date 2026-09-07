import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OfferCraft AI — Craft Your Next Career Move",
  description:
    "Next-gen AI career intelligence suite: tailor resumes with ATS scoring, generate high-impact cover letters, master interview prep, and track applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
