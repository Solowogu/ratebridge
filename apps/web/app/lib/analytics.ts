
type ProviderVisitDetails = {
  providerName: string;
  fromCurrency?: string;
  toCurrency?: string;
  clickLocation?: string;
};

export function trackProviderVisit({
  providerName,
  fromCurrency,
  toCurrency,
  clickLocation,
}: ProviderVisitDetails) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
  };

  analyticsWindow.gtag?.("event", "provider_visit", {
    provider_name: providerName,
    ...(fromCurrency ? { from_currency: fromCurrency } : {}),
    ...(toCurrency ? { to_currency: toCurrency } : {}),
    ...(clickLocation ? { click_location: clickLocation } : {}),
  });
}
