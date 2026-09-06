import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tailor Resume — JD-Optimized LaTeX Resumes",
  description:
    "Tailor your resume to any job description with ATS scoring and LaTeX output.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
