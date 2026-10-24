import Link from "next/link";
import { supabase } from "../lib/supabase";
import { PET_TYPES } from "../lib/constants";
import PetCard from "../components/PetCard";

export const dynamic = "force-dynamic";

export default async function Adopt({ searchParams }) {
  const sp = await searchParams;
  const type = sp.type || "";

  let query = supabase
    .from("pets")
    .select("*")
    .eq("adopted", false)
    .order("created_at", { ascending: false });
  if (type) query = query.eq("type", type);
  const { data } = await query;
  const pets = data || [];

  const chip = "rounded-full px-4 py-1.5 text-sm whitespace-nowrap ";

  return (
    <main className="max-w-6xl mx-auto px-4 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-black">Pets looking for a home 🐾</h1>
        <Link href="/adopt/new" className="bg-purple-700 text-white px-5 py-2 rounded-full text-sm">
          Post a pet
        </Link>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <Link href="/adopt" className={chip + (!type ? "bg-purple-700 text-white" : "bg-white text-purple-900")}>
          All
        </Link>
        {PET_TYPES.map((t) => (
          <Link
            key={t}
            href={"/adopt?type=" + t}
            className={chip + (type === t ? "bg-purple-700 text-white" : "bg-white text-purple-900")}
          >
            {t}
          </Link>
        ))}
      </div>
      {pets.length === 0 ? (
        <p className="mt-6 text-gray-500">No pets here yet. Be the first to post one.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {pets.map((p) => (
            <PetCard key={p.id} pet={p} />
          ))}
        </div>
      )}
    </main>
  );
}
