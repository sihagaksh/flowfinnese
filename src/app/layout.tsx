import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Kodchasan } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/header/header";
const kodchasan = Kodchasan({
  subsets: ['latin'], // Specify the subsets you need
  weight: ['400', '700'], // Choose weights
  variable: '--font-kodchasan', // CSS variable name for Tailwind
});

export const metadata: Metadata = {
  title: "Flow Finesse",
  description: "Split Money With Ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${kodchasan.className} ${kodchasan.variable} antialiased`}
      >
        <ThemeProvider attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
          <Navbar />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
