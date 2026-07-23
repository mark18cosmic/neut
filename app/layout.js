import "./globals.css";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { StoreProvider } from "@/components/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Neut — Created by us, Curated for you",
  description:
    "Handmade charms, bracelets and necklaces from Malé, Maldives. Created by us, curated for you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <StoreProvider>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
