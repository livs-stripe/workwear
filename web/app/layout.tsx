import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workwear Group — Unified B2B Payments Platform",
  description:
    "The leading workwear solutions provider. One platform for government contracts, enterprise invoicing and B2B portal checkout across Hard Yakka, KingGee and NNT.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Semi+Condensed:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
