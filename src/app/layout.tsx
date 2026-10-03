import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UIC Studio — Digital Identity & Aerospace NFC Experiences",
  description: "Unique Identity Creation: Bespoke portfolio platforms, aerospace composite NFC business cards, and digital flagships engineered for modern leaders.",
  icons: {
    icon: "/logo.png",
  },
};

const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('uic-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var activeTheme = (stored === 'light' || stored === 'dark') ? stored : (prefersDark ? 'dark' : 'light');
      
      var root = document.documentElement;
      if (activeTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
