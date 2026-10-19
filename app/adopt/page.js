import Link from "next/link";
import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Adopt() {
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-4 mt-6">
      <h1 className="text-2xl font-bold text-black">Pets looking for a home 🐾</h1>
      {(!pets || pets.length === 0) && <p className="mt-4 text-gray-500">No pets posted yet.</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {(pets || []).map((p) => (
          <Link key={p.id} href={"/adopt/" + p.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 bg-gray-100 flex items-center justify-center text-5xl">🐾</div>
            )}
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