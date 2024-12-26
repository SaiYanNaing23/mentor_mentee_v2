'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster, toast } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          {children}
        </div>
        <Toaster 
          richColors 
          position="top-center"
          toastOptions={{
            style: {
              fontSize: '18px',
              padding: '12px 20px',
            }
          }} 
        />
      </body>
    </html>
  );
}
