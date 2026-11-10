import type { Metadata } from "next";
import "@fontsource/besley/400.css";
import "@fontsource/besley/400-italic.css";
import "@fontsource/besley/700.css";
import "@fontsource/besley/900.css";
import "@fontsource/caveat/500.css";
import "@fontsource/caveat/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boyfriend Application — Form EL-26",
  description:
    "She said she's taking boyfriend applications. A fan-made, jokingly serious application office. Little boys need not apply.",
  openGraph: {
    title: "Now Accepting Boyfriend Applications",
    description: "Form EL-26. Must be a man, not a little boy. Fan-made parody.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/madrigale.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
