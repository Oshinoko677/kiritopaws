import Link from "next/link";
import ContactOwner from "../../components/ContactOwner";
import SafeImage from "../../components/SafeImage";
import { PET_EMOJI } from "../../lib/constants";
import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function PetDetail({ params }) {
  const { id } = await params;
  const { data: pet } = await supabase.from("pets").select("*").eq("id", id).single();

  if (!pet) {
    return (
      <main className="max-w-3xl mx-auto px-4 mt-8 text-black">
        Pet not found. <Link href="/adopt" className="text-purple-700 underline">Back to pets</Link>
      </main>
    );
  }

  const row = "mt-2 text-black";

  return (
    <main className="max-w-4xl mx-auto px-4 mt-4">
      <Link href="/adopt" className="text-sm text-purple-700">← Back to pets</Link>
      <div className="mt-3 bg-white rounded-2xl overflow-hidden grid md:grid-cols-2">
        <SafeImage
          src={pet.image_url}
          alt={pet.name}
          className="w-full h-72 md:h-full"
          emoji={PET_EMOJI[pet.type] || "🐾"}
        />
        <div className="p-5 md:p-6 text-black">
          <h1 className="text-2xl font-bold">{pet.name}</h1>
          {pet.adopted && (
            <p className="inline-block mt-1 bg-purple-100 text-purple-900 rounded-full px-3 py-0.5 text-sm">
              Found a home 🎉
            </p>
          )}
          <p className="text-gray-500 mt-1">{pet.type} · {pet.age} · {pet.gender}</p>
          <p className={row}>📍 {pet.location}</p>
          <p className={row}><b>Health:</b> {pet.health || "Not shared"}</p>
          <p className={row}>{pet.story}</p>
          <p className="mt-3 text-sm text-gray-500">Posted by {pet.owner_name} (pet owner)</p>
          {!pet.adopted && <ContactOwner petId={pet.id} />}
        </div>
      </div>
    </main>
  );
}
