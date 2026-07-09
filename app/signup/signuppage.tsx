"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // "nom" est passé en metadata : le trigger handle_new_user
    // (créé côté SQL) l'utilise pour remplir la table profil automatiquement
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Vérifie ta boîte mail
          </h1>
          <p className="text-sm text-slate-500">
            Un lien de confirmation vient de t'être envoyé à {email}.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 text-sm text-orange-600 hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6"
      >
        <h1 className="text-xl font-bold text-slate-900 mb-1">Inscription</h1>
        <p className="text-sm text-slate-500 mb-6">
          Rejoins la communauté MyFigurine
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="text-xs font-medium text-slate-500">
          Nom / pseudo
        </label>
        <input
          type="text"
          required
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full mt-1 mb-4 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />

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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 mb-6 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg"
        >
          {loading ? "Inscription..." : "Créer mon compte"}
        </button>

        <p className="text-sm text-slate-500 text-center mt-4">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-orange-600 hover:underline">
            Connecte-toi
          </Link>
        </p>
      </form>
    </div>
  );
}
