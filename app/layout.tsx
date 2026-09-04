import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RPLTwoFess — Satu Kelas. Banyak Cerita.",
    template: "%s | RPLTwoFess",
  },
  description:
    "Platform pesan dan confession anonim resmi kelas RPL/PPLG 2. Sampaikan pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu katakan tanpa perlu mencantumkan nama.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rpltwofess.web.id"
  ),
  openGraph: {
    title: "RPLTwoFess — Satu Kelas. Banyak Cerita.",
    description:
      "Kirim pesan anonim ke kelas RPL/PPLG 2. 100% rahasia, tanpa perlu login.",
    siteName: "RPLTwoFess",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RPLTwoFess — Satu Kelas. Banyak Cerita.",
    description:
      "Kirim pesan anonim ke kelas RPL/PPLG 2. 100% rahasia, tanpa perlu login.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F6F3EA] text-[#111111]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
