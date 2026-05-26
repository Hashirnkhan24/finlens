import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinLens | Financial Intelligence Platform",
  description: "India-first financial intelligence and revenue assurance platform."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
