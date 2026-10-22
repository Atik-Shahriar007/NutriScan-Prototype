import Constants from "expo-constants";

export type DonationChannel = {
  provider: "bKash" | "Nagad";
  account: string | null;
  instruction: string;
};

type PublicRuntime = {
  donationUrl?: string;
  bkashDonationNumber?: string;
  nagadDonationNumber?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as PublicRuntime;

function safeHttpUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const supportConfig = {
  donationUrl: safeHttpUrl(extra.donationUrl),
  channels: [
    {
      provider: "bKash" as const,
      account: extra.bkashDonationNumber?.trim() || null,
      instruction: "Use Send Money and add NutriScan support in the reference.",
    },
    {
      provider: "Nagad" as const,
      account: extra.nagadDonationNumber?.trim() || null,
      instruction: "Use Send Money and add NutriScan support in the reference.",
    },
  ] satisfies DonationChannel[],
};

export const configuredDonationChannels = supportConfig.channels.filter((channel) => channel.account);
