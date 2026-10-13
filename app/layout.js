import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FocusFlow - AI Odaklanma Asistanı",
  description: "Görevlerinizi yönetin, odaklanın, AI koçunuzla verimliliğinizi artırın.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
