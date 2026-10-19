import Link from "next/link";
import ProductCard from "./components/ProductCard";
import { categories, products } from "./data/products";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 mt-4">
      <div className="flex gap-4">
        <aside className="hidden md:block w-56 bg-white p-3">
          <h2 className="font-semibold mb-2 text-black">Categories</h2>
          {categories.map((c) => (
            <Link
              key={c}
              href="/products"
              className="block py-1.5 text-sm text-black hover:text-purple-700"
            >
              {c}
            </Link>
          ))}
        </aside>
        <section className="flex-1 h-52 md:h-72 rounded bg-gradient-to-r from-purple-700 to-purple-400 flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold">Big Pet Sale 🐾</h1>
          <p className="mt-2">Up to 40% off on pet supplies</p>
          <Link href="/products" className="mt-4 bg-white text-purple-700 font-semibold px-6 py-2 rounded">
            Shop now
          </Link>
        </section>
      </div>

      <section className="mt-6 bg-white p-3">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold text-purple-700">⚡ Flash Sale</h2>
          <Link href="/products" className="text-sm border border-purple-700 text-purple-700 px-3 py-1 rounded">
            SHOP ALL
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <h2 className="mt-6 mb-3 text-lg font-bold text-black">Just For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}