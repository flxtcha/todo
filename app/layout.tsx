import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner"
import { ModeToggle } from "@/components/ui/ModeToggle";
import { ReactQueryClientProvider } from "./ReactQueryClientProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Todo",
  description: "A Todo application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ReactQueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >{children}
            <Toaster />
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <ModeToggle />
            </div>
          </ThemeProvider>
          </ReactQueryClientProvider>
        </body>
    </html>
  );
};