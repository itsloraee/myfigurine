"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6"
      >
        <h1 className="text-xl font-bold text-slate-900 mb-1">Connexion</h1>
        <p className="text-sm text-slate-500 mb-6">
          Accède à ton compte MyFigurine
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="text-xs font-medium text-slate-500">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 mb-4 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />

        <label className="text-xs font-medium text-slate-500">
          Mot de passe
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 mb-6 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-sm text-slate-500 text-center mt-4">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-orange-600 hover:underline">
            Inscris-toi
          </Link>
        </p>
      </form>
    </div>
  );
}
