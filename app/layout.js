import "./globals.css";
import Header from "./components/Header";

export const metadata = {
title: "KiritoPaws",
description: "Pet supplies and pet adoption",
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<body className="bg-gray-100 text-black">
<Header />
{children}
<footer className="mt-10 bg-purple-900 text-white text-center text-sm p-6">
© 2026 KiritoPaws. All rights reserved.
</footer>
</body>
</html>
);
}