import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthSessionProvider } from "@/providers/session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Wakr - Smart Wake-up Calls",
  description: "Start your day right with personalized wake-up calls and habit tracking",
  keywords: ["wake-up", "habits", "productivity", "morning routine", "calls"],
  authors: [{ name: "Wakr Team" }],
  creator: "Wakr",
  publisher: "Wakr",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wakr.app"),
  openGraph: {
    title: "Wakr - Smart Wake-up Calls",
    description: "Start your day right with personalized wake-up calls and habit tracking",
    url: "https://wakr.app",
    siteName: "Wakr",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wakr - Smart Wake-up Calls",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wakr - Smart Wake-up Calls",
    description: "Start your day right with personalized wake-up calls and habit tracking",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
