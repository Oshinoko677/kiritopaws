import Link from "next/link";
import { supabase } from "./lib/supabase";
import { CATEGORIES } from "./lib/constants";
import ProductCard from "./components/ProductCard";
import PetCard from "./components/PetCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("sold", { ascending: false })
    .limit(8);
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("adopted", false)
    .order("created_at", { ascending: false })
    .limit(4);

  const list = products || [];
  const petList = pets || [];

  return (
    <main className="max-w-6xl mx-auto px-4 mt-4">
      <div className="flex gap-4">
        <aside className="hidden md:block w-48 bg-white rounded-2xl p-4 h-fit">
          <h2 className="font-semibold mb-2 text-black">Categories</h2>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={"/products?category=" + c}
              className="block py-1.5 text-sm text-black hover:text-purple-700"
            >
              {c}
            </Link>
          ))}
          <Link href="/adopt" className="block py-1.5 text-sm text-purple-700 font-medium">
            Adopt a pet
          </Link>
        </aside>

        <section className="flex-1 min-h-48 md:min-h-72 rounded-2xl bg-gradient-to-r from-purple-200 to-purple-300 flex flex-col items-center justify-center text-center text-purple-900 p-6">
          <h1 className="text-3xl md:text-5xl font-extrabold">Everything your pet needs 🐾</h1>
          <p className="mt-2">Shop food, toys and care. Or help a pet find a home.</p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Link href="/products" className="bg-purple-700 text-white font-semibold px-6 py-2 rounded-full">
              Shop now
            </Link>
            <Link href="/adopt" className="bg-white text-purple-700 font-semibold px-6 py-2 rounded-full">
              Adopt a pet
            </Link>
          </div>
        </section>
      </div>

      <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={"/products?category=" + c}
            className="bg-white text-purple-900 rounded-full px-4 py-1.5 text-sm whitespace-nowrap"
          >
            {c}
          </Link>
        ))}
      </div>

      <section className="mt-6 bg-white rounded-2xl p-4">
        <div className="flex justify-between items-center border-b border-purple-100 pb-2 mb-3">
          <h2 className="text-lg font-bold text-purple-700">⚡ Flash Sale</h2>
          <Link href="/products" className="text-sm border border-purple-700 text-purple-700 px-3 py-1 rounded-full">
            Shop all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {list.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-gray-500 text-sm">No products yet. Run the products part of supabase.sql.</p>
        )}
      </section>

      <section className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-black">Pets looking for a home</h2>
          <Link href="/adopt" className="text-sm text-purple-700">See all</Link>
        </div>
        {petList.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No pets posted yet. <Link href="/adopt/new" className="text-purple-700 underline">Post the first one</Link>.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {petList.map((p) => (
              <PetCard key={p.id} pet={p} />
            ))}
          </div>
        )}
      </section>

      <h2 className="mt-8 mb-3 text-lg font-bold text-black">Just for you</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
