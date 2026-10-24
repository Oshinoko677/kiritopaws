"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setMsg("");
    if (!email || !password) return setMsg("Enter your email and password.");
    if (mode === "signup" && !ownerName.trim()) return setMsg("Enter a display name.");
    setBusy(true);
    let result;
    if (mode === "signup") {
      result = await supabase.auth.signUp({
        email,
        password,
        options: { data: { owner_name: ownerName.trim() } },
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    setBusy(false);
    if (result.error) return setMsg(result.error.message);
    if (!result.data.session) {
      return setMsg("Account created. Check your email to confirm, then login.");
    }
    router.push("/");
  }

  const box = "w-full border border-purple-200 rounded-xl px-3 py-2 text-black mb-3 bg-purple-50 outline-none focus:border-purple-400";

  return (
    <main className="max-w-sm mx-auto mt-10 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-black mb-4">
          {mode === "login" ? "Login" : "Create your account"}
        </h1>
        {mode === "signup" && (
          <input
            className={box}
            placeholder="Display name (for example your pet's name)"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        )}
        <input className={box} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className={box}
          type="password"
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={submit}
          disabled={busy}
          className="w-full bg-purple-700 text-white py-2.5 rounded-full font-medium disabled:opacity-60"
        >
          {busy ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
        </button>
        {msg && <p className="mt-3 text-sm text-black">{msg}</p>}
        <p
          className="mt-4 text-sm text-purple-700 cursor-pointer"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "New here? Create an account" : "Have an account? Login"}
        </p>
      </div>
    </main>
  );
}
