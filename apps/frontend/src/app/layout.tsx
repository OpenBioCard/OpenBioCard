'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "../i18n/context";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { EncryptionProvider } from "../contexts/EncryptionContext";
import { SecurityProvider } from "../components/SecurityProvider";
import ErrorBoundary from "../components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}
      >
        <ErrorBoundary>
          <SecurityProvider>
            <EncryptionProvider>
              <ThemeProvider>
                <I18nProvider>
                  <AuthProvider>
                    {children}
                  </AuthProvider>
                </I18nProvider>
              </ThemeProvider>
            </EncryptionProvider>
          </SecurityProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
