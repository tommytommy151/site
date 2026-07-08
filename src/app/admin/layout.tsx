import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-surface-sunken">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
