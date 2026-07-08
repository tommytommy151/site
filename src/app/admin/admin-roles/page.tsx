"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useAdminRoleStore, type AdminRole } from "@/lib/store/admin-roles-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<AdminRole, "id">;

const EMPTY_FORM: FormState = { name: "", permissions: [] };

export default function AdminRolesPage() {
  const adminRoles = useAdminRoleStore((s) => s.adminRoles);
  const addAdminRole = useAdminRoleStore((s) => s.addAdminRole);
  const updateAdminRole = useAdminRoleStore((s) => s.updateAdminRole);
  const deleteAdminRole = useAdminRoleStore((s) => s.deleteAdminRole);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [permissionDraft, setPermissionDraft] = useState("");

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPermissionDraft("");
    setOpen(true);
  }

  function openEdit(role: AdminRole) {
    setEditingId(role.id);
    setForm({ name: role.name, permissions: role.permissions });
    setPermissionDraft("");
    setOpen(true);
  }

  function addPermission() {
    const p = permissionDraft.trim();
    if (!p || form.permissions.includes(p)) return;
    setForm((f) => ({ ...f, permissions: [...f.permissions, p] }));
    setPermissionDraft("");
  }

  function removePermission(permission: string) {
    setForm((f) => ({ ...f, permissions: f.permissions.filter((p) => p !== permission) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || form.permissions.length === 0) return;
    if (editingId) {
      updateAdminRole(editingId, form);
    } else {
      addAdminRole(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roluri administratori</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Roluri și permisiunile asociate pentru conturile din echipa ta.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă rol
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminRoles.map((role) => (
          <div key={role.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground">{role.name}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(role)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deleteAdminRole(role.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {role.permissions.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
        {adminRoles.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai niciun rol încă. Adaugă primul (ex. Administrator).
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează rolul" : "Rol nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="role-name" className="mb-1.5">
                Nume rol
              </Label>
              <Input
                id="role-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Manager magazin"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Permisiuni</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={permissionDraft}
                  onChange={(e) => setPermissionDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPermission();
                    }
                  }}
                  placeholder="ex. Comenzi"
                />
                <Button type="button" variant="outline" onClick={addPermission}>
                  Adaugă
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.permissions.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {p}
                    <button
                      type="button"
                      onClick={() => removePermission(p)}
                      aria-label={`Șterge ${p}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                {form.permissions.length === 0 && (
                  <p className="text-xs text-muted-foreground">Adaugă cel puțin o permisiune.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă rolul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
