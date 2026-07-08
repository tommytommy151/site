"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  useLocalesCurrenciesStore,
  type Currency,
  type Language,
} from "@/lib/store/locales-currencies-store";
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

type CurrencyFormState = Omit<Currency, "id">;
type LanguageFormState = Omit<Language, "id">;

const EMPTY_CURRENCY_FORM: CurrencyFormState = { code: "", symbol: "", rate: 1, active: true };
const EMPTY_LANGUAGE_FORM: LanguageFormState = { code: "", name: "", active: true };

export default function AdminLocalesCurrenciesPage() {
  const currencies = useLocalesCurrenciesStore((s) => s.currencies);
  const addCurrency = useLocalesCurrenciesStore((s) => s.addCurrency);
  const updateCurrency = useLocalesCurrenciesStore((s) => s.updateCurrency);
  const deleteCurrency = useLocalesCurrenciesStore((s) => s.deleteCurrency);

  const languages = useLocalesCurrenciesStore((s) => s.languages);
  const addLanguage = useLocalesCurrenciesStore((s) => s.addLanguage);
  const updateLanguage = useLocalesCurrenciesStore((s) => s.updateLanguage);
  const deleteLanguage = useLocalesCurrenciesStore((s) => s.deleteLanguage);

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [editingCurrencyId, setEditingCurrencyId] = useState<string | null>(null);
  const [currencyForm, setCurrencyForm] = useState<CurrencyFormState>(EMPTY_CURRENCY_FORM);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [editingLanguageId, setEditingLanguageId] = useState<string | null>(null);
  const [languageForm, setLanguageForm] = useState<LanguageFormState>(EMPTY_LANGUAGE_FORM);

  function openCreateCurrency() {
    setEditingCurrencyId(null);
    setCurrencyForm(EMPTY_CURRENCY_FORM);
    setCurrencyOpen(true);
  }

  function openEditCurrency(currency: Currency) {
    setEditingCurrencyId(currency.id);
    setCurrencyForm({
      code: currency.code,
      symbol: currency.symbol,
      rate: currency.rate,
      active: currency.active,
    });
    setCurrencyOpen(true);
  }

  function handleCurrencySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currencyForm.code.trim() || !currencyForm.symbol.trim()) return;
    const payload: CurrencyFormState = {
      ...currencyForm,
      code: currencyForm.code.trim().toUpperCase(),
    };
    if (editingCurrencyId) {
      updateCurrency(editingCurrencyId, payload);
    } else {
      addCurrency(payload);
    }
    setCurrencyOpen(false);
  }

  function openCreateLanguage() {
    setEditingLanguageId(null);
    setLanguageForm(EMPTY_LANGUAGE_FORM);
    setLanguageOpen(true);
  }

  function openEditLanguage(language: Language) {
    setEditingLanguageId(language.id);
    setLanguageForm({ code: language.code, name: language.name, active: language.active });
    setLanguageOpen(true);
  }

  function handleLanguageSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!languageForm.code.trim() || !languageForm.name.trim()) return;
    const payload: LanguageFormState = {
      ...languageForm,
      code: languageForm.code.trim().toLowerCase(),
    };
    if (editingLanguageId) {
      updateLanguage(editingLanguageId, payload);
    } else {
      addLanguage(payload);
    }
    setLanguageOpen(false);
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Limbi & valute</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Valutele și limbile disponibile în magazin, cu ratele de conversie față de leu.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Valute</h2>
          <Button onClick={openCreateCurrency}>
            <Plus className="size-4" />
            Adaugă valută
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                <th className="p-4 font-medium">Cod</th>
                <th className="p-4 font-medium">Simbol</th>
                <th className="p-4 font-medium">Curs (RON)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currencies.map((currency) => (
                <tr key={currency.id}>
                  <td className="p-4 font-mono font-medium text-foreground">{currency.code}</td>
                  <td className="p-4 text-muted-foreground">{currency.symbol}</td>
                  <td className="p-4 text-muted-foreground">{currency.rate}</td>
                  <td className="p-4">
                    <span
                      className={
                        currency.active
                          ? "rounded-full bg-brand-emerald-soft px-2.5 py-1 text-xs font-medium text-brand-emerald"
                          : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {currency.active ? "Activă" : "Inactivă"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditCurrency(currency)}
                        aria-label="Editează"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCurrency(currency.id)}
                        aria-label="Șterge"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currencies.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">
                    Nu ai nicio valută încă.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Limbi</h2>
          <Button onClick={openCreateLanguage}>
            <Plus className="size-4" />
            Adaugă limbă
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                <th className="p-4 font-medium">Cod</th>
                <th className="p-4 font-medium">Nume</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {languages.map((language) => (
                <tr key={language.id}>
                  <td className="p-4 font-mono font-medium text-foreground">{language.code}</td>
                  <td className="p-4 text-muted-foreground">{language.name}</td>
                  <td className="p-4">
                    <span
                      className={
                        language.active
                          ? "rounded-full bg-brand-emerald-soft px-2.5 py-1 text-xs font-medium text-brand-emerald"
                          : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {language.active ? "Activă" : "Inactivă"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditLanguage(language)}
                        aria-label="Editează"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => deleteLanguage(language.id)}
                        aria-label="Șterge"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {languages.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                    Nu ai nicio limbă încă.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCurrencyId ? "Editează valuta" : "Valută nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCurrencySubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="currency-code" className="mb-1.5">
                Cod valută
              </Label>
              <Input
                id="currency-code"
                value={currencyForm.code}
                onChange={(e) =>
                  setCurrencyForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                placeholder="ex. EUR"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency-symbol" className="mb-1.5">
                Simbol
              </Label>
              <Input
                id="currency-symbol"
                value={currencyForm.symbol}
                onChange={(e) => setCurrencyForm((f) => ({ ...f, symbol: e.target.value }))}
                placeholder="ex. €"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency-rate" className="mb-1.5">
                Curs (RON)
              </Label>
              <Input
                id="currency-rate"
                type="number"
                min={0}
                step="0.01"
                value={currencyForm.rate}
                onChange={(e) =>
                  setCurrencyForm((f) => ({ ...f, rate: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activă</p>
                <p className="text-xs text-muted-foreground">
                  Doar valutele active pot fi alese de clienți
                </p>
              </div>
              <Switch
                checked={currencyForm.active}
                onCheckedChange={(checked) =>
                  setCurrencyForm((f) => ({ ...f, active: checked }))
                }
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingCurrencyId ? "Salvează modificările" : "Adaugă valuta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={languageOpen} onOpenChange={setLanguageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLanguageId ? "Editează limba" : "Limbă nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLanguageSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="language-code" className="mb-1.5">
                Cod limbă
              </Label>
              <Input
                id="language-code"
                value={languageForm.code}
                onChange={(e) =>
                  setLanguageForm((f) => ({ ...f, code: e.target.value.toLowerCase() }))
                }
                placeholder="ex. ro"
                required
              />
            </div>
            <div>
              <Label htmlFor="language-name" className="mb-1.5">
                Nume
              </Label>
              <Input
                id="language-name"
                value={languageForm.name}
                onChange={(e) => setLanguageForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Română"
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activă</p>
                <p className="text-xs text-muted-foreground">
                  Doar limbile active apar în selectorul de limbă
                </p>
              </div>
              <Switch
                checked={languageForm.active}
                onCheckedChange={(checked) =>
                  setLanguageForm((f) => ({ ...f, active: checked }))
                }
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingLanguageId ? "Salvează modificările" : "Adaugă limba"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
