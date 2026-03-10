import { useEffect, useMemo, useState } from "react";

import { apiRequest } from "../../lib/api";
import { getAuthState } from "../../stores/authStore";

type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
};

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  async function loadOrders() {
    const session = getAuthState();
    if (!session) {
      return;
    }

    try {
      const data = await apiRequest<Order[]>("/admin/orders", {}, session.accessToken);
      setOrders(data);
    } catch {
      setError("No se pudieron cargar pedidos");
    }
  }

  async function updateOrder(orderId: string, nextStatus: string) {
    const session = getAuthState();
    if (!session) {
      return;
    }

    try {
      await apiRequest(`/admin/orders/${orderId}/status?status_value=${nextStatus}`, {
        method: "PATCH"
      }, session.accessToken);

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)));
    } catch {
      setError("No se pudo actualizar estado");
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const grouped = useMemo(() => {
    return statusOptions.map((status) => ({ status, items: orders.filter((order) => order.status === status) }));
  }, [orders]);

  return (
    <section className="neon-border rounded-xl bg-chain-900/30 p-5">
      <h2 className="font-display text-lg uppercase tracking-wide">Estado de Pedidos (Tiempo Real)</h2>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {grouped.map((col) => (
          <article key={col.status} className="rounded-md border border-chain-500/40 p-3">
            <h3 className="text-xs uppercase tracking-wider text-chain-300">{col.status}</h3>
            <ul className="mt-2 space-y-2">
              {col.items.map((order) => (
                <li key={order.id} className="rounded-md border border-chain-500/20 p-2 text-xs">
                  <p>Pedido: {order.id.slice(-6)}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                  <select
                    className="mt-2 w-full rounded border border-chain-500/60 bg-chain-950/60 px-2 py-1"
                    value={order.status}
                    onChange={(e) => void updateOrder(order.id, e.target.value)}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
