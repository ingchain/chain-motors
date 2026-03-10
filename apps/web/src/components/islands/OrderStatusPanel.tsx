import { useEffect, useState } from "react";

import { apiRequest } from "../../lib/api";
import { getAuthState } from "../../stores/authStore";

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
};

type Appointment = {
  id: string;
  service_type: string;
  status: string;
  scheduled_at: string;
};

export default function OrderStatusPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const state = getAuthState();
      if (!state) {
        setError("No hay sesion activa");
        return;
      }

      try {
        const [ordersData, appointmentsData] = await Promise.all([
          apiRequest<Order[]>("/orders/me", {}, state.accessToken),
          apiRequest<Appointment[]>("/appointments/me", {}, state.accessToken)
        ]);
        setOrders(ordersData);
        setAppointments(appointmentsData);
      } catch {
        setError("No se pudo cargar el dashboard del cliente");
      }
    }

    void loadData();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="neon-border rounded-xl bg-chain-900/30 p-5">
        <h2 className="font-display text-lg uppercase tracking-wide">Pedidos</h2>
        {orders.length === 0 && <p className="mt-3 text-sm text-chain-300">Sin pedidos registrados.</p>}
        <ul className="mt-3 space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-md border border-chain-500/40 p-3 text-sm">
              <p>Estado: <strong>{order.status}</strong></p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <p className="text-chain-300">Fecha: {new Date(order.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="neon-border rounded-xl bg-chain-900/30 p-5">
        <h2 className="font-display text-lg uppercase tracking-wide">Citas de Servicio</h2>
        {appointments.length === 0 && <p className="mt-3 text-sm text-chain-300">Sin citas activas.</p>}
        <ul className="mt-3 space-y-3">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="rounded-md border border-chain-500/40 p-3 text-sm">
              <p>Servicio: <strong>{appointment.service_type}</strong></p>
              <p>Estado: <strong>{appointment.status}</strong></p>
              <p className="text-chain-300">Agenda: {new Date(appointment.scheduled_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
