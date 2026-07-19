export type Provider = {
  name: string;
  initials: string;
  badgeColor:
  | "green"
  | "blue"
  | "yellow"
  | "purple"
  | "red"
  | "orange"
  | "teal"
  | "pink";
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
    deliveryTime: "Minutes to 1 day",
    website: "https://wise.com",
  },
  {
    name: "Remitly",
    initials: "R",
    badgeColor: "blue",
    rating: 4.7,
    rateMultiplier: 0.99,
    fee: 3.99,
    deliveryTime: "Minutes to 2 days",
    website: "https://www.remitly.com",
  },
  {
    name: "Western Union",
    initials: "WU",
    badgeColor: "yellow",
    rating: 4.5,
    rateMultiplier: 0.98,
    fee: 0,
    deliveryTime: "Minutes to 3 days",
    website: "https://www.westernunion.com",
  },
  {
    name: "OFX",
    initials: "OFX",
    badgeColor: "purple",
    rating: 4.6,
    rateMultiplier: 0.993,
    fee: 0,
    deliveryTime: "1 to 3 business days",
    website: "https://www.ofx.com/en-ca",
  },
  {
    name: "Xe Money Transfer",
    initials: "XE",
    badgeColor: "teal",
    rating: 4.6,
    rateMultiplier: 0.991,
    fee: 2.99,
    deliveryTime: "1 to 3 business days",
    website: "https://www.xe.com/en-ca/send-money",
  },
  {
    name: "WorldRemit",
    initials: "WR",
    badgeColor: "orange",
    rating: 4.5,
    rateMultiplier: 0.988,
    fee: 3.49,
    deliveryTime: "Minutes to 2 days",
    website: "https://www.worldremit.com/en-ca",
  },
  {
    name: "CurrencyFair",
    initials: "CF",
    badgeColor: "pink",
    rating: 4.4,
    rateMultiplier: 0.989,
    fee: 4,
    deliveryTime: "1 to 3 business days",
    website: "https://www.currencyfair.com",
  },
  {
    name: "MoneyGram",
    initials: "MG",
    badgeColor: "red",
    rating: 4.4,
    rateMultiplier: 0.982,
    fee: 4.99,
    deliveryTime: "Minutes to 2 days",
    website: "https://www.moneygram.com",
  },
  {
    name: "LemFi",
    initials: "LF",
    badgeColor: "green",
    rating: 4.8,
    rateMultiplier: 0.996,
    fee: 0,
    deliveryTime: "Usually within minutes",
    website: "https://www.lemfi.com/en-ca",
  },
  {
    name: "CadRemit",
    initials: "CR",
    badgeColor: "blue",
    rating: 4.7,
    rateMultiplier: 0.994,
    fee: 0,
    deliveryTime: "Instant to 2 days",
    website: "https://cadremit.com",
  },
];