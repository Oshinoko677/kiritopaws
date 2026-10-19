import Link from "next/link";
import { pets } from "../data/pets";

export default function Adopt() {
  return (
    <main className="max-w-6xl mx-auto px-4 mt-6">
      <h1 className="text-2xl font-bold text-black">Pets looking for a home 🐾</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {pets.map((p) => (
          <Link key={p.id} href={"/adopt/" + p.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg">
            <div className="h-40 bg-gray-100 flex items-center justify-center text-5xl">
              {p.type === "Dog" ? "🐶" : "🐱"}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-black">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.type} · {p.age} · {p.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}