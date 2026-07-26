import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/cart";
import { AuthProvider } from "@/context/auth";
import { AdminProvider } from "@/context/admin";
import { FeedbackProvider } from "@/context/feedback";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Odomite Rentals — Chairs, Tables & Tent Rentals in New Jersey",
  description:
    "Family-owned event rentals across Newark, Elizabeth, Jersey City and greater New Jersey. Transparent per-day pricing on chairs, tables, tents, linens and equipment — delivered, set up and sanitized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-sans text-ink antialiased">
        <FeedbackProvider>
          <AuthProvider>
            <AdminProvider>
              <CartProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </CartProvider>
            </AdminProvider>
          </AuthProvider>
        </FeedbackProvider>
      </body>
    </html>
  );
}
