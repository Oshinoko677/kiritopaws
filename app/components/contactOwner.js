"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ContactOwner({ petId }) {
  const [contact, setContact] = useState(null);
  const [msg, setMsg] = useState("");

  async function show() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return setMsg("Please login to see the owner's contact.");
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
        <p className="bg-gray-100 p-3 rounded font-semibold">Contact owner: {contact}</p>
      ) : (
        <button onClick={show} className="bg-purple-700 text-white px-5 py-2 rounded">
          Contact owner
        </button>
      )}
      {msg && (
        <p className="mt-2 text-sm">
          {msg} <a href="/login" className="text-purple-700 underline">Login</a>
        </p>
      )}
    </div>
  );
}