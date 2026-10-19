"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NewPet() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [f, setF] = useState({
    name: "", type: "Dog", age: "", gender: "", location: "",
    health: "", story: "", contact: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit() {
    setMsg("Posting...");
    let image_url = null;
    if (file) {
      const path = Date.now() + "-" + file.name.replace(/\s/g, "_");
      const up = await supabase.storage.from("pet-photos").upload(path, file);
      if (up.error) return setMsg(up.error.message);
      image_url = supabase.storage.from("pet-photos").getPublicUrl(path).data.publicUrl;
    }
    const { contact, ...petData } = f;
    const ins = await supabase
      .from("pets")
      .insert({ ...petData, image_url, owner_name: user.user_metadata.owner_name })
      .select()
      .single();
    if (ins.error) return setMsg(ins.error.message);
    const c = await supabase.from("pet_contacts").insert({ pet_id: ins.data.id, contact });
    if (c.error) return setMsg(c.error.message);
    router.push("/adopt/" + ins.data.id);
  }

  const box = "w-full border border-gray-300 rounded px-3 py-2 text-black mb-3";

  if (!user)
    return (
      <main className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg">
        <p className="text-black">Please <a href="/login" className="text-purple-700 underline">login</a> to post a pet.</p>
      </main>
    );

  return (
    <main className="max-w-md mx-auto mt-6 bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-bold text-black mb-4">Post a pet 🐾</h1>
      <input className={box} placeholder="Pet name" value={f.name} onChange={set("name")} />
      <select className={box} value={f.type} onChange={set("type")}>
        <option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option>
      </select>
      <input className={box} placeholder="Age (e.g. 2 years)" value={f.age} onChange={set("age")} />
      <input className={box} placeholder="Gender" value={f.gender} onChange={set("gender")} />
      <input className={box} placeholder="Location" value={f.location} onChange={set("location")} />
      <input className={box} placeholder="Health (vaccinated, injuries...)" value={f.health} onChange={set("health")} />
      <textarea className={box} rows={4} placeholder="Story / why rehoming / behaviour" value={f.story} onChange={set("story")} />
      <input className={box} placeholder="Contact (phone or email)" value={f.contact} onChange={set("contact")} />
      <input className={box} type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={submit} className="w-full bg-purple-700 text-white py-2 rounded">Post pet</button>
      {msg && <p className="mt-3 text-sm text-black">{msg}</p>}
    </main>
  );
}