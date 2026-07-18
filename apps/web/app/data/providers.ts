export type Provider = {
  name: string;
  initials: string;
  badgeColor: "green" | "blue" | "yellow";
  rating: number;
  rateMultiplier: number;
  fee: number;
  deliveryTime: string;
  website: string;
};

export const providers: Provider[] = [
  {
    name: "Wise",
    initials: "W",
    badgeColor: "green",
    rating: 4.8,
    rateMultiplier: 0.995,
    fee: 5.99,
    deliveryTime: "Within minutes",
    website: "https://wise.com",
  },
  {
    name: "Remitly",
    initials: "R",
    badgeColor: "blue",
    rating: 4.7,
    rateMultiplier: 0.99,
    fee: 3.99,
    deliveryTime: "Within 30 minutes",
    website: "https://www.remitly.com",
  },
  {
    name: "Western Union",
    initials: "WU",
    badgeColor: "yellow",
    rating: 4.5,
    rateMultiplier: 0.98,
    fee: 0,
    deliveryTime: "Same day",
    website: "https://www.westernunion.com",
  },
];