import { useEffect, useState } from "react";

import { apiRequest } from "../../lib/api";
import { getAuthState } from "../../stores/authStore";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export default function AdminInventoryTable() {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState("");

  async function loadProducts() {
    const session = getAuthState();
    if (!session) {
      return;
    }

    try {
      const data = await apiRequest<Product[]>("/admin/products", {}, session.accessToken);
      setItems(data);
    } catch {
      setError("No se pudo cargar el inventario");
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  return (
    <section className="neon-border rounded-xl bg-chain-900/30 p-5">
      <h2 className="font-display text-lg uppercase tracking-wide">Inventario de Motores</h2>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-chain-500/40 text-left text-chain-300">
              <th className="py-2">Nombre</th>
              <th className="py-2">Categoria</th>
              <th className="py-2">Precio</th>
              <th className="py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-chain-500/20">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.category}</td>
                <td className="py-2">${item.price.toFixed(2)}</td>
                <td className="py-2">{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
