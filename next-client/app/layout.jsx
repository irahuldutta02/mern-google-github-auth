// ./app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css"; // Import Tailwind CSS
import { AuthProvider } from "../contexts/AuthContext"; // Adjust path
import Navbar from "../components/Navbar"; // Adjust path

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next Auth App",
  description: "Fullstack authentication with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* Wrap content with AuthProvider */}
          <Navbar /> {/* Include Navbar here for consistent layout */}
          <main>{children}</main> {/* Page content renders here */}
        </AuthProvider>
      </body>
    </html>
  );
}
