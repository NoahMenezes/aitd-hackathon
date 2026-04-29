import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinPilot | AI Financial Copilot",
  description: "Secure, real-time financial simulation and insights powered by the Account Aggregator framework.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col relative bg-white transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <LanguageProvider>
            {/* Global Background Image */}
            <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat brightness-[1.02]"
                style={{ backgroundImage: "url('/bluish.jpg')" }}
              />
              {/* Subtle overlay to ensure readability */}
              <div className="absolute inset-0 bg-white/5" />
            </div>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
