"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  useMarketingCampaignStore,
  type MarketingCampaign,
  type CampaignChannel,
} from "@/lib/store/marketing-campaigns-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<MarketingCampaign, "id">;

const EMPTY_FORM: FormState = { name: "", channel: "email", status: "Ciornă", scheduledAt: "" };

const CHANNEL_LABELS: Record<CampaignChannel, string> = {
  email: "Email",
  sms: "SMS",
};

export default function AdminMarketingCampaignsPage() {
  const campaigns = useMarketingCampaignStore((s) => s.campaigns);
  const addCampaign = useMarketingCampaignStore((s) => s.addCampaign);
  const updateCampaign = useMarketingCampaignStore((s) => s.updateCampaign);
  const deleteCampaign = useMarketingCampaignStore((s) => s.deleteCampaign);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(campaign: MarketingCampaign) {
    setEditingId(campaign.id);
    setForm({
      name: campaign.name,
      channel: campaign.channel,
      status: campaign.status,
      scheduledAt: campaign.scheduledAt,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateCampaign(editingId, form);
    } else {
      addCampaign(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campanii de marketing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {campaigns.length} campanii — comunicări programate pe email sau SMS.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă campanie
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Nume</th>
              <th className="p-4 font-medium">Canal</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Programată la</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="p-4 font-medium text-foreground">{campaign.name}</td>
                <td className="p-4 text-muted-foreground">{CHANNEL_LABELS[campaign.channel]}</td>
                <td className="p-4 text-muted-foreground">{campaign.status}</td>
                <td className="p-4 text-muted-foreground">{campaign.scheduledAt}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(campaign)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted-foreground">
                  Nicio campanie încă. Adaugă prima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează campania" : "Campanie nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="campaign-name" className="mb-1.5">
                Nume
              </Label>
              <Input
                id="campaign-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Campanie de vară"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Canal</Label>
              <Select
                value={form.channel}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, channel: value as CampaignChannel }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="campaign-status" className="mb-1.5">
                Status
              </Label>
              <Input
                id="campaign-status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                placeholder="ex. Programată"
                required
              />
            </div>
            <div>
              <Label htmlFor="campaign-scheduled" className="mb-1.5">
                Programată la
              </Label>
              <Input
                id="campaign-scheduled"
                type="date"
                value={form.scheduledAt}
                onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă campania"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
