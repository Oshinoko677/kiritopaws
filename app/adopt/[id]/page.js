import { supabase } from "../../lib/supabase";
import ContactOwner from "../../components/ContactOwner";

export const dynamic = "force-dynamic";

export default async function PetDetail({ params }) {
  const { id } = await params;
  const { data: pet } = await supabase.from("pets").select("*").eq("id", id).single();
  if (!pet) return <main className="p-6 text-black">Pet not found.</main>;

  return (
    <main className="max-w-3xl mx-auto mt-6 bg-white rounded-lg shadow overflow-hidden">
      {pet.image_url ? (
        <img src={pet.image_url} alt={pet.name} className="w-full max-h-96 object-cover" />
      ) : (
        <div className="h-60 bg-gray-100 flex items-center justify-center text-7xl">🐾</div>
      )}
      <div className="p-6 text-black">
        <h1 className="text-2xl font-bold">{pet.name}</h1>
        <p className="text-gray-500">{pet.type} · {pet.age} · {pet.gender} · {pet.location}</p>
        <p className="mt-3"><b>Health:</b> {pet.health}</p>
        <p className="mt-3">{pet.story}</p>
        <p className="mt-3 text-sm text-gray-500">Posted by {pet.owner_name} (owner)</p>
        <ContactOwner petId={pet.id} />
      </div>
    </main>
  );
}