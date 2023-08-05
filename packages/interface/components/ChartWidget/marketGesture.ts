import { MarketGesture } from "@app/hooks";
import { Coordinate } from "lightweight-charts";

export const marketGesture = (
  cordinate: Coordinate | null,
  gesture: MarketGesture
) => {
  const highlight = document.createElement("div");

  if (cordinate) {
    highlight.style.width = "100%";
    highlight.style.height = `calc((100% - ${cordinate.toString()}px) - 32px)`;

    highlight.style.display = "flex";
    highlight.style.position = "absolute";
    highlight.style.top = `${cordinate.toString()}px`;

    if (gesture.isLow) {
      highlight.style.backgroundImage =
        "linear-gradient(to bottom,rgba(219, 73, 33, 0.3),transparent)";

      return highlight;
    }

    if (gesture.isHigh) {
      highlight.style.backgroundImage =
        "linear-gradient(to bottom,rgba(42, 141, 64, 0.3),transparent)";
      highlight.style.transform = "rotate(180deg) translate(0, 100%)";

      return highlight;
    }
  }
  return null;
};
