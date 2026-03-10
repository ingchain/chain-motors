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

  const categories = useMemo(() => ["", "motor", "accesorio", "servicio"], []);

  return (
    <section>
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Buscar motor o componente"
          className="neon-border rounded-md bg-chain-900/40 px-3 py-2 text-sm outline-none"
        />
        <select
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
          className="neon-border rounded-md bg-chain-900/40 px-3 py-2 text-sm outline-none"
        >
          {categories.map((cat: string) => (
            <option key={cat || "all"} value={cat}>
              {cat || "Todas las categorias"}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-chain-200">Cargando productos...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product: Product) => (
            <article key={product.id} className="neon-border rounded-xl bg-chain-900/30 p-5">
              <h3 className="font-display text-base uppercase tracking-wider text-chain-100">{product.name}</h3>
              <p className="mt-2 text-xs uppercase text-chain-300">{product.category}</p>
              <p className="mt-3 text-sm text-chain-200/90">{product.description || "Sin descripcion"}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-chain-50">${product.price.toFixed(2)}</span>
                <span className="text-chain-300">Stock: {product.stock}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
