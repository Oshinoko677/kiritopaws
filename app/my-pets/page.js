"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "../providers";
import { supabase } from "../lib/supabase";
import SafeImage from "../components/SafeImage";
import { PET_EMOJI } from "../lib/constants";

export default function MyPets() {
  const { user, authReady } = useApp();
  const [pets, setPets] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setPets(data || []);
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function markAdopted(id) {
    const { error } = await supabase.from("pets").update({ adopted: true }).eq("id", id);
    if (error) return setMsg(error.message);
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this post?")) return;
    const { error } = await supabase.from("pets").delete().eq("id", id);
    if (error) return setMsg(error.message);
    load();
  }

  if (!authReady) return <main className="p-6 text-black">Loading...</main>;
  if (!user) {
    return (
      <main className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl text-black">
        Please <Link href="/login" className="text-purple-700 underline">login</Link> to manage your pets.
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 mt-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-black">My pet posts</h1>
        <Link href="/adopt/new" className="bg-purple-700 text-white px-5 py-2 rounded-full text-sm">Post a pet</Link>
      </div>
      {msg && <p className="mt-2 text-sm text-black">{msg}</p>}
      {pets === null && <p className="mt-4 text-gray-500">Loading...</p>}
      {pets && pets.length === 0 && <p className="mt-4 text-gray-500">You have not posted any pets yet.</p>}
      <div className="mt-4 space-y-3">
        {(pets || []).map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-3 flex gap-3 items-center">
            <SafeImage src={p.image_url} alt={p.name} className="w-20 h-20 rounded-xl shrink-0" emoji={PET_EMOJI[p.type] || "🐾"} />
            <div className="flex-1 min-w-0 text-black">
              <Link href={"/adopt/" + p.id} className="font-semibold">{p.name}</Link>
              <p className="text-sm text-gray-500">{p.type} · {p.location}</p>
              <p className="text-sm">{p.adopted ? "Found a home 🎉" : "Looking for a home"}</p>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              {!p.adopted && (
                <button onClick={() => markAdopted(p.id)} className="bg-purple-100 text-purple-900 rounded-full px-3 py-1">
                  Mark adopted
                </button>
              )}
              <button onClick={() => remove(p.id)} className="text-gray-500 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
