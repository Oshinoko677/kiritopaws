import Link from "next/link";
import AddToCart from "../../components/AddToCart";
import ProductCard from "../../components/ProductCard";
import SafeImage from "../../components/SafeImage";
import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function ProductDetail({ params }) {
  const { id } = await params;
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();

  if (!product) {
    return (
      <main className="max-w-3xl mx-auto px-4 mt-8 text-black">
        Product not found. <Link href="/products" className="text-purple-700 underline">Back to shop</Link>
      </main>
    );
  }

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  const price = Number(product.price);
  const oldPrice = Number(product.old_price || 0);
  const discount = oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

  return (
    <main className="max-w-5xl mx-auto px-4 mt-4">
      <Link href="/products" className="text-sm text-purple-700">← Back to shop</Link>
      <div className="mt-3 bg-white rounded-2xl p-4 md:p-6 grid md:grid-cols-2 gap-6">
        <SafeImage src={product.image_url} alt={product.name} className="w-full h-72 md:h-96 rounded-2xl" fit="contain" />
        <div className="text-black">
          <p className="text-sm text-gray-500">{product.category}</p>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">★ {product.rating} · {product.sold} sold</p>
          <p className="text-3xl font-bold text-purple-700 mt-4">Rs. {price}</p>
          {discount > 0 && (
            <p className="text-sm text-gray-500">
              <span className="line-through">Rs. {oldPrice}</span> -{discount}%
            </p>
          )}
          <p className="mt-4 text-gray-700">{product.description}</p>
          <p className="mt-3 text-sm text-gray-500">
            {product.stock > 0 ? "In stock" : "Out of stock"} · Cash on delivery
          </p>
          {product.stock > 0 && <AddToCart product={product} />}
        </div>
      </div>

      {related && related.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 text-lg font-bold text-black">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
