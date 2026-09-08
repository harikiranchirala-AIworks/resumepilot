import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OfferCraft AI — Craft Your Next Career Move",
  description:
    "Grounded AI career workspace for résumé–JD alignment, evidence-based tailoring, interview preparation, and application tracking.",
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
