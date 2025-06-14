import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import  Header from '@/components/navbar'
import SideBar from "@/components/navbar";
import Footer from "@/components/footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="display-flex flex-col min-h-screen items-center justify-center bg-white text-gray-900 antialiased">
          <Header />
          <div className="flex min-h-screen">
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {children}
            </div>
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
} 
