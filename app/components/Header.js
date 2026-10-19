import Link from "next/link";

const tabs = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Adopt", href: "/adopt" },
  { label: "Post a Pet", href: "/adopt/new" },
];

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-2xl font-extrabold text-purple-700">
          KiritoPaws 🐾
        </Link>
        <input
          placeholder="Search in KiritoPaws"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-black outline-none"
        />
        <Link href="/login" className="bg-purple-700 text-white px-4 py-2 rounded-full text-sm">
          Login
        </Link>
      </div>
      <nav className="bg-purple-700">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-4 py-2 text-sm text-white hover:bg-purple-900 whitespace-nowrap"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}