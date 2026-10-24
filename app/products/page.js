import Link from "next/link";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../lib/constants";
import ProductCard from "../components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Products({ searchParams }) {
  const sp = await searchParams;
  const category = sp.category || "";
  const q = (sp.q || "").trim();

  let query = supabase.from("products").select("*").order("id");
  if (category) query = query.eq("category", category);
  if (q) query = query.ilike("name", "%" + q + "%");
  const { data } = await query;
  const products = data || [];

  const chip = "rounded-full px-4 py-1.5 text-sm whitespace-nowrap ";

  return (
    <main className="max-w-6xl mx-auto px-4 mt-4">
      <h1 className="text-2xl font-bold text-black">
        {q ? 'Results for "' + q + '"' : category ? category : "All products"}
      </h1>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <Link href="/products" className={chip + (!category ? "bg-purple-700 text-white" : "bg-white text-purple-900")}>
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={"/products?category=" + c}
            className={chip + (category === c ? "bg-purple-700 text-white" : "bg-white text-purple-900")}
          >
            {c}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-6 text-gray-500">Nothing found. Try another search or category.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
