export type ProviderQuote = {
  provider: string;
  rate: number;
  fee: number;
  recipientReceives: number;
   deliveryTime: string;
  paymentMethod?: string;
  isLive: boolean;
  quoteType: "live" | "estimated";
  updatedAt: string;
  source: string;
};