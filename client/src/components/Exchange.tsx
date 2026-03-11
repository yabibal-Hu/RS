const etbToUsdtRate = 155;

export function Exchange(
  etbAmount: number,
  method: string = "",
): { value: number; currency: string } {
  // const fromLocalStorage = localStorage.getItem("selectedCurrency") || "ETB";

  // If method is provided, use it; otherwise, use the value from localStorage
  const selectedCurrency = method || "ETB";
  const ExchangePrice = (selectedPriceType: string) => {
    switch (selectedPriceType) {
      case "ETB":
        return { value: etbAmount || 0, currency: "ETB" };
      case "USDT":
        return {
          value: Number((etbAmount / etbToUsdtRate).toFixed(2)),
          currency: "USDT",
        };
      case "EUR":
        return { value: Number((etbAmount / 185).toFixed(2)), currency: "EUR" };
      case "KES":
        return { value: Number((etbAmount / 1.2).toFixed(2)), currency: "KES" };
      case "NGN":
        return { value: Number((etbAmount / 0.1).toFixed(2)), currency: "NGN" };
      case "ZAR":
        return { value: Number((etbAmount / 9.7).toFixed(2)), currency: "ZAR" };
      case "ZMW":
        return { value: Number((etbAmount / 8.2).toFixed(2)), currency: "ZMW" };
      default:
        return { value: 0, currency: "ETB" };
    }
  };
  return ExchangePrice(selectedCurrency);
}

export function ToUSDT(etbAmount: number): number {
  return Number((etbAmount / etbToUsdtRate).toFixed(2));
}

// to etb export function
export function ToETB(amount: number, fromCurrency: string): number {
  switch (fromCurrency) {
    case "ETB":
      return amount;
    case "USDT":
      return Number((amount * etbToUsdtRate).toFixed(2));
    case "EUR":
      return Number((amount * 185).toFixed(2));
    case "KES":
      return Number((amount * 1.2).toFixed(2));
    case "NGN":
      return Number((amount * 0.1).toFixed(2));
    case "ZAR":
      return Number((amount * 9.7).toFixed(2));
    case "ZMW":
      return Number((amount * 8.2).toFixed(2));
    default:
      return 0;
  }
}
