"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CampaignChannel = "email" | "sms";

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: string;
  scheduledAt: string;
}

const DEFAULT_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: "campaign-vara",
    name: "Campanie de vară",
    channel: "email",
    status: "Programată",
    scheduledAt: "2026-07-15",
  },
  {
    id: "campaign-flash-sale",
    name: "Flash sale weekend",
    channel: "sms",
    status: "Trimisă",
    scheduledAt: "2026-06-27",
  },
  {
    id: "campaign-newsletter",
    name: "Newsletter lunar",
    channel: "email",
    status: "Ciornă",
    scheduledAt: "2026-08-01",
  },
];

interface MarketingCampaignState {
  campaigns: MarketingCampaign[];
  addCampaign: (campaign: Omit<MarketingCampaign, "id">) => void;
  updateCampaign: (id: string, campaign: Omit<MarketingCampaign, "id">) => void;
  deleteCampaign: (id: string) => void;
}

export const useMarketingCampaignStore = create<MarketingCampaignState>()(
  persist(
    (set) => ({
      campaigns: DEFAULT_CAMPAIGNS,

      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [...state.campaigns, { ...campaign, id: crypto.randomUUID() }],
        })),

      updateCampaign: (id, campaign) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...campaign } : c)),
        })),

      deleteCampaign: (id) =>
        set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) })),
    }),
    { name: "estelaoferta-marketing-campaigns" },
  ),
);
