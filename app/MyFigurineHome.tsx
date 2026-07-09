"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Heart,
  User,
  Plus,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthProvider";

interface Listing {
  id: string;
  title: string;
  serie: string;
  price: string;
  city: string;
  time: string;
  imageUrl: string | null;
  gradient: string;
}

interface AnnonceRow {
  id: string;
  titre: string;
  prix: number;
  ville: string | null;
  date_publication: string;
  categorie: { titre: string }[] | null;
  image: { url: string }[];
}

interface Category {
  label: string;
  count: string;
  emoji: string;
}

// Dégradés de secours utilisés quand une annonce n'a pas encore d'image
const fallbackGradients: string[] = [
  "from-slate-700 to-slate-900",
  "from-teal-500 to-teal-700",
  "from-red-600 to-orange-700",
  "from-pink-400 to-rose-600",
];

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "À l'instant";
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

const categories: Category[] = [
  { label: "Anime", count: "1 234 annonces", emoji: "⭐" },
  { label: "Manga", count: "875 annonces", emoji: "📖" },
  { label: "Jeux vidéo", count: "1 102 annonces", emoji: "🎮" },
  { label: "Chibi / Nendoroid", count: "642 annonces", emoji: "🙂" },
  { label: "Statues", count: "328 annonces", emoji: "🏆" },
  { label: "Autres", count: "214 annonces", emoji: "⋯" },
];

const securityTips: string[] = [
  "Ne payez jamais en dehors de la plateforme",
  "Privilégiez la remise en main propre",
  "Vérifiez bien l'état de la figurine",
];

interface NavLinkProps {
  children: ReactNode;
  active?: boolean;
}

function NavLink({ children, active }: NavLinkProps) {
  return (
    <a
      href="#"
      className={`text-sm font-medium transition-colors ${
        active
          ? "text-orange-600 border-b-2 border-orange-600 pb-1"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {children}
    </a>
  );
}

interface ListingCardProps {
  item: Listing;
}

function ListingCard({ item }: ListingCardProps) {
  const [fav, setFav] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`relative h-48 bg-gradient-to-br ${item.gradient}`}>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <button
          onClick={() => setFav((f) => !f)}
          aria-label="Ajouter aux favoris"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
        >
          <Heart
            size={16}
            className={fav ? "fill-orange-500 text-orange-500" : "text-slate-500"}
          />
        </button>
      </div>
      <div className="p-4">
        <p className="text-lg font-semibold text-slate-900">{item.price}</p>
        <p className="text-sm font-medium text-slate-800 mt-1">{item.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{item.serie}</p>
        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {item.city}
          </span>
          <span>{item.time}</span>
        </div>
      </div>
    </div>
  );
}

export default function MyFigurineHome() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchAnnonces() {
      setLoading(true);

      const { count } = await supabase
        .from("annonce")
        .select("id", { count: "exact", head: true })
        .eq("statut", "active");
      setTotalCount(count ?? 0);

      const { data, error } = await supabase
        .from("annonce")
        .select(
          `id, titre, prix, ville, date_publication,
           categorie:categorie_id ( titre ),
           image ( url )`
        )
        .eq("statut", "active")
        .order("date_publication", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Erreur chargement annonces :", error.message);
        setListings([]);
        setLoading(false);
        return;
      }

      const formatted: Listing[] = (data ?? []).map(
        (annonce: AnnonceRow, i: number) => ({
          id: annonce.id,
          title: annonce.titre,
          serie: annonce.categorie?.[0]?.titre ?? "Figurine",
          price: `${annonce.prix} €`,
          city: annonce.ville ?? "Non renseignée",
          time: timeAgo(annonce.date_publication),
          imageUrl: annonce.image?.[0]?.url ?? null,
          gradient: fallbackGradients[i % fallbackGradients.length],
        })
      );

      setListings(formatted);
      setLoading(false);
    }

    fetchAnnonces();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-orange-600">My</span>
              <span className="text-xl font-bold text-slate-900">Figurine</span>
              <Sparkles size={14} className="text-orange-400" />
            </div>
            <p className="text-xs text-slate-400 -mt-1">
              Le bon coin des figurines
            </p>
          </div>

          <div className="flex-1 flex items-center gap-3 max-w-2xl">
            <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une figurine, un personnage..."
                className="flex-1 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 w-48">
              <MapPin size={16} className="text-slate-400" />
              <span className="text-sm text-slate-500">Toute la France</span>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2 rounded-lg whitespace-nowrap">
              Rechercher
            </button>
          </div>

          <nav className="flex items-center gap-6 ml-auto">
            <NavLink active>Accueil</NavLink>
            <NavLink>Déposer une annonce</NavLink>
            <NavLink>Mes annonces</NavLink>
            <NavLink>Favoris</NavLink>
          </nav>

          {!authLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-orange-700">
                      {(user.user_metadata?.nom ?? user.email ?? "?")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-slate-500 hover:text-slate-800"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  aria-label="Se connecter"
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center"
                >
                  <User size={16} className="text-slate-500" />
                </Link>
              )}
            </>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 p-10 flex items-center justify-between">
              <div className="max-w-md relative z-10">
                <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                  Trouvez la figurine qui manque à votre{" "}
                  <span className="text-orange-500">collection</span>
                </h1>
                <p className="text-slate-500 mt-3">
                  Achat, vente et échange entre passionnés.
                </p>
                <div className="flex gap-3 mt-6">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg">
                    Voir les annonces
                  </button>
                  <button className="bg-white border border-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg flex items-center gap-2">
                    <Plus size={16} />
                    Déposer une annonce
                  </button>
                </div>
              </div>
              <div className="hidden md:block w-48 h-64 rounded-xl bg-gradient-to-br from-pink-300 to-rose-400 shrink-0" />
              <div className="absolute -right-10 top-6 w-40 h-40 rounded-full bg-orange-200/40" />
              <div className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-pink-200/50" />
            </section>

            <section className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  Catégories populaires
                </h2>
                <a
                  href="#"
                  className="text-sm text-orange-600 flex items-center gap-1 hover:underline"
                >
                  Voir toutes les catégories
                  <ChevronRight size={14} />
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.label}
                    className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2 hover:border-orange-300 cursor-pointer"
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {cat.label}
                      </p>
                      <p className="text-xs text-slate-400">{cat.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  Annonces récentes
                </h2>
                <a
                  href="#"
                  className="text-sm text-orange-600 flex items-center gap-1 hover:underline"
                >
                  Voir toutes les annonces
                  <ChevronRight size={14} />
                </a>
              </div>
              {loading ? (
                <p className="text-sm text-slate-400">
                  Chargement des annonces...
                </p>
              ) : listings.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Aucune annonce pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {listings.map((item) => (
                    <ListingCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-4">
                Affiner la recherche
              </h3>

              <label className="text-xs font-medium text-slate-500">
                Catégorie
              </label>
              <select className="w-full mt-1 mb-4 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
                <option>Toutes les catégories</option>
              </select>

              <label className="text-xs font-medium text-slate-500">Prix</label>
              <div className="flex items-center gap-2 mt-1 mb-4">
                <input
                  placeholder="Min"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <span className="text-slate-400 text-sm">à</span>
                <input
                  placeholder="Max"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <label className="text-xs font-medium text-slate-500">État</label>
              <div className="mt-1 mb-4 space-y-2">
                {["Neuf", "Très bon état", "Bon état", "État correct"].map(
                  (etat) => (
                    <label
                      key={etat}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <input type="checkbox" className="rounded" />
                      {etat}
                    </label>
                  )
                )}
              </div>

              <label className="text-xs font-medium text-slate-500">
                Livraison
              </label>
              <div className="mt-1 mb-4 space-y-2">
                {["Livraison possible", "Remise en main propre"].map(
                  (opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <input type="checkbox" defaultChecked className="rounded" />
                      {opt}
                    </label>
                  )
                )}
              </div>

              <label className="text-xs font-medium text-slate-500">
                Localisation
              </label>
              <select className="w-full mt-1 mb-4 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
                <option>Toute la France</option>
              </select>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2.5 rounded-lg">
                Voir {totalCount} annonces
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900">
                Vendez en toute simplicité
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Déposez gratuitement vos annonces et touchez des passionnés.
              </p>
              <button className="mt-3 border border-slate-200 text-sm font-medium px-4 py-2 rounded-lg text-slate-700">
                Déposer une annonce
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-3">
                Conseils sécurité
              </h3>
              <ul className="space-y-2">
                {securityTips.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <ShieldCheck
                      size={16}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="text-sm text-orange-600 hover:underline block mt-3"
              >
                Voir tous nos conseils
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
