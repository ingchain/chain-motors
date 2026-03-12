import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import { apiRequest } from "../../lib/api";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
};

type ProductResponse = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
};

export default function ProductGrid() {
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        const data = await apiRequest<ProductResponse>(`/products?${params.toString()}`);
        if (mounted) {
          setItems(data.items);
        }
      } catch {
        if (mounted) setError("No se pudo cargar el catalogo");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadProducts();
    return () => {
      mounted = false;
    };
  }, [search, category]);

  const categories = useMemo(
    () => [
      { value: "", label: "Todas" },
      { value: "motor", label: "Motor" },
      { value: "accesorio", label: "Accesorio" },
      { value: "servicio", label: "Servicio" }
    ],
    []
  );

  return (
    <section className="overflow-x-hidden">
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Buscar motor o componente"
          className="neon-border w-full min-w-0 rounded-md bg-white px-3 py-2 text-sm outline-none"
        />

        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const active = category === cat.value;
              return (
                <button
                  key={cat.value || "all"}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`neon-border w-full rounded-md px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-chain-500 text-white" : "bg-white text-chain-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <select
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
          className="neon-border hidden w-full min-w-0 rounded-md bg-white px-3 py-2 text-sm outline-none md:block"
        >
          {categories.map((cat) => (
            <option key={cat.value || "all"} value={cat.value}>
              {cat.value ? cat.value : "Todas las categorias"}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-chain-200">Cargando productos...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product: Product) => (
            <article key={product.id} className="neon-border rounded-lg bg-white p-5">
              <h3 className="font-display text-base font-semibold text-chain-100">{product.name}</h3>
              <p className="mt-2 text-xs uppercase text-chain-400">{product.category}</p>
              <p className="mt-3 text-sm text-chain-300">{product.description || "Sin descripcion"}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-chain-200">${product.price.toFixed(2)}</span>
                <span className="text-chain-400">Stock: {product.stock}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
