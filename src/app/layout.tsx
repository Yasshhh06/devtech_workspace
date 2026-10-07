import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "DevTech Workspace",
  description: "Official DevTech IT Solution Enterprise Workspace Platform - Projects, Attendance, Calendar, Standups & Team Group.",
};

import FirebaseSyncInitializer from "@/components/FirebaseSyncInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.className}>
      <body className="antialiased">
        <FirebaseSyncInitializer />
        {children}
      </body>
    </html>
  );
}
