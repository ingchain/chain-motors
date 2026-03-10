import PrivateRouteGuard from "./PrivateRouteGuard";
import OrderStatusPanel from "./OrderStatusPanel";

export default function ClientDashboard() {
  return (
    <PrivateRouteGuard requiredRole="client">
      <h1 className="mb-4 font-display text-2xl uppercase tracking-wider">Panel Cliente</h1>
      <OrderStatusPanel />
    </PrivateRouteGuard>
  );
}
