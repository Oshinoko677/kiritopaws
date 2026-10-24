"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PET_TYPES } from "../../lib/constants";
import { supabase } from "../../lib/supabase";
import { useApp } from "../../providers";

export default function NewPet() {
  const router = useRouter();
  const { user, authReady } = useApp();
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    name: "", type: "Dog", age: "", gender: "", location: "", health: "", story: "", contact: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const box = "w-full border border-purple-200 rounded-xl px-3 py-2 text-black mb-3 bg-purple-50 outline-none focus:border-purple-400";

  if (!authReady) return <main className="p-6 text-black">Loading...</main>;
  if (!user) {
    return (
      <main className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl text-black">
        Please <Link href="/login" className="text-purple-700 underline">login</Link> to post a pet.
      </main>
    );
  }

  async function submit() {
    if (!f.name.trim() || !f.location.trim() || !f.contact.trim()) {
      setMsg("Please fill in the pet name, location and your contact.");
      return;
    }
    setBusy(true);
    setMsg("Posting...");

    let image_url = null;
    if (file) {
      const path = user.id + "/" + Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const up = await supabase.storage.from("pet-photos").upload(path, file);
      if (up.error) {
        setBusy(false);
        return setMsg(up.error.message);
      }
      image_url = supabase.storage.from("pet-photos").getPublicUrl(path).data.publicUrl;
    }

    const { contact, ...petData } = f;
    const ins = await supabase
      .from("pets")
      .insert({ ...petData, image_url, owner_name: (user.user_metadata && user.user_metadata.owner_name) || "A pet owner" })
      .select()
      .single();
    if (ins.error) {
      setBusy(false);
      return setMsg(ins.error.message);
    }

    const c = await supabase.from("pet_contacts").insert({ pet_id: ins.data.id, contact: contact.trim() });
    setBusy(false);
    if (c.error) return setMsg(c.error.message);
    router.push("/adopt/" + ins.data.id);
  }

  return (
    <main className="max-w-md mx-auto mt-6 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-black mb-4">Post a pet 🐾</h1>
        <input className={box} placeholder="Pet name" value={f.name} onChange={set("name")} />
        <select className={box} value={f.type} onChange={set("type")}>
          {PET_TYPES.map((t) => (<option key={t}>{t}</option>))}
        </select>
        <input className={box} placeholder="Age (for example 2 years)" value={f.age} onChange={set("age")} />
        <input className={box} placeholder="Gender" value={f.gender} onChange={set("gender")} />
        <input className={box} placeholder="Location (city or area)" value={f.location} onChange={set("location")} />
        <input className={box} placeholder="Health (vaccinated, injuries...)" value={f.health} onChange={set("health")} />
        <textarea className={box} rows={4} placeholder="Story: where the pet was found or why you are rehoming, and its behaviour" value={f.story} onChange={set("story")} />
        <input className={box} placeholder="Your phone or email (shown to logged-in users only)" value={f.contact} onChange={set("contact")} />
        <label className="block text-sm text-gray-500 mb-1">Photo</label>
        <input className={box} type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button
          onClick={submit}
          disabled={busy}
          className="w-full bg-purple-700 text-white py-2.5 rounded-full font-medium disabled:opacity-60"
        >
          Post pet
        </button>
        {msg && <p className="mt-3 text-sm text-black">{msg}</p>}
      </div>
    </main>
  );
}
