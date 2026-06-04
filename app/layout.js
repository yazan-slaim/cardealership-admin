import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeWrapper from "@/providers/ThemeWrapper";
import SessionProviders from "@/providers/SessionProviders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const metadata = {
  title: "MOTIO CRM",
  description: "Advanced Automotive Intelligence Platform",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const messages = await getMessages();
  const isRtl = locale === 'ar';
  const fontClass = isRtl ? cairo.className : inter.className;

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={fontClass}>
        <NextTopLoader color="#0f4098" showSpinner={false} />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProviders session={session}>
            <ThemeWrapper>{children}</ThemeWrapper>
          </SessionProviders>
          <GoogleAnalytics gaId="G-5ZN5XR28VX" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
