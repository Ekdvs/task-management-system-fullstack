import type { Metadata } from "next";
import {
  Space_Grotesk,
  Inter,
  IBM_Plex_Mono,
} from "next/font/google";

import "./globals.css";
import Providers from "../components/Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Tasks | Koncepthive",
  description: "A simple, focused task management system.",
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
    >
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} antialiased`}
      >
        <Providers>
          {children}
          
        </Providers>
      </body>
    </html>
  );
}