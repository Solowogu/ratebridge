export type ProviderQuote = {
  provider: string;
  rate: number;
  fee: number;
  recipientReceives: number;
  deliveryTime: string;
  isLive: boolean;
};