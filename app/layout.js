import "./globals.css";
import Providers from "./providers";
import Header from "./components/Header";

export const metadata = {
  title: "KiritoPaws - Pet supplies and adoption",
  description: "Shop pet supplies and help pets find a loving home.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <div className="flex-1 pb-10">{children}</div>
          <footer className="bg-purple-100 text-purple-900 text-center text-sm p-6">
            © 2026 KiritoPaws 🐾 Shop for your pet. Help a pet find a home.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
