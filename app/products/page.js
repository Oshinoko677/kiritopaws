import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Products() {
  return (
    <main className="max-w-6xl mx-auto px-4 mt-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
