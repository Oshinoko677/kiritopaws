import Link from "next/link";

export default function ProductCard({ product }) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  return (
    <Link
      href={"/products/" + product.id}
      className="bg-white hover:shadow-lg transition"
    >
      <div className="h-40 flex items-center justify-center bg-gray-100 text-5xl">
        🐾
      </div>
      <div className="p-2">
        <h3 className="text-sm text-black line-clamp-2">{product.name}</h3>
        <p className="text-lg font-bold text-purple-700">Rs. {product.price}</p>
        <p className="text-xs text-gray-500">
          <span className="line-through">Rs. {product.oldPrice}</span> -{discount}%
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ★ {product.rating} ({product.sold})
        </p>
      </div>
    </Link>
  );
}
