"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    let result;
    if (mode === "signup") {
      result = await supabase.auth.signUp({
        email,
        password,
        options: { data: { owner_name: ownerName } },
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    if (result.error) {
      setMsg(result.error.message);
      return;
    }
    if (!result.data.session) {
      setMsg("Check your email to confirm, then log in.");
      return;
    }
    router.push("/adopt");
  }

  const box = "w-full border border-gray-300 rounded px-3 py-2 text-black mb-3";

  return (
    <main className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-bold text-black mb-4">
        {mode === "login" ? "Login" : "Create account"}
      </h1>
      {mode === "signup" && (
        <input className={box} placeholder="Your pet's name (you will show as its owner)" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
      )}
      <input className={box} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className={box} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={submit} className="w-full bg-purple-700 text-white py-2 rounded">
        {mode === "login" ? "Login" : "Sign up"}
      </button>
      {msg && <p className="mt-3 text-sm text-black">{msg}</p>}
      <p
        className="mt-4 text-sm text-purple-700 cursor-pointer"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "New here? Create an account" : "Have an account? Login"}
      </p>
    </main>
  );
}