"use client";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "../providers";
import { supabase } from "../lib/supabase";

export default function ContactOwner({ petId }) {
  const { user } = useApp();
  const [contact, setContact] = useState(null);
  const [msg, setMsg] = useState("");

  async function show() {
    if (!user) return setMsg("login");
    const { data, error } = await supabase
      .from("pet_contacts")
      .select("contact")
      .eq("pet_id", petId)
      .single();
    if (error) return setMsg(error.message);
    setContact(data.contact);
  }

  return (
    <div className="mt-5">
      {contact ? (
        <p className="bg-purple-100 text-purple-900 p-3 rounded-xl font-semibold">Contact the owner: {contact}</p>
      ) : (
        <button onClick={show} className="bg-purple-700 text-white px-6 py-2.5 rounded-full font-medium">
          Contact owner
        </button>
      )}
      {msg === "login" && (
        <p className="mt-2 text-sm text-black">
          Please <Link href="/login" className="text-purple-700 underline">login</Link> to see the owner's contact.
        </p>
      )}
      {msg && msg !== "login" && <p className="mt-2 text-sm text-black">{msg}</p>}
    </div>
  );
}
