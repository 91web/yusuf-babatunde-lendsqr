
//import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.scss";
import Icon from "../assests/svg/log-ico.svg"

//const geistSans = Geist({
  //variable: "--font-geist-sans",
  //subsets: ["latin"],
//});

//const geistMono = Geist_Mono({
  //variable: "--font-geist-mono",
  //subsets: ["latin"],
//});
export const metadata = {
  title: "Lendsqr",
  description:
    "Modern Digital Lending Platform | Streamlined Loan Management & Financial Solutions",
  icons: {
    icon: {
      url: Icon.src,
      type: "image/svg+xml",
    },
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning
      //    className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
