"use client";

import { Check, Trash2, X } from "lucide-react";
import { useReturnsStore, type ReturnRequest, type ReturnStatus } from "@/lib/store/returns-store";
import { formatDate } from "@/lib/format";

const STATUS_LABELS: Record<ReturnStatus, string> = {
  pending: "În așteptare",
  approved: "Aprobat",
  rejected: "Respins",
};

const STATUS_CLASSES: Record<ReturnStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved: "bg-brand-emerald-soft text-brand-emerald",
  rejected: "bg-destructive/10 text-destructive",
};

export default function AdminReturnsPage() {
  const requests = useReturnsStore((s) => s.requests);
  const updateStatus = useReturnsStore((s) => s.updateStatus);
  const deleteRequest = useReturnsStore((s) => s.deleteRequest);

  function setStatus(request: ReturnRequest, status: ReturnStatus) {
    updateStatus(request.id, status);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Retururi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {requests.length} cereri de retur trimise de clienți prin formularul de pe site.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Comandă</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Produs</th>
              <th className="p-4 font-medium">Motiv</th>
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="p-4 font-medium text-foreground">{request.orderNumber}</td>
                <td className="p-4 text-muted-foreground">
                  <div className="flex flex-col">
                    <span className="text-foreground">{request.customerName}</span>
                    <span className="text-xs">{request.email}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{request.productName}</td>
                <td className="p-4 max-w-xs text-muted-foreground">
                  <p>{request.reason}</p>
                  {request.comments && (
                    <p className="mt-1 line-clamp-2 text-xs">{request.comments}</p>
                  )}
                </td>
                <td className="p-4 text-muted-foreground">{formatDate(request.createdAt)}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[request.status]}`}
                  >
                    {STATUS_LABELS[request.status]}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    {request.status !== "approved" && (
                      <button
                        onClick={() => setStatus(request, "approved")}
                        aria-label="Aprobă"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-brand-emerald-soft hover:text-brand-emerald"
                      >
                        <Check className="size-3.5" />
                      </button>
                    )}
                    {request.status !== "rejected" && (
                      <button
                        onClick={() => setStatus(request, "rejected")}
                        aria-label="Respinge"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteRequest(request.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-muted-foreground">
                  Nicio cerere de retur încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
