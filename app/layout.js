import "./globals.css";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { StoreProvider } from "@/components/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Announcement from "@/components/Announcement";
import SiteChrome from "@/components/SiteChrome";
import { getContent } from "@/lib/data";

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

export default async function RootLayout({ children }) {
  const content = await getContent();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="overflow-x-hidden font-sans antialiased">
        <StoreProvider>
          <SiteChrome
            announcement={
              content.announcement.enabled ? (
                <Announcement text={content.announcement.text} href={content.announcement.href} />
              ) : null
            }
            nav={<Nav />}
            footer={<Footer content={content.footer} />}
          >
            {children}
          </SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
