import type { Metadata } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-geist-sans",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "استاک سیگنال | پلتفرم تحلیل و سیگنال بازار سرمایه",
  description: "پلتفرم حرفه‌ای تحلیل و سیگنال برای بازار سرمایه ایران با هویت بصری پریمیوم و مدرن.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground flex flex-col">{children}</body>
    </html>
  );
}
