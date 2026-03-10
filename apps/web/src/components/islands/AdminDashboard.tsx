import AdminInventoryTable from "./AdminInventoryTable";
import AdminOrderBoard from "./AdminOrderBoard";
import PrivateRouteGuard from "./PrivateRouteGuard";

export default function AdminDashboard() {
  return (
    <PrivateRouteGuard requiredRole="admin">
      <h1 className="mb-4 font-display text-2xl uppercase tracking-wider">Panel Administrador</h1>
      <div className="grid gap-6">
        <AdminInventoryTable />
        <AdminOrderBoard />
      </div>
    </PrivateRouteGuard>
  );
}
