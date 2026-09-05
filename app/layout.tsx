import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { PWAProvider } from "@/components/pwa/pwa-provider";

export const metadata: Metadata = {
  title: {
    default: "RPLTwoFess — Satu Kelas. Banyak Cerita.",
    template: "%s | RPLTwoFess",
  },
  description:
    "Platform pesan anonim personal dari kelas XI RPL 2. Sampaikan pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu sampaikan kepada seseorang secara rahasia.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/brand/rpl-logo.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RPLTwoFess",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rpl2fess.vercel.app"
  ),
  openGraph: {
    title: "RPLTwoFess — Satu Kelas. Banyak Cerita.",
    description:
      "Kirim pesan anonim kepada seseorang secara personal. 100% rahasia, tanpa perlu login.",
    siteName: "RPLTwoFess",
    type: "website",
    images: [
      {
        url: "/images/brand/rpl-logo.png",
        width: 1200,
        height: 1200,
        alt: "RPL Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RPLTwoFess — Satu Kelas. Banyak Cerita.",
    description:
      "Kirim pesan anonim kepada seseorang secara personal. 100% rahasia, tanpa perlu login.",
    images: ["/images/brand/rpl-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#08090B" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("rpl-theme");if(t==="light"){document.documentElement.classList.remove("dark");document.documentElement.classList.add("light");document.documentElement.setAttribute("data-theme","light");document.documentElement.style.colorScheme="light";}else{document.documentElement.classList.remove("light");document.documentElement.classList.add("dark");document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-150">
        <ThemeProvider>
          <ToastProvider>
            <PWAProvider>
              <ServiceWorkerRegister />
              {children}
            </PWAProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
