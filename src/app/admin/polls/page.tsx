"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { usePollsStore, type Poll } from "@/lib/store/polls-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<Poll, "id">;

const EMPTY_FORM: FormState = { question: "", options: [], active: true };

export default function AdminPollsPage() {
  const polls = usePollsStore((s) => s.polls);
  const addPoll = usePollsStore((s) => s.addPoll);
  const updatePoll = usePollsStore((s) => s.updatePoll);
  const deletePoll = usePollsStore((s) => s.deletePoll);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [optionDraft, setOptionDraft] = useState("");

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOptionDraft("");
    setOpen(true);
  }

  function openEdit(poll: Poll) {
    setEditingId(poll.id);
    setForm({ question: poll.question, options: poll.options, active: poll.active });
    setOptionDraft("");
    setOpen(true);
  }

  function addOption() {
    const v = optionDraft.trim();
    if (!v || form.options.includes(v)) return;
    setForm((f) => ({ ...f, options: [...f.options, v] }));
    setOptionDraft("");
  }

  function removeOption(option: string) {
    setForm((f) => ({ ...f, options: f.options.filter((o) => o !== option) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || form.options.length === 0) return;
    if (editingId) {
      updatePoll(editingId, form);
    } else {
      addPoll(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sondaje</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sondaje de opinie afișate clienților, cu opțiuni de răspuns configurabile.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă sondaj
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <div key={poll.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground">{poll.question}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(poll)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deletePoll(poll.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {poll.options.map((o) => (
                <span
                  key={o}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {o}
                </span>
              ))}
            </div>
            <span
              className={
                "mt-3 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium " +
                (poll.active
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground")
              }
            >
              {poll.active ? "Activ" : "Inactiv"}
            </span>
          </div>
        ))}
        {polls.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai niciun sondaj încă. Adaugă primul (ex. Ce metodă de livrare preferi?).
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează sondajul" : "Sondaj nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="poll-question" className="mb-1.5">
                Întrebare
              </Label>
              <Input
                id="poll-question"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="ex. Ce metodă de livrare preferi?"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Opțiuni de răspuns</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={optionDraft}
                  onChange={(e) => setOptionDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                  placeholder="ex. Curier rapid"
                />
                <Button type="button" variant="outline" onClick={addOption}>
                  Adaugă
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.options.map((o) => (
                  <span
                    key={o}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {o}
                    <button type="button" onClick={() => removeOption(o)} aria-label={`Șterge ${o}`}>
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                {form.options.length === 0 && (
                  <p className="text-xs text-muted-foreground">Adaugă cel puțin o opțiune.</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activ</p>
                <p className="text-xs text-muted-foreground">
                  Doar sondajele active sunt afișate clienților
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă sondajul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
