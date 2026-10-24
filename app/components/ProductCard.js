import Link from "next/link";
import SafeImage from "./SafeImage";

export default function ProductCard({ product }) {
  const price = Number(product.price);
  const oldPrice = Number(product.old_price || 0);
  const discount = oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

  return (
    <Link
      href={"/products/" + product.id}
      className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition block"
    >
     <SafeImage src={product.image_url} alt={product.name} className="h-44 w-full" fit="contain" />
      <div className="p-3">
        <h3 className="text-base font-medium text-black line-clamp-2 min-h-12">{product.name}</h3>
        <p className="text-lg font-bold text-purple-700">Rs. {price}</p>
        {discount > 0 && (
          <p className="text-xs text-gray-500">
            <span className="line-through">Rs. {oldPrice}</span> -{discount}%
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          ★ {product.rating} ({product.sold} sold)
        </p>
      </div>
    </Link>
  );
}