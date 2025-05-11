import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "ReeliciousAi",
    template: "%s | ReeliciousAi"
  },
  description: "Ai content creation platform",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
