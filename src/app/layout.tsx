import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Math Stories",
  description:
    "Interactive Grade 4 math education through personalized stories powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
