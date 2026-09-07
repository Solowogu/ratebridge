import type { ProviderQuote } from "./types";

type OFXTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
};

type OFXRateResponse = {
  OfxRate?: number;
  InverseOfxRate?: number;
  SellAmount?: number;
  MarketRate?: number;
  InverseMarketRate?: number;
};

const OFX_TOKEN_URL =
  process.env.OFX_TOKEN_URL ??
  "https://sandbox.api.ofx.com/v1/oauth/token";

const OFX_API_BASE_URL =
  process.env.OFX_API_BASE_URL ??
  "https://sandbox.api.ofx.com/v1";

async function getOFXAccessToken(): Promise<string> {
  const clientId = process.env.OFX_API_KEY;
  const clientSecret = process.env.OFX_API_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("OFX API credentials are not configured.");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "ofxrates",
  });

  const response = await fetch(OFX_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();

    console.error(
      "OFX token request failed:",
      response.status,
      errorBody
    );

    throw new Error(
      "Unable to authenticate with OFX."
    );
  }

  const data =
    (await response.json()) as OFXTokenResponse;

  if (!data.access_token) {
    throw new Error(
      "OFX did not return an access token."
    );
  }

  return data.access_token;
}

export async function getOFXQuote(
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<ProviderQuote> {
  if (
    !fromCurrency ||
    !toCurrency ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error("Invalid OFX quote request.");
  }

  const sourceCurrency =
    fromCurrency.trim().toUpperCase();

  const targetCurrency =
    toCurrency.trim().toUpperCase();

  const accessToken =
    await getOFXAccessToken();

  const response = await fetch(
    `${OFX_API_BASE_URL}/ofxrates/${sourceCurrency}/${targetCurrency}/${amount}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    console.error(
      "OFX rate request failed:",
      response.status,
      errorBody
    );

    throw new Error(
      "Unable to retrieve an OFX rate."
    );
  }

  const data =
    (await response.json()) as OFXRateResponse;

  const rate = data.InverseOfxRate;

if (
  typeof rate !== "number" ||
  !Number.isFinite(rate)
) {
  throw new Error(
    "OFX returned an invalid exchange rate."
  );
}

const recipientReceives = amount * rate;
  return {
    provider: "OFX",
    rate,
    fee: 0,
    recipientReceives,
    deliveryTime: "1 to 3 business days",
    isLive: true,
    quoteType: "live",
    updatedAt: new Date().toISOString(),
    source: "OFX Rates API",
  };
}