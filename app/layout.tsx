import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWMS Admin",
  description: "Dashboard administrator Smart Waste Management System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
