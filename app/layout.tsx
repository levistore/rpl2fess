import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: {
    default: "RPLTwoFess — Satu Kelas. Banyak Cerita.",
    template: "%s | RPLTwoFess",
  },
  description:
    "Platform pesan dan confession anonim resmi kelas RPL/PPLG 2. Sampaikan pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu katakan tanpa perlu mencantumkan nama.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rpl2fess.vercel.app"
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
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@400..700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#08090B] text-[#F5F5F2] selection:bg-[#3D5CFF] selection:text-white font-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
