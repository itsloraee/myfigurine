interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  releaseDate: string; // format ISO : "2026-03-15"
  gradient: string;
}

const gradients: string[] = [
  "from-slate-700 to-slate-900",
  "from-teal-500 to-teal-700",
  "from-red-600 to-orange-700",
  "from-pink-400 to-rose-600",
  "from-indigo-500 to-purple-700",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-700",
  "from-violet-500 to-fuchsia-700",
  "from-cyan-500 to-blue-700",
  "from-rose-500 to-red-700",
];

const products: Product[] = [
  {
    id: "1",
    title: "Chevalier draconique - Édition limitée",
    description: "Figurine articulée avec armure détachable et socle lumineux.",
    price: 89,
    releaseDate: "2026-03-15",
    gradient: gradients[0],
  },
  {
    id: "2",
    title: "Renarde des neiges - Ver. hiver",
    description: "Statuette peinte à la main, matériau PVC haute qualité.",
    price: 65,
    releaseDate: "2025-11-02",
    gradient: gradients[1],
  },
  {
    id: "3",
    title: "Samouraï cybernétique",
    description: "Échelle 1/7, accessoires interchangeables inclus.",
    price: 120,
    releaseDate: "2026-01-20",
    gradient: gradients[2],
  },
  {
    id: "4",
    title: "Sorcière des marais",
    description: "Chibi collector, finition mate, édition numérotée.",
    price: 45,
    releaseDate: "2025-09-10",
    gradient: gradients[3],
  },
  {
    id: "5",
    title: "Golem de cristal",
    description: "Grande statue résine, base rotative à LED.",
    price: 210,
    releaseDate: "2026-05-01",
    gradient: gradients[4],
  },
  {
    id: "6",
    title: "Pilote spectrale",
    description: "Figurine échelle 1/8 avec cockpit miniature détaillé.",
    price: 98,
    releaseDate: "2026-02-14",
    gradient: gradients[5],
  },
  {
    id: "7",
    title: "Gardien de la forêt ancienne",
    description: "Diorama complet avec socle végétal sculpté.",
    price: 150,
    releaseDate: "2025-12-25",
    gradient: gradients[6],
  },
  {
    id: "8",
    title: "Danseuse céleste",
    description: "Pose dynamique, tissu en résine translucide.",
    price: 75,
    releaseDate: "2026-04-08",
    gradient: gradients[7],
  },
  {
    id: "9",
    title: "Forgeron des abysses",
    description: "Figurine premium avec marteau amovible et effets de flammes.",
    price: 135,
    releaseDate: "2026-06-19",
    gradient: gradients[8],
  },
  {
    id: "10",
    title: "Louve céleste - Ver. exclusive convention",
    description: "Tirage limité à 500 exemplaires, certificat d'authenticité inclus.",
    price: 180,
    releaseDate: "2025-10-30",
    gradient: gradients[9],
  },
];

function formatPrice(price: number): string {
  return `${price} €`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className={`h-40 bg-gradient-to-br ${product.gradient}`} />
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-semibold text-slate-900">{product.title}</p>
        <p className="text-xs text-slate-500 mt-1 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <span className="text-base font-bold text-orange-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-slate-400">
            {formatDate(product.releaseDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Nouveautés figurines
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
