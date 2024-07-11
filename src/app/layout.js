import Head from 'next/head';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '3D Model Viewer',
  description: 'A web application for viewing and customizing 3D models with dynamic texture uploads and real-time rendering using Babylon.js.',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <Head>
        <Script src="./babylon.material.js" defer></Script>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
