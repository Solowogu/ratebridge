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

  supportedCountries: string;
  recommendedFor: string;
  minimumTransfer: number;
  maximumTransfer: number;
  bankDeposit: boolean;
  cashPickup: boolean;
  mobileWallet: boolean;
  transferMethods: string[];
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

  supportedCountries: "170+ countries",

  recommendedFor: "Overall value",

  minimumTransfer: 1,

  maximumTransfer: 1000000,

  bankDeposit: true,

  cashPickup: false,

  mobileWallet: false,

  transferMethods: [
    "Bank Transfer",
    "Debit Card",
    "Credit Card",
  ],
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

  supportedCountries: "170+ countries",
  recommendedFor: "Fast remittances",
  minimumTransfer: 1,
  maximumTransfer: 30000,
  bankDeposit: true,
  cashPickup: true,
  mobileWallet: true,
  transferMethods: ["Bank Transfer", "Debit Card", "Credit Card"],
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

  supportedCountries: "200+ countries and territories",
  recommendedFor: "Cash pickup and broad coverage",
  minimumTransfer: 1,
  maximumTransfer: 50000,
  bankDeposit: true,
  cashPickup: true,
  mobileWallet: true,
  transferMethods: ["Bank Transfer", "Debit Card", "Credit Card", "Cash"],
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

  supportedCountries: "170+ countries",
  recommendedFor: "Large international transfers",
  minimumTransfer: 250,
  maximumTransfer: 1000000,
  bankDeposit: true,
  cashPickup: false,
  mobileWallet: false,
  transferMethods: ["Bank Transfer"],
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

  supportedCountries: "190+ countries",
  recommendedFor: "Foreign-exchange transfers",
  minimumTransfer: 1,
  maximumTransfer: 500000,
  bankDeposit: true,
  cashPickup: false,
  mobileWallet: false,
  transferMethods: ["Bank Transfer", "Debit Card"],
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

  supportedCountries: "130+ countries",
  recommendedFor: "Africa and mobile-money transfers",
  minimumTransfer: 1,
  maximumTransfer: 50000,
  bankDeposit: true,
  cashPickup: true,
  mobileWallet: true,
  transferMethods: ["Bank Transfer", "Debit Card", "Credit Card"],
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

  supportedCountries: "150+ countries",
  recommendedFor: "Bank-to-bank transfers",
  minimumTransfer: 10,
  maximumTransfer: 1000000,
  bankDeposit: true,
  cashPickup: false,
  mobileWallet: false,
  transferMethods: ["Bank Transfer"],
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

  supportedCountries: "200+ countries and territories",
  recommendedFor: "Cash pickup and urgent transfers",
  minimumTransfer: 1,
  maximumTransfer: 10000,
  bankDeposit: true,
  cashPickup: true,
  mobileWallet: true,
  transferMethods: ["Bank Transfer", "Debit Card", "Credit Card", "Cash"],
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

  supportedCountries: "Canada, UK and US to selected African countries",
  recommendedFor: "Canada-to-Africa transfers",
  minimumTransfer: 1,
  maximumTransfer: 25000,
  bankDeposit: true,
  cashPickup: false,
  mobileWallet: true,
  transferMethods: ["Bank Transfer", "Debit Card"],
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

  supportedCountries: "Canada and selected international corridors",
  recommendedFor: "Canada-to-Nigeria transfers",
  minimumTransfer: 1,
  maximumTransfer: 25000,
  bankDeposit: true,
  cashPickup: false,
  mobileWallet: true,
  transferMethods: ["Bank Transfer", "Debit Card"],
},
];