import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeWrapper from "@/providers/ThemeWrapper";
import SessionProviders from "@/providers/SessionProviders";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Precision Navigator CRM",
  description: "Advanced Automotive Intelligence Platform",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviders session={session}>
          <ThemeWrapper>{children}</ThemeWrapper>
        </SessionProviders>
        <GoogleAnalytics gaId="G-5ZN5XR28VX" />
      </body>
    </html>
  );
}
